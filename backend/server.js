const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const supabase = require("./db");

const app = express();

// Debug: Log environment variables
console.log("Loaded ENV keys:", Object.keys(process.env).filter(k => k.includes("SUPABASE")));

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
  const {
    email,
    name,
    companyName,
    contactNumber,
    designation,
    budget,
    projectDescription,
  } = req.body;

  try {
    // 1️⃣ Save to Supabase
    const { data, error } = await supabase.from("contacts").insert([
      {
        email,
        name,
        companyname: companyName,
        contactnumber: contactNumber,
        designation,
        budget,
        projectdescription: projectDescription,
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
    console.log("✅ Supabase insert success:", data);

    // 2️⃣ Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New contact from ${name}`,
      text: `
        Email: ${email}
        Name: ${name}
        Company: ${companyName}
        Contact: ${contactNumber}
        Designation: ${designation}
        Budget: ${budget}
        Description: ${projectDescription}
      `,
    });

    res.json({ success: true, message: "Message sent & saved successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Failed to process request" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));