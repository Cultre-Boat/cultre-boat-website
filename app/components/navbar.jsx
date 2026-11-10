"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closemenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center font-bellota-light px-6 py-6 md:px-12 md:py-12 ">
        <div className="text-white font-bold h-10 justify-center items-center flex flex-row gap-4 -ml-5">
          <a href="/" className="flex flex-row gap-7 items-center">
            <img
              src="/Vector 4.png"
              width={32}
              height={16}
              alt="First icon"
              style={{ filter: "none" }}
            />
            <img
              src="/Group 2.png"
              width={25}
              height={15}
              alt="Second icon"
              className="scale-125 -left-1 relative"
              style={{ filter: "none", marginLeft: "10px" }}
            />
            <img
              src="/Vector 3.png"
              width={28}
              height={14}
              alt="Last icon"
              className="scale-110"
              style={{ filter: "none", marginLeft: "13px" }}
            />
          </a>
        </div>
        
        {/* Menu button */}
        <div
          className={`w-6 h-5 md:w-8 md:h-5 relative cursor-pointer flex flex-col justify-between ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            className={`w-full h-[2px] md:h-[2.5px] bg-white absolute transition-all duration-300 ${
              menuOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-0"
            }`}
          ></div>
          <div
            className={`w-full h-[2px] md:h-[3px] bg-white absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`w-full h-[2px] md:h-[3px] bg-white absolute transition-all duration-300 ${
              menuOpen ? "-rotate-45 bottom-1/2 translate-y-1/2" : "bottom-0"
            }`}
          ></div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#2a4862] flex flex-col items-center justify-center opacity-0 invisible transition-all duration-1000 z-40 ${
          menuOpen ? "opacity-100 visible" : ""
        }`}
      >
        <div className="w-full px-6 py-20 md:px-32 md:py-20 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
          <ul className="space-y-6">
            <li>
              <Link
                href="/design"
                onClick={closemenu}
                className="text-white text-3xl md:text-7xl font-light tracking-widest hover:text-blue-500 transition-all"
              >
                DESIGN
              </Link>
            </li>
            <li>
              <Link
                href="/PR"
                onClick={closemenu}
                className="text-white text-3xl md:text-7xl font-light tracking-widest hover:text-blue-500 transition-all"
              >
                PR
              </Link>
            </li>
            <li>
              <Link
                href="/social-scroll"
                onClick={closemenu}
                className="text-white text-3xl md:text-7xl font-light tracking-widest hover:text-blue-500 transition-all"
              >
                SOCIAL
              </Link>
            </li>
          </ul>
          <ul className="mt-12 md:mt-0 space-y-4">
            <li>
              <Link
                href="/about-us"
                onClick={closemenu}
                className="text-white text-xl md:text-7xl font-light hover:text-blue-500 tracking-widest"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={closemenu}
                className="text-white text-xl md:text-7xl font-light hover:text-blue-500 tracking-widest"
              >
                Contact
              </Link>
            </li>
            <li>
              {/* <Link
                href="/social-scroll"
                onClick={closemenu}
                className="text-white text-xl md:text-7xl font-light hover:text-blue-500 tracking-widest"
              >
                Stories
              </Link> */}
            </li>
          </ul>
        </div>
        <div className="absolute bottom-10 md:bottom-12 left-0 w-full px-6 flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-3 text-center">
          <Link
            href="https://www.facebook.com/profile.php?id=100016109957685"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closemenu}
            className="text-white/70 text-base md:text-xl tracking-widest uppercase hover:text-white transition-all"
          >
            Facebook
          </Link>
          <Link
            href="https://www.instagram.com/cultreboat/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closemenu}
            className="text-white/70 text-base md:text-xl tracking-widest uppercase hover:text-white transition-all"
          >
            Instagram
          </Link>
          <Link
            href="https://www.linkedin.com/company/cultre-boat/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closemenu}
            className="text-white/70 text-base md:text-xl tracking-widest uppercase hover:text-white transition-all"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </>
  );
}