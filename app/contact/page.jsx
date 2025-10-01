"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { gsap } from "gsap"; // Import GSAP
import { createClient } from "@supabase/supabase-js";
import MovingFog from "../components/MovingFog";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import FullScreenScreenWaterEffect from "../components/FullScreenWaterEffect";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  // ✅ useEffect hook to apply the SVG filter animation to text
  useEffect(() => {
  
    const textTurbulence = document.querySelector(
      "#textWaterFilter feTurbulence"
    );
    const textDisplacementMap = document.querySelector(
      "#textWaterFilter feDisplacementMap"
    );

    if (textTurbulence && textDisplacementMap) {
      document.querySelectorAll("h1, h2, h3, p, a").forEach((el) => {
        el.style.filter = "url(#textWaterFilter)";
      });

      gsap.set(textDisplacementMap, { attr: { scale: 10 } });

      gsap.to(textTurbulence, {
        attr: { baseFrequency: "0.02 0.10" },
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="relative mt-30 z-30 md:mt-40 text-white w-full px-4 md:px-8 lg:px-16 tracking-widest mb-20 md:mb-40 overflow-hidden">
       <svg className="absolute w-0 h-0 pointer-events-none">
       
        <filter id="textWaterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            result="noiseForText"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noiseForText"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Mobile: Title at top */}
      <div className="lg:hidden max-w-7xl mx-auto mb-8">
        <h2 className="text-3xl md:text-4xl leading-tight">
          Tell us about your project
          and find out how we can
          help your business grow
        </h2>
      </div>
      
      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Left Side - Company Information (Desktop only) */}
        <div className="hidden lg:block lg:pr-8">
          <h2 className="text-3xl md:text-4xl lg:text-6xl mb-8 md:mb-12 leading-tight md:leading-normal">
            Tell us about your project
            and find out how we can
            help your business grow
          </h2>

          <div className="mb-8 md:mb-12">
            <div className="mb-4">
              <h3 className="text-lg md:text-xl mb-3">Our Office</h3>
              <p className="text-sm md:text-base leading-relaxed">
                First Floor, U-3A, Green Park Main,<br />
                Block U, Green Park Extension,<br />
                Green Park, New Delhi, Delhi 110016
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <a href="https://www.facebook.com/CultreBoat/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer">
              <FaFacebookF className="text-black text-xl hover:scale-150" />
            </a>
            <a href="https://www.instagram.com/cultreboat/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer">
              <FaInstagram className="text-black text-xl hover:scale-150" />
            </a>
            <a href="https://www.linkedin.com/company/cultre-boat" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer">
              <FaLinkedinIn className="text-black text-xl hover:scale-150" />
            </a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="lg:pl-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <InputField
              label="EMAIL ID:"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="NAME"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              label="COMPANY NAME"
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
            />
            <InputField
              label="CONTACT NUMBER"
              id="contactNumber"
              name="contactNumber"
              type="tel"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <InputField
              label="PROFESSIONAL DESIGNATION"
              id="designation"
              name="designation"
              type="text"
              value={formData.designation}
              onChange={handleChange}
            />
            <InputField
              label="BUDGET YOU INTEND TO COMMIT TO THE PROJECT"
              id="budget"
              name="budget"
              type="text"
              value={formData.budget}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="projectDescription" className="block text-xs md:text-sm text-white">
                DESCRIBE YOUR PROJECT
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-black bg-white border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 md:px-8 md:py-3 text-sm md:text-base bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded "
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile: Address and Social Links below form */}
      <div className="lg:hidden max-w-7xl mx-auto mt-8">
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg mb-3">Our Office</h3>
            <p className="text-sm leading-relaxed">
              First Floor, U-3A, Green Park Main,<br />
              Block U, Green Park Extension,<br />
              Green Park, New Delhi, Delhi 110016
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <a href="https://www.facebook.com/CultreBoat/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer">
            <FaFacebookF className="text-black text-xl hover:scale-150" />
          </a>
          <a href="https://www.instagram.com/cultreboat/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer">
            <FaInstagram className="text-black text-xl hover:scale-150" />
          </a>
          <a href="https://www.linkedin.com/company/cultre-boat" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer">
            <FaLinkedinIn className="text-black text-xl hover:scale-150" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, id, name, type, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs md:text-sm  text-white">
        {label}
      </label>
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