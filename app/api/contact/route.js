import nodemailer from "nodemailer";
import { validateContactForm, normalizeContactNumber, FIELD_LIMITS } from "../../lib/contactValidation";

export const runtime = "nodejs";

// Best-effort per-instance rate limit (serverless instances do not share memory).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return transporter;
}

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

export async function POST(req) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field.
  if (body.website) {
    return Response.json({ success: true }, { status: 200 });
  }

  const name = clean(body.name, FIELD_LIMITS.name);
  const email = clean(body.email, FIELD_LIMITS.email);
  const contactNumber = clean(body.contactNumber, 30);
  const projectDescription = clean(body.projectDescription, FIELD_LIMITS.projectDescription);
  const companyName = clean(body.companyName, 200);
  const designation = clean(body.designation, 200);
  const budget = clean(body.budget, 100);

  const errors = validateContactForm({ name, email, contactNumber, projectDescription });
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: Object.values(errors)[0], errors }, { status: 400 });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Contact form: EMAIL_USER / EMAIL_PASS are not configured");
    return Response.json({ error: "Unable to send right now. Please email us directly." }, { status: 500 });
  }

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New contact from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company Name: ${companyName}`,
        `Contact Number: ${normalizeContactNumber(contactNumber)}`,
        `Designation: ${designation}`,
        `Budget: ${budget}`,
        `Project Description: ${projectDescription}`,
      ].join("\n"),
    });
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form: failed to send email", err);
    return Response.json({ error: "Unable to send right now. Please try again later." }, { status: 500 });
  }
}
