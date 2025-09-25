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
  "/mobile/img3.jpeg",   // food
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


// --- 2. RENAME ORIGINAL DESKTOP IMAGES ---
// These arrays will be used for the desktop view only
const desktopLeftImages = [
  "/Image/img1.webp",
  "/Image/img11.webp",
  "/Image/img3.webp",
  "/Image/img-14.webp",
  "/Image/img5.webp",
  "/Image/img13.webp",
  "/Image/img7.webp",
  "/Image/img-15.webp",
  "/Image/img9.webp",
  "/Image/img2.webp",
  "/Image/img1.webp",
  "/Image/img11.webp",
  "/Image/img3.webp",
  "/Image/img-14.webp",
  "/Image/img5.webp",
  "/Image/img13.webp",
  "/Image/img7.webp",
  "/Image/img-15.webp",
  "/Image/img9.webp",
  // "/Image/img2.webp",
];

const desktopRightImages = [
  "/Image/img10.webp",
  "/Image/img-16.webp",
  "/Image/img8.webp",
  "/Image/img11.webp",
  "/Image/img4.webp",
  "/Image/img13.webp",
  "/Image/img6.webp",
  "/Image/img-14.webp",
  "/Image/img12.webp",
  "/Image/img5.webp",
  "/Image/img10.webp",
  "/Image/img-16.webp",
  "/Image/img8.webp",
  "/Image/img11.webp",
  "/Image/img4.webp",
  "/Image/img13.webp",
  "/Image/img6.webp",
  "/Image/img-14.webp",
  "/Image/img12.webp",
  // "/Image/img5.webp",
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