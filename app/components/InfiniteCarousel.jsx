"use client";

import React, { useEffect, useState, useRef} from 'react';
import Image from 'next/image';

const InfiniteCarousel = ({ images, speed = 1, className = '' }) => {
  const [duplicatedImages, setDuplicatedImages] = useState([...images, ...images]);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame;
    let position = 0;
    const animationSpeed = speed * 0.5; // Adjust speed factor

    const animate = () => {
      position -= animationSpeed;
      
      // When we've scrolled one full set of images, reset to start
      if (position <= -container.scrollWidth / 2) {
        position = 0;
      }

      container.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [images, speed]);

  return (
    <div className={`w-full bg-white overflow-hidden py-8 ${className}`}>
      <div className="relative w-full overflow-hidden">
        <div 
          ref={containerRef}
          className="flex w-max space-x-6 items-center"
          style={{ willChange: 'transform' }}
        >
          {duplicatedImages.map((img, index) => (
            <a 
              key={`${img.src}-${index}`} 
              href={img.link || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className="w-40 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <Image 
                  src={img.src} 
                  alt={img.alt || `Logo ${index + 1}`} 
                  width={100} 
                  height={110} 
                  className="object-contain scale-[1.5]"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteCarousel;