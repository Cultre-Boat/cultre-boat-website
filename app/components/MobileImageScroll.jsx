"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaterShaderOverlay from "./WaterShaderOverlay";

gsap.registerPlugin(ScrollTrigger);

export default function MobileImageScroll({ containerRef, leftImages, rightImages, scrollHeight }) {
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const initialized = useRef(false);
  const currentOffsetRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || initialized.current || typeof window === 'undefined') return;
    initialized.current = true;

    const leftColumn = leftColumnRef.current;
    const rightColumn = rightColumnRef.current;

    // Calculate single image + gap height (same logic as desktop)
    const calculateImageHeight = () => {
      const firstImg = leftColumn.querySelector('img');
      if (!firstImg) return 0;
      return firstImg.offsetHeight + 12; // image height + gap-3 (12px)
    };

    // Wait for first image to load
    setTimeout(() => {
      const imageHeight = calculateImageHeight();
      const gap = 12;
      const singleLeftHeight = leftImages.length * imageHeight;
      const singleRightHeight = rightImages.length * imageHeight;
      const initialRightY = -(singleRightHeight - window.innerHeight);
      
      console.log('Image Height:', imageHeight, 'Left Total:', singleLeftHeight, 'Right Total:', singleRightHeight);

      // Position images using same logic as desktop PixiImage
      const updatePositions = (offset) => {
        // Left column - scroll down
        Array.from(leftColumn.children).forEach((img, i) => {
          const baseY = i * imageHeight;
          let y = baseY - (offset % singleLeftHeight);
          if (y < -imageHeight) y += singleLeftHeight;
          if (y > singleLeftHeight) y -= singleLeftHeight;
          img.style.transform = `translateY(${y}px)`;
          img.style.top = '0';
        });

        // Right column - scroll up (reverse)
        Array.from(rightColumn.children).forEach((img, i) => {
          const baseY = i * imageHeight;
          let y = baseY + (offset % singleRightHeight) + initialRightY;
          if (y < -imageHeight) y += singleRightHeight;
          if (y > singleRightHeight) y -= singleRightHeight;
          img.style.transform = `translateY(${y}px)`;
          img.style.top = '0';
        });
      };

      updatePositions(0);

      const ctx = gsap.context(() => {
        const dummy = { progress: 0 };
        gsap.to(dummy, {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollHeight}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const scrollPos = self.scroll();
              currentOffsetRef.current = (scrollPos % singleLeftHeight + singleLeftHeight) % singleLeftHeight;
              console.log('Scroll:', scrollPos, 'Offset:', currentOffsetRef.current);
              updatePositions(currentOffsetRef.current);
            }
          }
        });
      }, containerRef);

      return () => {
        ctx.revert();
      };
    }, 300);

  }, [containerRef, leftImages, rightImages, scrollHeight]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[1] overflow-hidden">
      <div ref={leftColumnRef} className="will-change-transform absolute" style={{ 
        left: '8px',
        width: 'calc(50% - 14px)',
        top: 0
      }}>
        {leftImages.map((src, i) => (
          <img
            key={`ml-${i}`}
            src={src}
            alt=""
            loading="eager"
            className="w-full h-auto object-cover rounded-sm mobile-water-img"
            style={{ position: 'absolute', width: '100%', top: 0 }}
          />
        ))}
      </div>
      
      <div ref={rightColumnRef} className="will-change-transform absolute" style={{ 
        right: '8px',
        width: 'calc(50% - 14px)',
        top: 0
      }}>
        {rightImages.map((src, i) => (
          <img
            key={`mr-${i}`}
            src={src}
            alt=""
            loading="eager"
            className="w-full h-auto object-cover rounded-sm mobile-water-img"
            style={{ position: 'absolute', width: '100%', top: 0 }}
          />
        ))}
      </div>
    </div>
  );
}

