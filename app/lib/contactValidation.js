// Shared validation for the contact form. Used by the client page and the API route.

const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]*[A-Za-z.]$/;
// Standard local@domain.tld shape: letters/digits/common symbols, a dot-separated domain, and a TLD of 2+ letters.
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
// International format (E.164): "+", then country code and number, 8-15 digits total, no leading zero.
const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export function normalizeContactNumber(value) {
  return String(value || "").replace(/[\s()-]/g, "");
}

export function validateName(value) {
  const name = String(value || "").trim();
  if (name.length < 2 || name.length > 60) {
    return "Name must be between 2 and 60 characters.";
  }
  if (!NAME_REGEX.test(name)) {
    return "Name can only contain letters, spaces, dots, hyphens and apostrophes.";
  }
  return null;
}

export function validateEmail(value) {
  const email = String(value || "").trim();
  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address (e.g. name@example.com).";
  }
  return null;
}

export function validateContactNumber(value) {
  const phone = normalizeContactNumber(value);
  if (!PHONE_REGEX.test(phone)) {
    return "Please enter a valid mobile number with country code, e.g. +91 98765 43210.";
  }
  return null;
}

export const FIELD_LIMITS = { name: 60, email: 254, projectDescription: 5000 };

export function validateProjectDescription(value) {
  const text = String(value || "").trim();
  if (!text) return "Please tell us a little about your project.";
  if (text.length > FIELD_LIMITS.projectDescription) {
    return `Please keep the description under ${FIELD_LIMITS.projectDescription} characters.`;
  }
  return null;
}

// Returns an object of field -> error message. Empty object means valid.
export function validateContactForm({ name, email, contactNumber, projectDescription }) {
  const errors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const phoneError = validateContactNumber(contactNumber);
  const descriptionError = validateProjectDescription(projectDescription);
  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (phoneError) errors.contactNumber = phoneError;
  if (descriptionError) errors.projectDescription = descriptionError;
  return errors;
}
