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
    { src: "/PR-images/1.webp", link: "#" },
    { src: "/PR-images/2.webp", link: "#" },
    { src: "/PR-images/16-1.webp", link: "#" },
    { src: "/PR-images/3.webp", link: "#" },
    { src: "/PR-images/4.webp", link: "#" },
    { src: "/PR-images/5.webp", link: "#" },
    { src: "/PR-images/6.webp", link: "#" },
    { src: "/PR-images/7.webp", link: "#" },
    { src: "/PR-images/8.webp", link: "#" },
    { src: "/PR-images/9.webp", link: "#" },
    { src: "/PR-images/10.webp", link: "#" },
    { src: "/PR-images/11.webp", link: "#" },
    { src: "/PR-images/12.webp", link: "#" },
    { src: "/PR-images/13.webp", link: "#" },
    { src: "/PR-images/14.webp", link: "#" },
    { src: "/PR-images/15.webp", link: "#" },
  ];

  return (
    <div className="text-white min-h-screen p-8 px-0">
      {/* <MovingFog /> */}
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
