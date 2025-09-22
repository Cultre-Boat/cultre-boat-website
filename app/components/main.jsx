"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollingText from "./ScrollingText";
import PixiImage from "./PixiImage";

gsap.registerPlugin(ScrollTrigger);

// The list of images can be defined outside the component

const leftImages = [
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img1.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img2.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img13.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img3.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-14.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-15.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img4.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img5.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img1.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img2.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img13.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img3.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-14.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-15.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img4.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img5.jpeg",
  "/Image/img13.webp",
  "/Image/img11.webp",
  "/Image/img10.webp",
  "/Image/img9.webp",
  "/Image/img7.webp",
  "/Image/img5.webp",
  "/Image/img4.webp",
  "/Image/img3.webp",
  "/Image/img2.webp",
  "/Image/img1.webp",
  "/Image/img-14.webp",
  "/Image/img-15.webp",
  "/Image/img-16.webp",
  "/Image/img13.webp",
  "/Image/img11.webp",
  "/Image/img10.webp",
  "/Image/img9.webp",
  "/Image/img7.webp",
  "/Image/img5.webp",
  "/Image/img4.webp",
  "/Image/img3.webp",
  "/Image/img2.webp",
  "/Image/img1.webp",
  "/Image/img-14.webp",
  "/Image/img-15.webp",
  "/Image/img-16.webp",
];

const rightImages = [
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img10.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img9.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-15.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img1.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img4.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-14.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img8.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img13.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img10.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img9.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-15.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img1.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img4.jpeg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img-14.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img8.jpg",
  // "https://cdn.jsdelivr.net/gh/Avinesh-2001/CB@main/img13.jpeg",
  "/Image/img-14.webp",
  "/Image/img-15.webp",
  "/Image/img-16.webp",
  "/Image/img1.webp",
  "/Image/img2.webp",
  "/Image/img3.webp",
  "/Image/img4.webp",
  "/Image/img5.webp",
  "/Image/img7.webp",
  "/Image/img9.webp",
  "/Image/img10.webp",
  "/Image/img11.webp",
  "/Image/img13.webp",
  "/Image/img-14.webp",
  "/Image/img-15.webp",
  "/Image/img-16.webp",
  "/Image/img1.webp",
  "/Image/img2.webp",
  "/Image/img3.webp",
  "/Image/img4.webp",
  "/Image/img5.webp",
  "/Image/img7.webp",
  "/Image/img9.webp",
  "/Image/img10.webp",
  "/Image/img11.webp",
  "/Image/img13.webp",
];


export default function EnhancedReverseStartLayout() {
  const containerRef = useRef(null);
  const textRef = useRef(null); // Refs for the ScrollingText component
  const designTextRef = useRef(null);
  const prTextRef = useRef(null);
  const socialTextRef = useRef(null); // State to hold the maximum scroll distance calculated by the PixiImage component
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    if (!containerRef.current || maxScroll === 0) return;
    const ctx = gsap.context(() => {
      gsap.set(containerRef.current, {
        height: maxScroll + window.innerHeight,
      }); // Horizontal text scrolling animation, now using the synchronized `maxScroll` value.

      gsap.fromTo(
        textRef.current,
        { x: "30vw" },
        {
          x: "-150vw",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom", // Use "bottom bottom" for perfect sync
            scrub: 1.5,
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert(); // No need for ScrollTrigger.killAll() here as context handles cleanup
    };
  }, [maxScroll]); // Dependency array ensures this runs when maxScroll is calculated

  return (
    <>
      <main className="pixi-page">
      <PixiImage
        containerRef={containerRef}
        leftImages={leftImages}
        rightImages={rightImages}
        onMaxScrollCalculated={setMaxScroll} // Pass the setter function as a prop
      />
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <ScrollingText
          ref={textRef}
          designTextRef={designTextRef}
          prTextRef={prTextRef}
          socialTextRef={socialTextRef}
        />
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <p className="text-white text-sm font-bold opacity-35">
             Scroll and Select
          </p>
        </div>
      </div>
      </main>
    </>
  );
}
