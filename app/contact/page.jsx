"use client"

import { useState } from 'react';
import WaterEffect from "../components/WaterEffect";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    companyName: '',
    contactNumber: '',
    designation: '',
    budget: '',
    projectDescription: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // map camelCase to lowercase column names
    const payload = {
      email: formData.email,
      name: formData.name,
      companyname: formData.companyName,
      contactnumber: formData.contactNumber,
      designation: formData.designation,
      budget: formData.budget,
      projectdescription: formData.projectDescription
    };

    try {
      const { data, error } = await supabase.from("contacts").insert([payload]);
      if (error) {
        console.error(error);
        alert("Failed to submit form: " + error.message);
      } else {
        alert("Message sent successfully!");
        setFormData({
          email: '',
          name: '',
          companyName: '',
          contactNumber: '',
          designation: '',
          budget: '',
          projectDescription: ''
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="relative mt-30 z-30 md:mt-40 text-white rounded-lg w-full px-4 md:px-0 md:max-w-3xl mx-auto tracking-widest mb-20 md:mb-40 overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <WaterEffect />
      </div>

      <h2 className="text-3xl md:text-6xl mb-8 md:mb-14 leading-tight md:leading-normal">
        Tell us about your project<br />
        and find out how we can<br />
        help your business grow
      </h2>

      <h5 className='mb-8 md:mb-12 text-sm md:text-base'>Fill out the form below</h5>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Repeat fields */}
        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-medium text-white">EMAIL ID:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="name" className="block text-xs md:text-sm font-medium text-white">NAME</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-xs md:text-sm font-medium text-white">COMPANY NAME</label>
          <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-xs md:text-sm font-medium text-white">CONTACT NUMBER</label>
          <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="designation" className="block text-xs md:text-sm font-medium text-white">PROFESSIONAL DESIGNATION</label>
          <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="budget" className="block text-xs md:text-sm font-medium text-white">BUDGET YOU INTEND TO COMMIT TO THE PROJECT</label>
          <input type="text" id="budget" name="budget" value={formData.budget} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-xs md:text-sm font-medium text-white">DESCRIBE YOUR PROJECT</label>
          <textarea id="projectDescription" name="projectDescription" value={formData.projectDescription} onChange={handleChange} rows="3"
            className="mt-1 block w-full px-3 py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required />
        </div>

        <div className="flex justify-end">
          <button type="submit"
            className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
