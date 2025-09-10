import React from 'react';

export default function PR2() {
  return (
    <div className="relative w-full bg-transparent h-auto md:h-screen overflow-hidden mb-10">
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-8 md:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Left image - full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0">
            <img 
              src="/PR-section2-image1.png" 
              alt="Woman in red holding product" 
              className="w-full h-auto object-cover" 
            />
          </div>

          {/* Right content - full width on mobile, 2/3 on desktop */}
          <div className="w-full md:w-2/3 pl-0 md:pl-6 flex flex-col">
            {/* Top text */}
            <div className="text-center md:text-left text-white text-xs sm:text-sm mb-4">
              <p>CONCEPT & DIRECTION</p>
            </div>

            <div className="relative">
              <img 
                src="/PR-section2-image2.png" 
                alt="Woman in patterned outfit" 
                className="w-full h-auto object-cover" 
              />
              
              {/* Overlay text - repositioned for mobile */}
              <div className="absolute bottom-4 right-0 md:top-44 md:-right-14 text-white text-right">
                <h2 className="text-lg sm:text-xl md:text-2xl font-light mb-1 -tracking-tight">Media & Stylists</h2>
                <p className="text-base sm:text-lg md:text-xl font-extralight italic">Coverage & Placements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}