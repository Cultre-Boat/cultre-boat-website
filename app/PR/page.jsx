"use client";

import { useState, useEffect, useRef } from "react";
import Hero from "../PR/hero";
import Second from "../PR/second";
import Third from "../PR/second/third";
import Influencers from "./second/influencers";
import Stylist from "./second/stylist";
import PixiWaterImages from "../components/PixiWaterImages";

export default function PRPortfolio() {
  const [waterIntensity, setWaterIntensity] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);

  // Water effect configuration like design page
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setWaterIntensity(0.75); // Strong on mobile
      } else {
        setWaterIntensity(0.5); // Normal on desktop
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fashionImages = [
    { src: "/PR-images/webp/1.webp", link: "#" },
    { src: "/PR-images/webp/2.webp", link: "#" },
    { src: "/PR-images/webp/16-1.webp", link: "#" },
    { src: "/PR-images/webp/3.webp", link: "#" },
    { src: "/PR-images/webp/4.webp", link: "#" },
    { src: "/PR-images/webp/5.webp", link: "#" },
    { src: "/PR-images/webp/6.webp", link: "#" },
    { src: "/PR-images/webp/7.webp", link: "#" },
    { src: "/PR-images/webp/8.webp", link: "#" },
    { src: "/PR-images/webp/9.webp", link: "#" },
    { src: "/PR-images/webp/10.webp", link: "#" },
    { src: "/PR-images/webp/11.webp", link: "#" },
    { src: "/PR-images/webp/12.webp", link: "#" },
    { src: "/PR-images/webp/13.webp", link: "#" },
    { src: "/PR-images/webp/14.webp", link: "#" },
    { src: "/PR-images/webp/15.webp", link: "#" },
    { src: "/PR-images/webp/17.webp", link: "#" },
    { src: "/PR-images/webp/18.webp", link: "#" },
    { src: "/PR-images/webp/19.webp", link: "#" },
    { src: "/PR-images/webp/20.webp", link: "#" },
  ];

  const contentRef = useRef(null);

  // Ensure content paints immediately; no initial hiding
  useEffect(() => {}, []);

  return (
    <>
      <div className="text-white min-h-screen px-0">
        {/* Water effect applied to Hero, Second, and Fashion Grid */}
        <div id="pr-content" ref={contentRef}>
          <Hero />
          <Second />
          
          {/* Fashion Grid - WITH water effect */}
          <div className="px-4 sm:px-4 md:px-6 lg:px-10 mt-6 md:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-6">
              {fashionImages.map((image, index) => (
                <div
                  key={index}
                  className="col-span-1 w-full flex justify-center"
                >
                  <img
                    src={image.src}
                    alt={`Fashion ${index + 1}`}
                    width={400}
                    height={400}
                    className="object-contain w-full h-auto"
                    loading={index < 8 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* NO water effect from Third onwards */}
        <div className="no-water-effect no-cursor-distort">
          <Third />
          <Influencers />
          <Stylist />
        </div>
      </div>
      <PixiWaterImages containerRef={contentRef} intensity={waterIntensity} />
      
      {/* Water effect applied to: Hero, Second (Concept), and Fashion Grid
          NO water effect: Third (Creative Consultancy), Influencers, Stylists
          Mobile: 75% intensity (baseScale 5 × 0.75 = 3.75) - Strong & visible!
          Desktop: 50% intensity (baseScale 6 × 0.5 = 3.0) */}
    </>
  );
}
