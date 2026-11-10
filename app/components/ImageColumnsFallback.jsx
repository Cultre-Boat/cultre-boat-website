"use client";

import { useEffect, useRef } from "react";

// Plain-image version of the homepage columns, used when WebGL is unavailable
// (hardware acceleration off, old devices, some locked-down browsers).
// Two centred columns that move in opposite directions as the page scrolls, looping forever.
export default function ImageColumnsFallback({ leftImages, rightImages }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      for (const [el, dir] of [[leftRef.current, -1], [rightRef.current, 1]]) {
        if (!el) continue;
        const loop = el.scrollHeight / 2 || 1; // list is rendered twice
        const offset = ((y % loop) + loop) % loop;
        el.style.transform = `translate3d(0, ${dir < 0 ? -offset : offset - loop}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    // Re-measure whenever the columns change size: images loading, the viewport resizing,
    // or the page being revealed after the initial loading screen (it starts display:none).
    const observer = new ResizeObserver(onScroll);
    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const column = (images, ref) => (
    <div className="w-[45vw] md:w-[31vw] overflow-hidden h-full">
      <div ref={ref} className="flex flex-col gap-[1.5vh] will-change-transform">
        {[...images, ...images].map((src, i) => (
          <img key={i} src={src} alt="" decoding="async" className="w-full h-auto block" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none flex justify-center gap-[1.5vh] bg-[#2a4862]" aria-hidden="true">
      {column(leftImages, leftRef)}
      {column(rightImages, rightRef)}
    </div>
  );
}
