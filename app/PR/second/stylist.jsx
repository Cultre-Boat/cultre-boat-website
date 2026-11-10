"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Stylist() {
  const productImages = [
    { src: "/stylist/webp/img1.webp", alt: "Stylist 1" },
    { src: "/stylist/webp/img2.webp", alt: "Stylist 2" },
    { src: "/stylist/webp/img3.webp", alt: "Stylist 3" },
    { src: "/stylist/webp/img4.webp", alt: "Stylist 4" },
    { src: "/stylist/webp/img5.webp", alt: "Stylist 5" },
    { src: "/stylist/webp/img6.webp", alt: "Stylist 6" },
  ];

  const [scrollPosition, _setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [speed, setSpeed] = useState(1.5);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const posRef = useRef(0);
  const logoWidth = 250; // must match the item width below
  const totalWidth = productImages.length * logoWidth;

  const animate = () => {
    const current = posRef.current + speed;
    posRef.current = current >= totalWidth ? current - totalWidth : current;
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Adjust speed for mobile devices
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSpeed(0.8);
      } else {
        setSpeed(0.4);
      }
    };

    handleResize(); // set initial speed
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
      const index = Math.floor((posRef.current % totalWidth) / logoWidth) % productImages.length;
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

  const repeatedImages = [...productImages, ...productImages, ...productImages];

  return (
    <>
      <div className="text-white py-2 md:py-3 text-center mt-4 md:mt-6 mb-0 font-bellota-light text-stable no-water-effect">
        <h1 className="text-2xl md:text-3xl font-light tracking-[2px] uppercase text-white no-water-effect px-4">STYLISTS</h1>
      </div>

      <div className="relative w-full py-6 bg-white">
        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex"
            style={{ willChange: "transform" }}
          >
            {repeatedImages.map((img, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="relative w-[250px]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={250}
                    height={300}
                    className="w-full h-auto block no-water-effect"
                    sizes="250px"
                    priority={index < 6}
                    quality={90}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6 mb-6">
        {productImages.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all no-water-effect ${
              activeIndex === index ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
