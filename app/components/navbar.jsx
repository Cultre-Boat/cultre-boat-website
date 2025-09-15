"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHoverPos, setMenuHoverPos] = useState({ x: 0, y: 0 });

  const handleMenuMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left - rect.width / 2) * 0.8; // 80% shift
    const offsetY = (e.clientY - rect.top - rect.height / 2) * 0.8;
    setMenuHoverPos({ x: offsetX, y: offsetY });
  };

  const handleIconMouseEnter = (e) => {
    const target = e.currentTarget;
    if (!target) return;

    // Apply the water effect immediately on hover
    target.style.filter = `url(#wave)`;
    target.style.transition = "filter 0.2s ease";

    const filter = document.getElementById("turbulence");
    if (filter && !target.animationInterval) {
      let phase = 0;
      target.animationInterval = setInterval(() => {
        if (!target || !target.matches(":hover")) {
          clearInterval(target.animationInterval);
          target.animationInterval = null;
          return;
        }
        phase += 0.3;
        const frequency =
          0.12 + Math.sin(phase) * 0.015 + Math.cos(phase * 1.3) * 0.01;
        filter.setAttribute("baseFrequency", frequency.toFixed(4));
      }, 50);
    }
  };

  const handleIconMouseLeave = (e) => {
    const target = e.currentTarget;
    if (!target) return;

    // Clear the continuous animation
    if (target.animationInterval) {
      clearInterval(target.animationInterval);
      target.animationInterval = null;
    }

    // Remove the water effect immediately when mouse leaves
    target.style.filter = "none";
    target.style.transition = "filter 0.1s ease";

    // Reset the filter frequency
    const filter = document.getElementById("turbulence");
    if (filter) {
      filter.setAttribute("baseFrequency", "0.02");
    }
  };

  const handleMenuMouseLeave = () => {
    setMenuHoverPos({ x: 0, y: 0 });
  };

  const closemenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-6 md:px-12 md:py-12 bg-transparent">
        <div className="text-white font-bold h-10 justify-center items-center flex flex-row gap-4 -ml-5">
          <a href="/" className="flex flex-row gap-7 items-center">
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
              <filter id="wave">
                <feTurbulence
                  id="turbulence"
                  type="fractalNoise"
                  baseFrequency="0.02"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="6"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </svg>

            <img
              src="/Vector 4.png"
              width={32}
              height={16}
              alt="First icon"
              onMouseEnter={handleIconMouseEnter}
              onMouseLeave={handleIconMouseLeave}
              style={{ filter: "none" }}
            />
            <img
              src="/Group 2.png"
              width={25}
              height={15}
              alt="Second icon"
              onMouseEnter={handleIconMouseEnter}
              onMouseLeave={handleIconMouseLeave}
              className="scale-125 -left-1 relative"
              style={{ filter: "none", marginLeft: "10px" }}
            />
            <img
              src="/Vector 3.png"
              width={28}
              height={14}
              alt="Last icon"
              onMouseEnter={handleIconMouseEnter}
              onMouseLeave={handleIconMouseLeave}
              className="scale-110"
              style={{ filter: "none", marginLeft: "10px" }}
            />
          </a>
        </div>
        <div className="relative">
          {/* Larger invisible hover area */}
          <div
            className="absolute -inset-16 cursor-pointer"
            onMouseMove={handleMenuMouseMove}
            onMouseLeave={handleMenuMouseLeave}
            onClick={() => setMenuOpen(!menuOpen)}
          ></div>

          {/* Actual menu button */}
          <div
            className={`w-6 h-5 md:w-8 md:h-5 relative cursor-pointer flex flex-col justify-between ${
              menuOpen ? "active" : ""
            }`}
            style={{
              transform: `translate(${menuHoverPos.x}px, ${menuHoverPos.y}px)`,
              transition: "transform 0.2s",
            }}
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
        </div>
      </nav>

      {/* Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#1a1a1a] flex flex-col items-center justify-center opacity-0 invisible transition-all duration-1000 z-40 ${
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
        <div className="absolute bottom-12 flex flex-col gap-2 text-center">
          <Link
            href="https://www.facebook.com/profile.php?id=100016109957685"
            onClick={closemenu}
            className="text-gray-500 text-lg hover:text-white transition-all"
          >
            Facebook
          </Link>
          <Link
            href="https://www.instagram.com/cultreboat/"
            onClick={closemenu}
            className="text-gray-500 text-lg hover:text-white transition-all"
          >
            Instagram
          </Link>
          <Link
            href="https://www.linkedin.com/company/cultre-boat/posts/?feedView=all"
            onClick={closemenu}
            className="text-gray-500 text-lg hover:text-white transition-all"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </>
  );
}
