"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Third() {
  const portfolioItems = [
    { id: 1, image: "/third/webp/PR4_1.webp", magazine: "ELLE", title: "SO EXTRA" },
    { id: 2, image: "/third/webp/PR3_1.webp", magazine: "ELLE", title: "COSMOPOLITAN" },
    { id: 3, image: "/third/webp/PR2_1.webp", magazine: "COSMOPOLITAN", title: "FEMINA" },
    { id: 4, image: "/third/webp/PR1_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 5, image: "/third/webp/PR5_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 6, image: "/third/webp/PR6_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 7, image: "/third/webp/PR7_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 8, image: "/third/webp/PR8_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 9, image: "/third/webp/PR9_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 10, image: "/third/webp/PR11_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 11, image: "/third/webp/PR12_1.webp", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
  ];

  const [scrollPosition, _setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [speed, setSpeed] = useState(1.5);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const posRef = useRef(0);
  const logoWidth = 260;
  const totalWidth = portfolioItems.length * logoWidth;

  const animate = () => {
    const current = posRef.current + speed;
    posRef.current = current >= totalWidth ? current - totalWidth : current;
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Adjust speed dynamically based on device width
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSpeed(0.8);
      } else {
        setSpeed(0.4);
      }
    };

    handleResize(); // initial speed setup
    window.addEventListener("resize", handleResize);

    const onVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      } else if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [speed]);

  useEffect(() => {
    const id = setInterval(() => {
      const index = Math.floor((posRef.current % totalWidth) / logoWidth) % portfolioItems.length;
      setActiveIndex(index);
    }, 250);
    return () => clearInterval(id);
  }, []);

  const scrollToIndex = (index) => {
    const targetPosition = index * logoWidth;
    posRef.current = targetPosition;
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const repeatedItems = [...portfolioItems, ...portfolioItems, ...portfolioItems];

  return (
    <div className="w-full font nus font-bellota-light">
      {/* Header Section */}
      <div className="text-white py-0 md:py-0 text-center no-water-effect">
        <h1 className="text-2xl md:text-3xl">Creative Consultancy</h1>
        <p className="text-lg md:text-xl italic font-light mt-1">
          Impactful PR Approach
        </p>
      </div>

      {/* Portfolio Section */}
      <div className="relative w-full py-2 bg-white mt-3">
        <div className="relative overflow-hidden h-[380px]">
          <div
            ref={scrollRef}
            className="flex"
            style={{ willChange: "transform" }}
          >
            {repeatedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 mx-2 md:mx-1.5"
              >
                <div className="relative h-[350px]">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={`Portfolio item ${item.id}`}
                    width={0}
                    height={350}
                    sizes="100vw"
                    style={{
                      width: "auto",
                      height: "100%",
                      objectFit: "contain",
                      marginTop: "13px",
                    }}
                    className="no-water-effect"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {portfolioItems.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-300 rounded-full no-water-effect ${
              activeIndex === index
                ? "bg-blue-600 w-8 h-3"
                : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
