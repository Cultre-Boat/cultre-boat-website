"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollingText from "./ScrollingText";
import PixiImage from "./PixiImage";
import SimpleScroll from "./SimpleScroll";

gsap.registerPlugin(ScrollTrigger);

// --- 1. DEFINE MOBILE-SPECIFIC IMAGES ---
const mobileLeftImages = [
  "/Image/Desgin/img1.png",
  "/Image/Desgin/img2.png",
  "/Image/Desgin/img3.png",
  "/Image/Desgin/img4.png",
  "/Image/Desgin/img5.png",
  "/Image/Desgin/img6.png",
  "/Image/Desgin/img7.png",
  "/Image/Desgin/img8.png",
  "/Image/Desgin/img9.png",
  "/Image/Desgin/img10.png",
  "/Image/Desgin/img11.png",
  "/Image/Desgin/img12.png",
  "/Image/Desgin/img13.png",
  "/Image/Desgin/img15.png",
  "/Image/Desgin/img31.png",
];

const mobileRightImages = [
  "/Image/Desgin/img30.jpg",
  "/Image/Desgin/img29.png",
  "/Image/Desgin/img1.png",
  "/Image/Desgin/img27.png",
  "/Image/Desgin/img26.png",
  "/Image/Desgin/img25.png",
  "/Image/Desgin/img24.png",
  "/Image/Desgin/img23.png",
  "/Image/Desgin/img22.png",
  "/Image/Desgin/img21.png",
  "/Image/Desgin/img20.png",
  "/Image/Desgin/img19.png",
  "/Image/Desgin/img18.png",
  "/Image/Desgin/img17.png",
  "/Image/Desgin/img16.png",
];

// --- 2. RENAME ORIGINAL DESKTOP IMAGES ---
const desktopLeftImages = [
"/Image/webp/img1.webp",
  "/Image/webp/img2.webp",
  "/Image/webp/img3.webp",
  "/Image/webp/img4.webp",
  "/Image/webp/img5.webp",
  "/Image/webp/img6.webp",
  "/Image/webp/img7.webp",
  "/Image/webp/img8.webp",
  "/Image/webp/img9.webp",
  "/Image/webp/img10.webp",
  "/Image/webp/img11.webp",
  "/Image/webp/img12.webp",
  "/Image/webp/img13.webp",
  "/Image/webp/img15.webp",
  "/Image/webp/img31.webp",
];

const desktopRightImages = [
  "/Image/webp/img30.webp",
  "/Image/webp/img29.webp",
  "/Image/webp/img1.webp",
  "/Image/webp/img27.webp",
  "/Image/webp/img26.webp",
  "/Image/webp/img25.webp",
  "/Image/webp/img24.webp",
  "/Image/webp/img23.webp",
  "/Image/webp/img22.webp",
  "/Image/webp/img21.webp",
  "/Image/webp/img20.webp",
  "/Image/webp/img19.webp",
  "/Image/webp/img18.webp",
  "/Image/webp/img17.webp",
  "/Image/webp/img16.webp",
];

function isMobileDevice() {
  const userAgent =
    typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

export default function EnhancedReverseStartLayout() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [componentHeight, setComponentHeight] = useState("auto");
  const [mountWaterEffect, setMountWaterEffect] = useState(false);

  // Use a large height for continuous scrolling
  const largeScrollHeight = 100000; // Adjust for desired scroll distance

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setComponentHeight(largeScrollHeight);
  }, []);

  useEffect(() => {
    // Ensure the container DOM node exists before mounting water effect on mobile
    if (isMobile && containerRef.current && !mountWaterEffect) {
      setMountWaterEffect(true);
    }
  }, [isMobile, containerRef, mountWaterEffect]);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Text scroll animation for both mobile and desktop
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
            end: `+=${largeScrollHeight}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const leftImages = isMobile ? mobileLeftImages : desktopLeftImages;
  const rightImages = isMobile ? mobileRightImages : desktopRightImages;

  return (
    <main className="pixi-page relative">
      {isMobile ? (
        <SimpleScroll
          containerRef={containerRef}
          leftImages={mobileLeftImages}
          rightImages={mobileRightImages}
          scrollHeight={largeScrollHeight}
        />
      ) : (
        <PixiImage
          containerRef={containerRef}
          leftImages={desktopLeftImages}
          rightImages={desktopRightImages}
          scrollHeight={largeScrollHeight}
        />
      )}
      <div
        ref={containerRef}
        style={{ height: largeScrollHeight }}
        className="relative w-full"
      >
        <ScrollingText ref={textRef} />
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p className="text-white text-sm font-bold opacity-35">
            Scroll and Select
          </p>
        </div>
      </div>
    </main>
  );
}