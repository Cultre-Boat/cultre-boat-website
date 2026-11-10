"use client";

import { useState, useEffect, useRef } from "react";

const images = [
  { src: "/brands/png/1.png" },
  { src: "/brands/png/2.png" },
  { src: "/brands/png/3.png" },
  { src: "/brands/png/4.png" },
  { src: "/brands/png/5.png" },
  { src: "/brands/png/6.png" },
  { src: "/brands/png/7.png" },
  { src: "/brands/png/8.png" },
  { src: "/brands/png/9.png" },
  { src: "/brands/png/10.png" },
  { src: "/brands/png/11.png" },
  { src: "/brands/png/12.png" },
  { src: "/brands/png/13.png" },
  { src: "/brands/png/14.png" },
];

export default function ScrollingLogos() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const logoWidth = 160; // Width of each logo including spacing
  const totalWidth = images.length * logoWidth;

  useEffect(() => {
    const animate = () => {
      setScrollPosition((prev) => {
        const newPos = prev + 1.5;
        return newPos >= totalWidth ? newPos - totalWidth : newPos;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [totalWidth]);

  useEffect(() => {
    const index = Math.floor((scrollPosition % totalWidth) / logoWidth) % images.length;
    setActiveIndex(index);
  }, [scrollPosition]);

  const scrollToIndex = (index) => {
    const targetPosition = index * logoWidth;
    setScrollPosition(targetPosition);
  };

  const repeatedImages = [...images, ...images, ...images];

  return (
    <div className="relative w-full py-8">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
            willChange: 'transform',
          }}
        >
          {repeatedImages.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 no-water-effect"
            >
              <div className="flex items-center justify-center px-0 no-water-effect">
                <div className="w-[170px] h-[150px] flex items-center justify-center p-3 hover:shadow-2xl transition-all duration-300">
                  <img
                    src={img.src}
                    alt={`Logo ${(index % images.length) + 1}`}
                    className="w-[170px] h-[150px] object-contain no-water-effect"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-300 rounded-full no-water-effect ${
              activeIndex === index
                ? "bg-blue-600 w-8 h-3"
                : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
            }`}
            aria-label={`Go to logo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}