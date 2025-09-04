import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY 
);

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.email || !body.name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Supabase insert
    const { data, error } = await supabase.from("contacts").insert([body]);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    // Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New contact from ${body.name}`,
      text: JSON.stringify(body, null, 2),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
