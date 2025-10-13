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
  "/Image/Image/img1.webp",
  "/Image/Image/img2.webp",
  "/Image/Image/img3.webp",
  "/Image/Image/img4.webp",
  "/Image/Image/img5.webp",
  "/Image/Image/img6.webp",
  "/Image/Image/img7.webp",
  "/Image/Image/img8.webp",
  "/Image/Image/img9.webp",
  "/Image/Image/img10.webp",
  "/Image/Image/img11.webp",
  "/Image/Image/img12.webp",
  "/Image/Image/img13.webp",
  "/Image/Image/img15.webp",
  "/Image/Image/img31.webp",
];

const mobileRightImages = [
  "/Image/Image/img30.webp",
  "/Image/Image/img29.webp",
  "/Image/Image/img28.webp",
  "/Image/Image/img27.webp",
  "/Image/Image/img26.webp",
  "/Image/Image/img25.webp",
  "/Image/Image/img24.webp",
  "/Image/Image/img23.webp",
  "/Image/Image/img22.webp",
  "/Image/Image/img21.webp",
  "/Image/Image/img20.webp",
  "/Image/Image/img19.webp",
  "/Image/Image/img18.webp",
  "/Image/Image/img17.webp",
  "/Image/Image/img16.webp",
];

// --- 2. RENAME ORIGINAL DESKTOP IMAGES ---
const desktopLeftImages = [
 "/Image/img1.webp",
  "/Image/img2.png",
  "/Image/img3.jpg",
  "/Image/img4.png",
  "/Image/img5.jpg",
  "/Image/img6.png",
  "/Image/img7.jpg",
  "/Image/img8.webp",
  "/Image/img9.jpg",
  "/Image/img10.png",
  "/Image/img11.jpg",
  "/Image/img12.jpg",
  "/Image/img13.jpg",
  "/Image/img14.jpg",
  "/Image/img15.png",
];

const desktopRightImages = [
  "/Image/img30.png",
  "/Image/img29.png",
  "/Image/img28.jpg",
  "/Image/img27.jpg",
  "/Image/img26.jpg",
  "/Image/img25.webp",
  "/Image/img24.webp",
  "/Image/img23.jpg",
  "/Image/img22.png",
  "/Image/img21.png",
  "/Image/img20.png",
  "/Image/img19.jpg",
  "/Image/img18.webp",
  "/Image/img17.webp",
  "/Image/img16.webp",
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
    if (!containerRef.current || !textRef.current) return;

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