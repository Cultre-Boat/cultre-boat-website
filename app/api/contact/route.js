import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_KEY // server-only service key
);

export async function POST(req) {
  try {
    const body = await req.json();

    // Insert into Supabase
    const { data, error } = await supabase.from("contacts").insert([{
      email: body.email,
      name: body.name,
      companyname: body.companyName,
      contactnumber: body.contactNumber,
      designation: body.designation,
      budget: body.budget,
      projectdescription: body.projectDescription
    }]);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });

    await transporter.sendMail({
      from: body.email,
      to: process.env.EMAIL_USER, // your email
      subject: `New contact from ${body.name}`,
      text: `
        Name: ${body.name}
        Email: ${body.email}
        Company: ${body.companyName}
        Contact: ${body.contactNumber}
        Designation: ${body.designation}
        Budget: ${body.budget}
        Project: ${body.projectDescription}
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
