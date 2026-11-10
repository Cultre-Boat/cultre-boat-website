"use client";

import { useState, useEffect, useRef } from "react";
import Hero from "../PR/hero";
import Second from "../PR/second";
import Third from "../PR/second/third";
import Influencers from "./second/influencers";
import Stylist from "./second/stylist";
import PixiWaterImages from "../components/PixiWaterImages";
import useSwipe from "../hooks/useSwipe";
import CarouselArrow from "../components/carousel/CarouselArrow";

// Single-image carousel used on mobile so each celebrity gets its own slider
function SoloCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const next = () => setIndex((prev) => (prev + 1) % count);
  const prev = () => setIndex((p) => (p - 1 + count) % count);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((p) => (p + 1) % count);
    }, 4000);
    return () => clearInterval(interval);
  }, [count]);

  const image = images[index];
  const swipe = useSwipe({ onNext: next, onPrev: prev });

  return (
    <div className="relative" {...swipe}>
      <div className="relative overflow-hidden">
        <img
          src={image.src}
          alt={image.name}
          className="w-full h-auto block no-water-effect"
        />
        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
          <p className="text-white text-lg font-light tracking-wide">
            {image.name}
          </p>
        </div>
      </div>

      <CarouselArrow
        direction="prev"
        onClick={prev}
        label="Previous image"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition-all z-10"
      />
      <CarouselArrow
        direction="next"
        onClick={next}
        label="Next image"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full transition-all z-10"
      />

    </div>
  );
}

export default function PRPortfolio() {
  const [waterIntensity, setWaterIntensity] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setWaterIntensity(0.75);
      } else {
        setWaterIntensity(0.5);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Vamika and Janvi carousel images - grouped in pairs
  const carouselSlides = [
    [
      { src: "/Vamika-janvi/web/vamika2.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor1.jpeg", name: "Janvi Kapoor" }
    ],
    [
      { src: "/Vamika-janvi/web/vamika3.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor2.jpeg", name: "Janvi Kapoor" }
    ],
    [
      { src: "/Vamika-janvi/web/vamika4.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor3.jpeg", name: "Janvi Kapoor" }
    ],
    [
      { src: "/Vamika-janvi/web/vamika5.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor4.jpeg", name: "Janvi Kapoor" }
    ],
    [
      { src: "/Vamika-janvi/web/vamika6.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor5.jpeg", name: "Janvi Kapoor" }
    ],
    [
      { src: "/Vamika-janvi/web/vamika7.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor6.jpeg", name: "Janvi Kapoor" }
    ],
    [
      { src: "/Vamika-janvi/web/vamika8.jpeg", name: "Vamika" },
      { src: "/Vamika-janvi/web/janvikapoor7.jpeg", name: "Janvi Kapoor" }
    ],
  ];

  // Separate lists for the mobile carousels
  const vamikaImages = carouselSlides.map((pair) => pair[0]);
  const janviImages = carouselSlides.map((pair) => pair[1]);

  const fashionImages = [
    { src: "/PR-images/webp/1.webp", link: "#" },
    { src: "/PR-images/webp/2.webp", link: "#" },
    { src: "/PR-images/webp/16-1.webp", link: "#" },
    { src: "/PR-images/webp/3.webp", link: "#" },
    { src: "/PR-images/webp/4.webp", link: "#" },
    { src: "/PR-images/webp/5.webp", link: "#" },
    { src: "/PR-images/webp/6.webp", link: "#" },
    { src: "/PR-images/webp/7.webp", link: "#" },
    { src: "/PR-images/webp/8.webp", link: "#" },
    { src: "/PR-images/webp/9.webp", link: "#" },
    { src: "/PR-images/webp/10.webp", link: "#" },
    { src: "/PR-images/webp/11.webp", link: "#" },
    { src: "/PR-images/webp/12.webp", link: "#" },
    { src: "/PR-images/webp/13.webp", link: "#" },
    { src: "/PR-images/webp/14.webp", link: "#" },
    { src: "/PR-images/webp/15.webp", link: "#" },
    { src: "/PR-images/webp/17.webp", link: "#" },
    { src: "/PR-images/webp/18.webp", link: "#" },
    { src: "/PR-images/webp/19.webp", link: "#" },
    { src: "/PR-images/webp/20.webp", link: "#" },
  ];

  const contentRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="text-white min-h-screen px-0">
        <div id="pr-content" ref={contentRef}>
          <Hero />
          
          {/* Celebrity Carousel Section - 2 Images at a Time - AT TOP */}
          <div className="relative w-full py-6 md:py-8 overflow-hidden">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-4 tracking-wider">
              CELEBRITY SOURCING
            </h2>
            
            {/* Mobile: two independent carousels, one per celebrity */}
            <div className="md:hidden px-4 flex flex-col gap-0">
              <SoloCarousel images={vamikaImages} />
              <SoloCarousel images={janviImages} />
            </div>

            {/* Desktop: paired carousel */}
            <div className="hidden md:block relative max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 gap-0 items-start">
                {carouselSlides[currentSlide].map((image, index) => (
                  <div key={index} className="relative overflow-hidden group">
                    <img
                      src={image.src}
                      alt={image.name}
                      className="w-full h-auto block no-water-effect"
                    />
                    <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
                      <p className="text-white text-lg font-light tracking-wide">
                        {image.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all z-10"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all z-10"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Media & Stylists Section - Below Carousel */}
          <Second />
          
          {/* Fashion Grid - WITH water effect */}
          <div className="mt-6 md:mt-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-8 tracking-wider">
              PORTFOLIO
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {fashionImages.map((image, index) => (
                <div key={index} className="w-full">
                  <img
                    src={image.src}
                    alt={`Fashion ${index + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-auto block no-water-effect"
                    loading={index < 8 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="no-water-effect no-cursor-distort">
          <Third />
          <Influencers />
          <Stylist />
        </div>
      </div>
      <PixiWaterImages containerRef={contentRef} intensity={waterIntensity} />
    </>
  );
}
