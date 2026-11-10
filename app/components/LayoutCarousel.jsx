"use client";
import React, { useEffect, useState } from 'react';
import useIsDesktop from "../hooks/useIsDesktop";
import useSwipe from "../hooks/useSwipe";
import CarouselArrow from "./carousel/CarouselArrow";
import CarouselDots from "./carousel/CarouselDots";

export const layoutImages = Array.from({ length: 13 }, (_, i) => `/layout/img${i + 1}.png`);

// Same look as the PR page carousels: arrows, swipe, autoplay and pill dots.
// Fixed-height frame with object-contain so every image is shown in full without the page jumping.
// desktopPerView: how many images to show side by side on md+ screens (mobile always shows 1).
// linkHref: optional URL opened in a new tab when an image is clicked.
export function LayoutCarousel({ images, desktopPerView = 1, linkHref }) {
  const isDesktop = useIsDesktop();
  const [page, setPage] = useState(0);
  const count = images.length;

  const perView = isDesktop ? desktopPerView : 1;
  const pageCount = Math.ceil(count / perView);
  const visible = Array.from({ length: perView }, (_, k) => images[(page * perView + k) % count]);

  const next = () => setPage((p) => (p + 1) % pageCount);
  const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);

  // Restarts after every change, so manual navigation gets a full 4s before autoplay moves on
  useEffect(() => {
    const id = setTimeout(next, 4000);
    return () => clearTimeout(id);
  }, [page, pageCount]);

  // Keep the page index valid when switching between mobile and desktop
  useEffect(() => {
    setPage((p) => p % pageCount);
  }, [pageCount]);

  const swipe = useSwipe({ onNext: next, onPrev: prev });

  return (
    <div className="relative" {...swipe}>
      {/* Each photo keeps its own shape and height (no cropping, no empty bands), side by side with one gap */}
      <div
        className={`relative w-full grid gap-2 md:gap-3 h-[50vh] md:h-[60vh] items-stretch px-10 md:px-16 ${
          perView === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {visible.map((src, k) => {
          const alt = `Layout ${((page * perView + k) % count) + 1}`;
          const img = (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain block no-water-effect"
            />
          );
          return (
            <div key={`${page}-${k}`} className="min-w-0 min-h-0 relative">
              {linkHref ? (
                <a
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open layout highlights on Instagram"
                  className="absolute inset-0 block cursor-pointer"
                >
                  {img}
                </a>
              ) : (
                img
              )}
            </div>
          );
        })}
      </div>

      {/* Arrows sit at the left and right of the photos. The photo area has a fixed height, so they stay in place. */}
      <CarouselArrow
        direction="prev"
        onClick={prev}
        label="Previous image"
        className="absolute left-0 md:left-2 top-[25vh] md:top-[30vh] -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all z-10"
        iconClassName="w-5 h-5 md:w-6 md:h-6 text-white"
      />
      <CarouselArrow
        direction="next"
        onClick={next}
        label="Next image"
        className="absolute right-0 md:right-2 top-[25vh] md:top-[30vh] -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all z-10"
        iconClassName="w-5 h-5 md:w-6 md:h-6 text-white"
      />

      <CarouselDots count={pageCount} current={page} onSelect={setPage} />
    </div>
  );
}
