"use client";

import React from "react";

export default function Second() {
  return (
    <div className="relative w-full bg-transparent h-auto overflow-hidden mb-3 md:mb-5 font-bellota-light">
      {/* Main content container */}
      <div className="container mx-auto px-6 sm:px-8 md:px-20 relative z-10">

        {/* Images row */}
        <div className="flex flex-col md:flex-row items-start gap-0">
          {/* Left image */}
          <div className="w-full md:w-1/2">
            <img
              src="/PR-images/webp/PR-section2-img1.webp"
              alt="Woman in red holding product"
              className="w-full h-auto block no-water-effect"
              loading="eager"
            />
          </div>

          {/* Right image with overlay */}
          <div className="w-full md:w-1/2 relative">
            <img
              src="/PR-images/webp/PR-section2-img2.webp"
              alt="Woman in patterned outfit"
              className="w-full h-auto block no-water-effect"
              loading="eager"
            />

            {/* Overlay text */}
            <div className="relative mt-3 text-center md:absolute md:mt-0 md:top-44 md:-right-10 md:text-right text-white text-stable no-water-effect">
              <h3 className="text-lg sm:text-xl md:text-2xl font-light mb-1 tracking-tight no-water-effect" style={{ fontWeight: 300 }}>
                Media & Stylists
              </h3>
              <p className="text-base sm:text-lg md:text-xl italic no-water-effect font-light" style={{ fontWeight: 300 }}>
                Coverage & Placements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
