"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollingText from "./ScrollingText";
import PixiImage from "./PixiImage";
import SimpleScroll from "./SimpleScroll";
import FullScreenWaterEffect from "./FullScreenWaterEffect";

gsap.registerPlugin(ScrollTrigger);

// --- 1. DEFINE MOBILE-SPECIFIC IMAGES ---
// Left column for mobile with a mix of food, model, and jewellery
const mobileLeftImages = [
  "/mobile/1.jpeg",   // food1
  "/mobile/2.jpeg",  // model2
  "/mobile/3.jpeg",   // food
  "/mobile/4.jpeg",  // jewellery
  "/mobile/5.jpeg",   // food
  "/mobile/7.jpeg",  // model
  "/mobile/6.jpeg",   // food
  "/mobile/8.jpeg",   // food
  "/mobile/9.jpeg",   // food
  "/mobile/10.jpeg",  // model
  "/mobile/1.jpeg",   // food1
  "/mobile/2.jpeg",  // model2
  "/mobile/3.jpeg",   // food
  "/mobile/4.jpeg",  // jewellery
];

// Right column for mobile with the remaining mixed images
const mobileRightImages = [
  "/mobile/11.jpeg",   // food
  "/mobile/15.jpeg",  // model
  "/mobile/13.jpeg",   // food
  "/mobile/14.jpeg",  // model
  "/mobile/16.jpeg",   // food
  "/mobile/12.jpeg",  // model
  "/mobile/17.jpeg",   // food
  "/mobile/19.jpeg",  // food
  "/mobile/18.jpeg",  // food
  "/mobile/20.jpeg",  // food
  "/mobile/11.jpeg",   // food
  "/mobile/15.jpeg",  // model
  "/mobile/13.jpeg",   // food
  "/mobile/14.jpeg",  // model
];


// --- 2. RENAME ORIGINAL DESKTOP IMAGES ---
// These arrays will be used for the desktop view only
const desktopLeftImages = [
"/Image/1.png",   // food1
  "/Image/2.webp",  // model2
  "/Image/3.png",   // food
  "/Image/4.png",  // jewellery
  "/Image/5.webp",   // food
  "/Image/7.webp",  // model
  "/Image/6.png",   // food
  "/Image/8.webp",   // food
  "/Image/9.png",   // food
  "/Image/10.png",  // model
"/Image/1.png",   // food1
  "/Image/2.webp",  // model2
  "/Image/3.png",   // food
  "/Image/4.png",  // jewellery
  "/Image/5.webp",   // food
  "/Image/7.webp",  // model
  "/Image/6.png",   // food
  "/Image/8.webp",   // food
  "/Image/9.png",   // food
  "/Image/10.png",  // model
];

const desktopRightImages = [
  "/Image/11.webp",   // food
  "/Image/15.webp",  // model
  "/Image/13.png",   // food
  "/Image/14.webp",  // model
  "/Image/16.png",   // food
  "/Image/12.png",  // model
  "/Image/17.png",   // food
  "/Image/19.png",  // food
  "/Image/18.png",  // food
  "/Image/20.png",  // food
  "/Image/11.webp",   // food
  "/Image/15.webp",  // model
  "/Image/13.png",   // food
  "/Image/14.webp",  // model
  "/Image/16.png",   // food
  "/Image/12.png",  // model
  "/Image/17.png",   // food
  "/Image/19.png",  // food
  "/Image/18.png",  // food
  "/Image/20.png",  // food
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
    <main className="pixi-page relative ">
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