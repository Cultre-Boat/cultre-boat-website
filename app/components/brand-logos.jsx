"use client";

import { useEffect } from "react";

const images = [
  { src: "/brands/1.png", link: "https://example.com/1" },
  { src: "/brands/2.png", link: "https://example.com/2" },
  { src: "/brands/3.png", link: "https://example.com/3" },
  { src: "/brands/4.png", link: "https://example.com/4" },
  { src: "/brands/5.png", link: "https://example.com/5" },
  { src: "/brands/6.png", link: "https://example.com/6" },
  { src: "/brands/7.png", link: "https://example.com/7" },
  { src: "/brands/8.png", link: "https://example.com/8" },
  { src: "/brands/9.png", link: "https://example.com/9" },
  { src: "/brands/10.png", link: "https://example.com/10" },
  { src: "/brands/11.png", link: "https://example.com/11" },
  { src: "/brands/12.png", link: "https://example.com/12" },
  { src: "/brands/13.png", link: "https://example.com/13" },
  { src: "/brands/14.jpg", link: "https://example.com/14" },
];

export default function ScrollingLogos() {
  useEffect(() => {
    // Debug image loading
    const imgs = document.querySelectorAll(".logo-image");
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        console.log(`Successfully loaded logo: ${img.src}`);
      } else {
        console.error(`Failed to load logo: ${img.src}`);
      }
    });
  }, []);

  return (
    <>
      {/* <h1 className="text-center text-4xl mb-7 no-water-effect">LOGO</h1> */}
      <div className="relative w-full overflow-hidden py-8 z-[10]">
        <div className="flex w-full overflow-hidden">
          <div className="flex animate-marquee-left space-x-6">
            {[...images, ...images].map((img, index) => (
              <a
                key={index}
                href={img.link}
                target="_blank"
                rel="noopener noreferrer"
                className="no-water-effect"
              >
                <div className="w-35 h-35 bg-white  shadow-lg flex items-center justify-center object-contain z-[10]">
                  <img
                    src={img.src}
                    alt={`Logo ${index + 1}`}
                    width={300}
                    height={320}
                    
                    className="object-contain logo-image no-water-effect"
                    onLoad={() => console.log(`Loaded logo: ${img.src}`)}
                    onError={(e) => {
                      console.error(`Failed to load logo: ${e.target.src}`);
                      e.target.src = "https://via.placeholder.com/100?text=Logo+Failed";
                    }}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}