"use client";

import { useState } from "react";
import SocialIconLinks from "../components/SocialIconLinks";
import WaterFilterDefs from "../components/WaterFilterDefs";
import useWaterTextAnimation from "../hooks/useWaterTextAnimation";
import OfficeAddress from "../components/OfficeAddress";
import { validateContactForm, FIELD_LIMITS } from "../lib/contactValidation";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    projectDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  useWaterTextAnimation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleaned = value;
    // Block characters that can never be valid in these fields as they are typed.
    if (name === "name") {
      cleaned = value.replace(/[^A-Za-z .'-]/g, "");
    } else if (name === "contactNumber") {
      // Only digits, spaces, (), - and a single "+" at the start.
      const stripped = value.replace(/[^0-9+\s()-]/g, "");
      cleaned =
        (stripped.startsWith("+") ? "+" : "") + stripped.replace(/\+/g, "");
      cleaned = cleaned.slice(0, 20);
    } else if (name === "email") {
      cleaned = value.replace(/\s/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, website }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) setErrors(result.errors);
        alert(result.error || "Failed to send message");
        return;
      }

      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        projectDescription: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Error submitting form. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mt-30 z-30 md:mt-40 text-white w-full px-4 md:px-8 lg:px-16 tracking-widest pb-8 md:pb-10 overflow-hidden">
      <WaterFilterDefs />

      {/* Mobile: Title at top */}
      <div className="lg:hidden max-w-7xl mx-auto mb-8">
        <h2 className="text-3xl md:text-4xl leading-tight">
          Tell us about your project and find out how we can help your business
          grow
        </h2>
      </div>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Side - Company Information (Desktop only) */}
        <div className="hidden lg:block lg:pr-8">
          <h2 className="text-3xl md:text-4xl lg:text-6xl mb-8 md:mb-12 leading-tight md:leading-normal">
            Tell us about your project and find out how we can help your
            business grow
          </h2>

          <div className="mb-8 md:mb-12">
            <OfficeAddress />
          </div>

          <SocialIconLinks />
        </div>

        {/* Right Side - Contact Form */}
        <div className="lg:pl-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
            {/* Honeypot field, hidden from people; bots tend to fill it in */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <InputField
              label="NAME"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              maxLength={60}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
            <InputField
              label="EMAIL ID"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              maxLength={254}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <InputField
              label="CONTACT NUMBER"
              id="contactNumber"
              name="contactNumber"
              type="tel"
              inputMode="tel"
              value={formData.contactNumber}
              onChange={handleChange}
              error={errors.contactNumber}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              required
            />
            <div>
              <label
                htmlFor="projectDescription"
                className="block text-xs md:text-sm text-white"
              >
                DESCRIBE YOUR PROJECT
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows="6"
                maxLength={FIELD_LIMITS.projectDescription}
                placeholder="Tell us about your brand, what you need."
                required
                aria-invalid={!!errors.projectDescription}
                className={`mt-1 block w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-black bg-white placeholder:text-gray-400 border focus:outline-none focus:border-blue-500 resize-none ${
                  errors.projectDescription ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.projectDescription && (
                <p className="mt-1 text-xs md:text-sm text-red-400">{errors.projectDescription}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="disabled:opacity-60 disabled:cursor-wait px-6 py-3 md:px-8 md:py-3 text-sm md:text-base bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded "
              >
                {submitting ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile: Address and Social Links below form */}
      <div className="lg:hidden max-w-7xl mx-auto mt-8">
        <div className="mb-8">
          <OfficeAddress
            titleClassName="text-lg mb-3"
            textClassName="text-sm leading-relaxed"
          />
        </div>

        <SocialIconLinks />
      </div>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, id, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs md:text-sm  text-white">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={`mt-1 block w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base text-black bg-white placeholder:text-gray-400 border focus:outline-none focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-600"
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-xs md:text-sm text-red-400">{error}</p>}
    </div>
  );
}
