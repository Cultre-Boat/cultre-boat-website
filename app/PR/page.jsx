"use client";

import { useState, useEffect, useRef } from "react";
import Hero from "../PR/hero";
import Second from "../PR/second";
import Third from "../PR/second/third";
import Influencers from "./second/influencers";
import Stylist from "./second/stylist";
import PixiWaterImages from "../components/PixiWaterImages";

export default function PRPortfolio() {
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

  // Ensure content paints immediately; no initial hiding
  useEffect(() => {}, []);

  return (
    <>
      <div id="pr-content" className="text-white min-h-screen p-8 px-0" ref={contentRef}>
        <Hero />
        <Second />
        <div className="px-4 sm:px-4 md:px-6 lg:px-10 mt-5 md:mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-8 mt:2 md:mt-40">
            {fashionImages.map((image, index) => (
              <div
                key={index}
                className="col-span-1 w-full flex justify-center"
              >
                <img
                  src={image.src}
                  alt={`Fashion ${index + 1}`}
                  width={400}
                  height={400}
                  className="object-contain"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        </div>
        <Third />
        <Influencers />
        <Stylist />
      </div>
      <PixiWaterImages containerRef={contentRef} />
    </>
  );
}
