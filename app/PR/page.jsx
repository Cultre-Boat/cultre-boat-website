import React from "react";
import Hero from "../PR/hero";
import Second from "../PR/second";
import Third from "../PR/second/third";
import Influencer from "./second/influencers";
import Stylist from "./second/stylist";
// import WaterEffect from "../../app/components/WaterEffect";
import MovingFog from "../../app/components/MovingFog";

export default function PRPortfolio() {
  // Object containing images and their associated links
  const fashionImages = [
    { src: "/1.png", link: "#" },
    { src: "/2.png", link: "#" },
    { src: "/16-1.png", link: "#" },
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
    <div className="text-white min-h-screen p-8 px-0">
      <MovingFog />
      <Hero />
      <Second />
      {/* Fashion Images Grid */}
      <div className="px-4 sm:px-4 md:px-6 lg:px-10 mt-25">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-8">
          {fashionImages.map((image, index) => (
            <div key={index} className="col-span-1 w-full flex justify-center">
              <img
                src={image.src}
                alt={`Fashion ${index + 1}`}
                width={400} // set a width
                height={400} // set a height
                className=" object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <Third />
      <Influencer />
      <Stylist />
    </div>
  );
}
