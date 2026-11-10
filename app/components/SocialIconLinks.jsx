import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { socialLinks } from "../lib/socialLinks";

const ICONS = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
};

// Round white icon buttons for the company's social profiles.
export default function SocialIconLinks() {
  return (
    <div className="flex gap-4">
      {socialLinks.map(({ label, href }) => {
        const Icon = ICONS[label];
        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg cursor-pointer"
          >
            <Icon className="text-black text-xl hover:scale-150" />
          </a>
        );
      })}
    </div>
  );
}
