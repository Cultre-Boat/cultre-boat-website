"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SimpleScroll = ({ containerRef, leftImages, rightImages, onMaxScrollCalculated, maxScroll }) => {
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  // Calculate maxScroll and update parent
  useEffect(() => {
    if (!containerRef.current) return;

    const calculateMaxScroll = () => {
      const imageWidth = window.innerWidth * 0.45;
      const imageHeight = imageWidth * (4 / 3);
      const gap = window.innerHeight * 0.15;
      const leftColHeight = leftImages.length * imageHeight + (leftImages.length - 1) * gap;
      const rightColHeight = rightImages.length * imageHeight + (rightImages.length - 1) * gap;
      const calculatedMaxScroll = Math.max(leftColHeight, rightColHeight) - window.innerHeight;

      if (onMaxScrollCalculated) {
        onMaxScrollCalculated(calculatedMaxScroll);
      }
    };

    calculateMaxScroll();
    window.addEventListener("resize", calculateMaxScroll);
    return () => window.removeEventListener("resize", calculateMaxScroll);
  }, [containerRef, leftImages, rightImages, onMaxScrollCalculated]);

  // GSAP scroll animations
  useEffect(() => {
    if (!containerRef.current || !leftColRef.current || !rightColRef.current || maxScroll <= 0) return;

    const imageWidth = window.innerWidth * 0.45;
    const imageHeight = imageWidth * (4 / 3);
    const gap = window.innerHeight * 0.15;
    const leftColHeight = leftImages.length * imageHeight + (leftImages.length - 1) * gap;
    const rightColHeight = rightImages.length * imageHeight + (rightImages.length - 1) * gap;

    gsap.set(leftColRef.current, { y: 0 });
    gsap.set(rightColRef.current, { y: -rightColHeight + window.innerHeight });

    const ctx = gsap.context(() => {
      gsap.to(leftColRef.current, {
        y: -leftColHeight + window.innerHeight,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScroll}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(rightColRef.current, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScroll}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [maxScroll, containerRef, leftImages, rightImages]);

  // GSAP distortion animation
  useEffect(() => {
    const feTurbulence = document.querySelector("#imageDistortFilter feTurbulence");

    if (feTurbulence) {
      // Apply filter to all images
      document.querySelectorAll(".left-col img, .right-col img").forEach((img) => {
        img.style.filter = "url(#imageDistortFilter)";
      });

      // Animate turbulence for distortion effect
      gsap.to(feTurbulence, {
        attr: { baseFrequency: 0.02 },
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "linear",
      });
    } else {
      console.error("feTurbulence element not found");
    }
  }, []);

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <filter id="imageDistortFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="fixed top-0 left-0 z-[0] w-full flex justify-center px-2 mt-20">
        <div className="flex w-full max-w-[1200px] justify-between">
          <div ref={leftColRef} className="left-col w-[47%]">
            {leftImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Left Scroll"
                className="w-full h-[250px] mb-[12vh]"
                loading="lazy"
              />
            ))}
          </div>
          <div ref={rightColRef} className="right-col w-[47%]">
            {rightImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Right Scroll"
                className="w-full h-[250px] mb-[12vh]"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleScroll;