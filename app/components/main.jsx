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
  "/image/img13.webp",
  "/image/img11.webp",
  "/image/img10.webp",
  "/image/img9.webp",
  "/image/img7.webp",
  "/image/img5.webp",
  "/image/img4.webp",
  "/image/img3.webp",
  "/image/img2.webp",
  "/image/img1.webp",
  "/image/img-14.webp",
  "/image/img-15.webp",
  "/image/img-16.webp",
  "/image/img13.webp",
  "/image/img11.webp",
  "/image/img10.webp",
  "/image/img9.webp",
  "/image/img7.webp",
  "/image/img5.webp",
  "/image/img4.webp",
  "/image/img3.webp",
  "/image/img2.webp",
  "/image/img1.webp",
  "/image/img-14.webp",
  "/image/img-15.webp",
  "/image/img-16.webp",
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
  "/image/img-14.webp",
  "/image/img-15.webp",
  "/image/img-16.webp",
  "/image/img1.webp",
  "/image/img2.webp",
  "/image/img3.webp",
  "/image/img4.webp",
  "/image/img5.webp",
  "/image/img7.webp",
  "/image/img9.webp",
  "/image/img10.webp",
  "/image/img11.webp",
  "/image/img13.webp",
  "/image/img-14.webp",
  "/image/img-15.webp",
  "/image/img-16.webp",
  "/image/img1.webp",
  "/image/img2.webp",
  "/image/img3.webp",
  "/image/img4.webp",
  "/image/img5.webp",
  "/image/img7.webp",
  "/image/img9.webp",
  "/image/img10.webp",
  "/image/img11.webp",
  "/image/img13.webp",
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
            
          </p>
        </div>
      </div>
      </main>
    </>
  );
}
