"use client";

import { useState, useEffect, useRef } from "react";

const images = [
  { src: "/brands/new/1.png", link: "https://example.com/1" },
  { src: "/brands/new/2.png", link: "https://example.com/2" },
  { src: "/brands/new/3.png", link: "https://example.com/3" },
  { src: "/brands/new/4.png", link: "https://example.com/4" },
  { src: "/brands/new/5.png", link: "https://example.com/5" },
  { src: "/brands/new/6.png", link: "https://example.com/6" },
  { src: "/brands/new/7.png", link: "https://example.com/7" },
  { src: "/brands/new/8.png", link: "https://example.com/8" },
  { src: "/brands/new/9.png", link: "https://example.com/9" },
  { src: "/brands/new/10.png", link: "https://example.com/10" },
  { src: "/brands/new/11.png", link: "https://example.com/11" },
  { src: "/brands/new/12.png", link: "https://example.com/12" },
  { src: "/brands/new/13.png", link: "https://example.com/13" },
  { src: "/brands/new/14.png", link: "https://example.com/14" },
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
            <a
              key={index}
              href={img.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 no-water-effect"
            >
              <div className="flex items-center justify-center px-3 no-water-effect">
                <div className="w-[140px] h-[120px] bg-white rounded-xl shadow-lg flex items-center justify-center p-3 hover:shadow-2xl transition-all duration-300">
                  <img
                    src={img.src}
                    alt={`Logo ${(index % images.length) + 1}`}
                    className="w-[130px] h-[110px] object-contain no-water-effect"
                  />
                </div>
              </div>
            </a>
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