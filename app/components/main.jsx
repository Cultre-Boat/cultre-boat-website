"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollingText from "./ScrollingText";
import PixiImage from "./PixiImage";
import SimpleScroll from "./SimpleScroll";

gsap.registerPlugin(ScrollTrigger);

const leftImages = [
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
  "/Image/img2.webp",
];

const rightImages = [
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
  "/Image/img5.webp",
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

  // Detect mobile on mount and resize
  useEffect(() => {
    setIsMobile(isMobileDevice());
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update component height when maxScroll changes
  useEffect(() => {
    if (maxScroll > 0) {
      setComponentHeight(maxScroll + window.innerHeight);
    }
  }, [maxScroll]);

  // GSAP animation for ScrollingText
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

  return (
    <main className="pixi-page">
      {isMobile ? (
        <SimpleScroll
          containerRef={containerRef}
          leftImages={leftImages}
          rightImages={rightImages}
          onMaxScrollCalculated={setMaxScroll}
          maxScroll={maxScroll}
        />
      ) : (
        <PixiImage
          containerRef={containerRef}
          leftImages={leftImages}
          rightImages={rightImages}
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