import React from "react";

export default function second() {
  return (
    <div className="relative w-full bg-transparent h-auto md:h-screen overflow-hidden mb-10">
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-8 md:px-20 relative z-10">
        
        {/* Heading on top, centered */}
        <div className="flex justify-center mb-15">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl  text-center">
            CONCEPT & DIRECTION
          </h2>
        </div>

        {/* Images row */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left image */}
          <div className="w-full md:w-1/2 h-[500px] md:h-[600px]">
            <img
              src="/PR-section2-image1.png"
              alt="Woman in red holding product"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right image with overlay */}
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[600px]">
            <img
              src="/PR-section2-image2.png"
              alt="Woman in patterned outfit"
              className="w-full h-full object-cover"
            />

            {/* Overlay text */}
            <div className="absolute bottom-4 right-4 md:top-44 md:-right-10 text-white text-right">
              <h3 className="text-lg sm:text-xl md:text-2xl font-light mb-1 tracking-tight">
                Media & Stylists
              </h3>
              <p className="text-base sm:text-lg md:text-xl font-extralight italic">
                Coverage & Placements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
