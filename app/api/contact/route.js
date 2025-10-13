import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Debug: Log environment variables
console.log("Supabase URL in route:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Anon Key in route:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.email || !body.name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const { data, error } = await supabase.from("contacts").insert([body]);
    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    console.log("✅ Supabase insert success:", data);

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
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}