"use client";

import { useState } from "react";
import WaterEffect from "../components/WaterEffect";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("SUPABASE URL:", supabaseUrl, "KEY:", supabaseAnonKey);
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = createClient(supabaseUrl, supabaseAnonKey);



export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    companyName: "",
    contactNumber: "",
    designation: "",
    budget: "",
    projectDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map camelCase to lowercase column names in Supabase
    const payload = {
      email: formData.email,
      name: formData.name,
      companyname: formData.companyName,
      contactnumber: formData.contactNumber,
      designation: formData.designation,
      budget: formData.budget,
      projectdescription: formData.projectDescription,
    };

    try {
      const { data, error } = await supabase.from("contacts").insert([payload]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Failed to submit form: " + error.message);
      } else {
        alert("Message sent successfully!");
        // Reset form
        setFormData({
          email: "",
          name: "",
          companyName: "",
          contactNumber: "",
          designation: "",
          budget: "",
          projectDescription: "",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="relative mt-30 z-30 md:mt-40 text-white rounded-lg w-full px-4 md:px-0 md:max-w-3xl mx-auto tracking-widest mb-20 md:mb-40 overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <WaterEffect />
      </div>

      <h2 className="text-3xl md:text-6xl mb-8 md:mb-14 leading-tight md:leading-normal">
        Tell us about your project
        <br />
        and find out how we can
        <br />
        help your business grow
      </h2>

      <h5 className="mb-8 md:mb-12 text-sm md:text-base">Fill out the form below</h5>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/** Form Fields **/}
        <InputField label="EMAIL ID:" id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField label="NAME" id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
        <InputField label="COMPANY NAME" id="companyName" name="companyName" type="text" value={formData.companyName} onChange={handleChange} />
        <InputField label="CONTACT NUMBER" id="contactNumber" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} />
        <InputField label="PROFESSIONAL DESIGNATION" id="designation" name="designation" type="text" value={formData.designation} onChange={handleChange} />
        <InputField label="BUDGET YOU INTEND TO COMMIT TO THE PROJECT" id="budget" name="budget" type="text" value={formData.budget} onChange={handleChange} />
        
        <div>
          <label htmlFor="projectDescription" className="block text-xs md:text-sm font-medium text-white">DESCRIBE YOUR PROJECT</label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, id, name, type, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs md:text-sm font-medium text-white">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
        required
      />
    </div>
  );
}
