import React from 'react';
import Hero from '../PR/hero';
import Second from '../PR/second';
import Third from "../PR/second/third"
import Influencer from "./second/influencers";
import Stylist from "./second/stylist";
import WaterEffect from "../../app/components/WaterEffect";

export default function PRPortfolio() {
  // Object containing images and their associated links
  const fashionImages = [
    { src: "/1.png", link: "#" },
    { src: "/2.png", link: "#" },
    { src: "/16.png", link: "#" },
    { src: "/3.png", link: "#" },
    { src: "/4.png", link: "#" },
    { src: "/5.png", link: "#" },
    { src: "/6.png", link: "#" },
    { src: "/7.png", link: "#" },
    { src: "/8.png", link: "#" },
    { src: "/9.png", link: "#" },
    { src: "/10.png", link: "#" },
    { src: "/11.png", link: "#" },
    { src: "/12.png", link: "#" },
    { src: "/13.png", link: "#" },
    { src: "/14.png", link: "#" },
    { src: "/15.png", link: "#" },

  ];

  return (
    <div className="bg-[linear-gradient(to_bottom,#272323,#3F3F3F)] text-white min-h-screen p-8 px-0">
      <WaterEffect />
      <Hero />
      <Second />
      {/* Fashion Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-20 mb-12">
        {fashionImages.map((image, index) => (
          <div key={index} className="col-span-1">
            <img
              src={image.src}
              alt="Fashion"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <Third />
      <Influencer />
      <Stylist />
    </div>
  );
}