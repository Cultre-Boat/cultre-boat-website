import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      name,
      companyName,
      contactNumber,
      designation,
      budget,
      projectDescription,
    } = body;

    if (!email || !name) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing EMAIL_USER or EMAIL_PASS");
      return Response.json({ error: "Server email config missing" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company Name: ${companyName || ""}
Contact Number: ${contactNumber || ""}
Designation: ${designation || ""}
Budget: ${budget || ""}
Project Description: ${projectDescription || ""}
      `,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Nodemailer error:", err);
    return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}