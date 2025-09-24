"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollingText from "./ScrollingText";
import PixiImage from "./PixiImage";
import SimpleScroll from "./SimpleScroll";

gsap.registerPlugin(ScrollTrigger);

// --- 1. DEFINE MOBILE-SPECIFIC IMAGES ---
// Left column for mobile with a mix of food, model, and jewellery
const mobileLeftImages = [
  "/mobile/img1.jpeg",   // food
  "/mobile/img11.jpeg",  // model
  "/mobile/img10.jpeg",   // food
  "/mobile/img13.jpeg",  // jewellery
  "/mobile/img5.jpeg",   // food
  "/mobile/img-15.jpeg",  // model
  "/mobile/img7.jpeg",   // food
  "/mobile/img9.jpeg",   // food
  "/mobile/img1.jpeg",   // food
  "/mobile/img11.jpeg",  // model
  "/mobile/img3.jpeg",   // food
  "/mobile/img13.jpeg",  // jewellery
  "/mobile/img5.jpeg",   // food
  "/mobile/img-15.jpeg",  // model
  "/mobile/img7.jpeg",   // food
  "/mobile/img9.jpeg",   // food
];

// Right column for mobile with the remaining mixed images
const mobileRightImages = [
  "/mobile/img2.jpeg",   // food
  "/mobile/img12.jpeg",  // model
  "/mobile/img4.jpeg",   // food
  "/mobile/img-14.jpeg",  // model
  "/mobile/img6.jpeg",   // food
  "/mobile/img-16.jpeg",  // model
  "/mobile/img8.jpeg",   // food
  "/mobile/img10.jpeg",  // food
    "/mobile/img2.jpeg",   // food
  "/mobile/img12.jpeg",  // model
  "/mobile/img2.jpeg",   // food
  "/mobile/img12.jpeg",  // model
  "/mobile/img4.jpeg",   // food
  "/mobile/img-14.jpeg",  // model
  "/mobile/img6.jpeg",   // food
  "/mobile/img-16.jpeg",  // model
  "/mobile/img8.jpeg",   // food
  "/mobile/img10.jpeg",  // food
    "/mobile/img2.jpeg",   // food
  "/mobile/img12.jpeg",  // model
];

const desktopLeftImages = [
  // Food → Model → Jewellery → Food → Model → Food → Model → Food
  "/Image/img1.webp",     // Food
  "/Image/img11.webp",    // Food
  "/Image/img2.webp",    // Model
  "/Image/img13.webp",    // Jewellery
  "/Image/img5.webp",     // Food
  "/Image/img-14.webp",   // Model
  "/Image/img7.webp",     // Food
  "/Image/img-15.webp",    // Model
  "/Image/img9.webp",     // Food
  "/Image/img-16.webp",   // Model
  "/Image/img2.webp",     // Food
  "/Image/img13.webp",    // Model
  "/Image/img-15.webp",   // Food
  "/Image/img1.webp",     // Food
  "/Image/img13.webp",     // Food
  "/Image/img11.webp",    // Food
  "/Image/img2.webp",    // Model
  "/Image/img13.webp",    // Jewellery
  "/Image/img5.webp", 
];

const desktopRightImages = [
  "/Image/img1.webp",   // Foodb  1
  "/Image/img-14.webp",  // Model  14
  "/Image/img6.webp",    // Food 6
  "/Image/img4.webp",   // Model  4
  "/Image/img13.webp",    // Food   13
  "/Image/img8.webp",   // Jewellery  8
  "/Image/img11.webp",    // Food  11
  "/Image/img10.webp",  // Model 10
  "/Image/img-16.webp",   // Food  16
  "/Image/img5.webp",    // Food  5
  "/Image/img12.webp",  // Model 
  "/Image/img-14.webp",   // Food
  "/Image/img6.webp",   // Model
  "/Image/img13.webp",    // Food
  "/Image/img4.webp",   // Jewellery
  "/Image/img11.webp",    // Food
  "/Image/img8.webp",    // Food
  "/Image/img-16.webp",  // Model
  "/Image/img10.webp",   // Food
];


function isMobileDevice() {
  const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export default function EnhancedReverseStartLayout() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [componentHeight, setComponentHeight] = useState("auto");

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (maxScroll > 0) {
      setComponentHeight(maxScroll + window.innerHeight);
    }
  }, [maxScroll]);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || maxScroll === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { x: "30vw" },
        {
          x: "-150vw",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${maxScroll}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [maxScroll]);

  // --- 3. CONDITIONALLY SELECT THE RIGHT IMAGE ARRAYS ---
  const leftImages = isMobile ? mobileLeftImages : desktopLeftImages;
  const rightImages = isMobile ? mobileRightImages : desktopRightImages;

  return (
    <main className="pixi-page">
      {isMobile ? (
        <SimpleScroll
          containerRef={containerRef}
          leftImages={mobileLeftImages} // Pass mobile or desktop images
          rightImages={mobileRightImages} // Pass mobile or desktop images
          onMaxScrollCalculated={setMaxScroll}
          maxScroll={maxScroll}
        />
      ) : (
        <PixiImage
          containerRef={containerRef}
          leftImages={desktopLeftImages} // Pass mobile or desktop images
          rightImages={desktopRightImages} // Pass mobile or desktop images
          onMaxScrollCalculated={setMaxScroll}
        />
      )}
      <div
        ref={containerRef}
        style={{ height: componentHeight }}
        className="relative w-full"
      >
        <ScrollingText ref={textRef} />
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p className="text-white text-sm font-bold opacity-35">Scroll and Select</p>
        </div>
      </div>
    </main>
  );
}