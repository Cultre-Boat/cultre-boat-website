"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollingText from "./ScrollingText";
import PixiImage from "./PixiImage";
import SimpleScroll from "./SimpleScroll";
import ImageColumnsFallback from "./ImageColumnsFallback";

gsap.registerPlugin(ScrollTrigger);

// --- 2. RENAME ORIGINAL DESKTOP IMAGES ---
const desktopLeftImages = [
"/Image/webp/img1.webp",
  "/Image/webp/img2.webp",
  "/Image/webp/img3.webp",
  "/Image/webp/img4.webp",
  "/Image/webp/img5.webp",
  "/Image/webp/img6.webp",
  "/Image/webp/img7.webp",
  "/Image/webp/img8.webp",
  "/Image/webp/img9.webp",
  "/Image/webp/img10.webp",
  "/Image/webp/img11.webp",
  "/Image/webp/img12.webp",
  "/Image/webp/img13.webp",
  "/Image/webp/img15.webp",
  "/Image/webp/img31.webp",
];

const desktopRightImages = [
  "/Image/webp/img30.webp",
  "/Image/webp/img29.webp",
  "/Image/webp/img1.webp",
  "/Image/webp/img27.webp",
  "/Image/webp/img26.webp",
  "/Image/webp/img25.webp",
  "/Image/webp/img24.webp",
  "/Image/webp/img23.webp",
  "/Image/webp/img22.webp",
  "/Image/webp/img21.webp",
  "/Image/webp/img20.webp",
  "/Image/webp/img19.webp",
  "/Image/webp/img18.webp",
  "/Image/webp/img17.webp",
  "/Image/webp/img16.webp",
];

// --- 3. VAMIKA & JANVI: ONLY THE UNCOMMENTED ONES, PLACED AT RANDOM SPOTS ON EACH LOAD ---
const vamikaJanviImages = [
  "/Vamika-janvi/vamika2.jpeg",
  "/Vamika-janvi/vamika3.jpeg",
  "/Vamika-janvi/vamika4.jpeg",
  // "/Vamika-janvi/vamika5.jpeg",
  // "/Vamika-janvi/vamika6.jpeg",
  // "/Vamika-janvi/vamika7.jpeg",
  // "/Vamika-janvi/vamika8.jpeg",
  // "/Vamika-janvi/janvikapoor1.jpeg",
  "/Vamika-janvi/janvikapoor2.jpeg",
  "/Vamika-janvi/janvikapoor3.jpeg",
  // "/Vamika-janvi/janvikapoor4.jpeg",
  // "/Vamika-janvi/janvikapoor5.jpeg",
  // "/Vamika-janvi/janvikapoor6.jpeg",
  // "/Vamika-janvi/janvikapoor7.jpeg",
];

// Fisher-Yates shuffle (returns a new array)
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Puts `extras` into `base` at evenly spaced spots (with a random start), so no two
// extras ever end up next to each other, even where the column loops back to the top.
function spreadInto(base, extras) {
  if (!extras.length) return [...base];
  const total = base.length + extras.length;
  const step = total / extras.length;
  const start = Math.random() * step;
  const extraSlots = new Set(extras.map((_, k) => Math.floor(start + k * step)));
  const result = [];
  let b = 0;
  let e = 0;
  for (let pos = 0; pos < total; pos++) {
    result.push(extraSlots.has(pos) ? extras[e++] : base[b++]);
  }
  return result;
}

// New random layout on every load: every image appears once, in random order.
// The Vamika/Janvi photos all go in one column (picked at random) and are spread out
// in it, so two of them never sit next to each other - not above/below, and not side by
// side (the columns scroll in opposite directions, so photos in different columns would
// pass each other at some point).
function scatterInto(leftBase, rightBase, extras) {
  const pool = shuffle([...new Set([...leftBase, ...rightBase])]);
  // The column with the extras gets fewer base images so both columns stay similar in length
  const extrasGoLeft = Math.random() < 0.5;
  const withExtrasCount = Math.floor((pool.length - extras.length) / 2);
  const withExtras = spreadInto(pool.slice(0, withExtrasCount), shuffle(extras));
  const plain = pool.slice(withExtrasCount);
  return extrasGoLeft
    ? { left: withExtras, right: plain }
    : { left: plain, right: withExtras };
}

// Mobile uses the same high-res images as desktop (the old /Image/Desgin files were
// 190x285 thumbnails that got upscaled ~3x on phones and looked blurry/stretched).
// Celebrity photos use 1000px-wide copies; the originals (up to 3328x4160) exceed
// the 4096px max texture size on many phones.
const vamikaJanviMobileImages = vamikaJanviImages.map((src) =>
  src.replace("/Vamika-janvi/", "/Vamika-janvi/web/")
);

function createScatteredLayout() {
  const extras = vamikaJanviImages;
  return {
    mobile: scatterInto(desktopLeftImages, desktopRightImages, vamikaJanviMobileImages),
    desktop: scatterInto(desktopLeftImages, desktopRightImages, extras),
  };
}

function isMobileDevice() {
  const userAgent =
    typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export default function EnhancedReverseStartLayout() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [componentHeight, setComponentHeight] = useState("auto");
  const [mountWaterEffect, setMountWaterEffect] = useState(false);
  const [scatter] = useState(createScatteredLayout);
  const [webgl, setWebgl] = useState(null); // null until checked on the client

  // Use a large height for continuous scrolling
  const largeScrollHeight = 100000; // Adjust for desired scroll distance

  useEffect(() => {
    setWebgl(hasWebGL());
    setIsMobile(isMobileDevice());
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setComponentHeight(largeScrollHeight);
  }, []);

  useEffect(() => {
    // Ensure the container DOM node exists before mounting water effect on mobile
    if (isMobile && containerRef.current && !mountWaterEffect) {
      setMountWaterEffect(true);
    }
  }, [isMobile, containerRef, mountWaterEffect]);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    // Text scroll animation for both mobile and desktop
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { x: "30vw" },
        {
          x: "-150vw",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${largeScrollHeight}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="pixi-page relative">
      {webgl === false ? (
        <ImageColumnsFallback
          leftImages={isMobile ? scatter.mobile.left : scatter.desktop.left}
          rightImages={isMobile ? scatter.mobile.right : scatter.desktop.right}
        />
      ) : webgl === null ? null : isMobile ? (
        <SimpleScroll
          containerRef={containerRef}
          leftImages={scatter.mobile.left}
          rightImages={scatter.mobile.right}
          scrollHeight={largeScrollHeight}
        />
      ) : (
        <PixiImage
          containerRef={containerRef}
          leftImages={scatter.desktop.left}
          rightImages={scatter.desktop.right}
          scrollHeight={largeScrollHeight}
        />
      )}
      <div
        ref={containerRef}
        style={{ height: largeScrollHeight }}
        className="relative w-full"
      >
        <ScrollingText ref={textRef} />
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <p className="text-white text-sm font-bold opacity-35">
            Scroll and Select
          </p>
        </div>
      </div>
    </main>
  );
}