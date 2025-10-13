"use client";

import { useRef } from "react";
import Image from "next/image";

export default function Influencers() {
  const contentRef = useRef(null);

  const productImages = [
    { src: "/Influencers/img1.webp", alt: "Product 1" },
    { src: "/Influencers/img2.webp", alt: "Product 2" },
    { src: "/Influencers/img3.webp", alt: "Product 3" },
    { src: "/Influencers/imgn11.jpg", alt: "Product 11" },
    { src: "/Influencers/img4.webp", alt: "Product 4" },
    { src: "/Influencers/img5.webp", alt: "Product 5" },
    { src: "/Influencers/img6.webp", alt: "Product 6" },
    { src: "/Influencers/img7.jpg", alt: "Product 7" },
    { src: "/Influencers/img8.jpg", alt: "Product 8" },
    { src: "/Influencers/img9.jpg", alt: "Product 9" },
    { src: "/Influencers/imgn10.jpg", alt: "Product 10" },
  ];

  return (
    <>
      <div className="text-white py-5 text-center font-bellota-light">
        <h1 className="text-2xl md:text-3xl">INFLUENCERS</h1>
      </div>

      <div className="relative w-full overflow-hidden bg-white" ref={contentRef}>

        <div className="flex w-full overflow-hidden relative z-10">
          <div className="flex animate-marquee-left items-center py-1">
            {[...productImages, ...productImages].map((img, index) => (
              <div key={index} className="mx-3 flex-shrink-0">
                <div className="relative w-[250px] h-[350px]">
                   
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain no-water-effect"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
