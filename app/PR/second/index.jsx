"use client";

import React from "react";

export default function Second() {
  return (
    <div className="relative w-full bg-transparent h-auto overflow-hidden mb-3 md:mb-5 font-bellota-light">
      {/* Main content container */}
      <div className="container mx-auto px-6 sm:px-8 md:px-20 relative z-10">
        
        {/* Heading on top, centered */}
        <div className="flex justify-center mb-3 md:mb-5 mt-4 md:mt-6 text-stable no-water-effect">
          <h2 className="text-white text-2xl sm:text-3xl md:text-3xl text-center font-light tracking-[2px] uppercase no-water-effect px-4">
            CONCEPT & DIRECTION
          </h2>
        </div>

        {/* Images row */}
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
          {/* Left image */}
          <div className="w-full md:w-1/2 h-[420px] md:h-[600px]">
            <img
              src="/PR-images/webp/PR-section2-img1.webp"
              alt="Woman in red holding product"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Right image with overlay */}
          <div className="w-full md:w-1/2 relative h-[420px] md:h-[600px]">
            <img
              src="/PR-images/webp/PR-section2-img2.webp"
              alt="Woman in patterned outfit"
              className="w-full h-full object-cover"
              loading="eager"
            />

            {/* Overlay text */}
            <div className="absolute bottom-4 right-4 md:top-44 md:-right-10 text-white text-right text-stable no-water-effect">
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
