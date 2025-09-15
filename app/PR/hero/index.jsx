"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function HeroSection() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideoModal = (url) => {
    setVideoUrl(url);
    setIsVideoOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeVideoModal = () => {
    setVideoUrl(null);
    setIsVideoOpen(false);
    document.body.style.overflow = "auto";
  };

    useEffect(() => {
  const imageTurbulence = document.querySelector("#waterFilter feTurbulence");
  const imageDisplacementMap = document.querySelector(
    "#waterFilter feDisplacementMap"
  );

  if (imageTurbulence && imageDisplacementMap) {
    document.querySelectorAll("img").forEach((img) => {
      img.style.filter = "url(#waterFilter)";
    });

    gsap.set(imageDisplacementMap, { attr: { scale: 12 } });

    gsap.to(imageTurbulence, {
  attr: { baseFrequency: "0.012 0.01" },
  duration: 15,
  repeat: -1,
  yoyo: true,
  scrollTrigger: { trigger: "section", start: "top bottom", toggleActions: "play pause resume reset" }
});

  }

  const textTurbulence = document.querySelector(
    "#textWaterFilter feTurbulence"
  );
  const textDisplacementMap = document.querySelector(
    "#textWaterFilter feDisplacementMap"
  );

  if (textTurbulence && textDisplacementMap) {
    document.querySelectorAll("h1, h2, h3, p, a").forEach((el) => {
      el.style.filter = "url(#textWaterFilter)";
    });

    gsap.set(textDisplacementMap, { attr: { scale: 10 } });

    gsap.to(textTurbulence, {
      attr: { baseFrequency: "0.04 0.12" },
      duration: 15, // ⏳ slowed from 7 → 15
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }
}, []);

  // Helper function to extract YouTube video ID from various URL formats
  const getYouTubeId = (url) => {
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== arr[2] ? arr[2].split(/[?&]/)[0] : arr[0];
  };

  return (
    <>
      <svg className="absolute w-0 h-0 pointer-events-none">
       <filter id="waterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.008"
            numOctaves="1"
            result="noiseForImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noiseForImage"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="textWaterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            result="noiseForText"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noiseForText"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <section className="w-full bg-transparent text-white mt-20 md:mt-20 mb-10 md:mb-15">
        {/* ================= HERO TOP SECTION ================= */}
        <div className="flex flex-col md:flex-row">
          {/* Left text section */}
          <div className="w-full md:w-1/2 p-6 md:p-16 lg:p-15 flex flex-col justify-center text-center md:text-left">
            <div className="space-y-4 md:space-y-12">
              <h3 className="text-xs md:text-base lg:text-lg tracking-widest uppercase font-medium mb-4">
                DECODING IMPACT
              </h3>

              <h1 className="text-4xl md:text-7xl lg:text-8xl mb-0">PR</h1>

              <div className="pt-4 md:pt-5 md:ml-[65px] max-w-2xl mx-auto md:mx-0">
                <h2 className="text-lg md:text-2xl lg:text-3xl text-gray-300 italic leading-relaxed">
                  Editorial Calendar <br />
                  Potential <br /> Collaborations
                </h2>
              </div>
            </div>
          </div>

          {/* Right image/video section -- UPDATED */}
          <div className="w-[85%] md:w-4/5 h-[40vh] md:h-[80vh] relative md:right-[2%] -mt-12 md:mt-0 mx-auto">
            <button
              onClick={() =>
                openVideoModal("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
              }
              className="w-full h-full focus:outline-none"
              aria-label="Play video"
            >
              <Image
                src="/PR-main.png"
                alt="Cultural celebration with people in traditional attire"
                fill
                className="object-contain hover:opacity-90 transition-opacity duration-300"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 flex items-center justify-center backdrop-blur-md">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ================= VIDEO MODAL ================= */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={closeVideoModal}
            ></div>

            <div className="relative z-10 w-full max-w-4xl overflow-hidden">
              <button
                onClick={closeVideoModal}
                className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 transition-colors"
                aria-label="Close video"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    videoUrl
                  )}?autoplay=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh]"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* ================= BOTTOM SECTION ================= */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mt-0 md:mt-7 md:gap-12">
          {/* Left Image (News Screenshot) */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start md:mb-0">
            <Image
              src="/PR-first.png"
              alt="BuzzFeed article screenshot"
              width={500}
              height={800}
              className="object-contain"
            />
          </div>

          {/* Right Text (Tagline) */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start text-center md:text-left mt-5">
            <h2 className="text-lg sm:text-xl md:text-5xl lg:text-6xl font-bold text-white leading-snug sm:leading-tight">
              Redefining Bridal{" "}
              <span className="text-pink-400">Traditions</span>
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}