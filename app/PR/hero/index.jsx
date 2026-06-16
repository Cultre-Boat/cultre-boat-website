"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const contentRef = useRef(null);

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

  // Helper function to extract YouTube video ID from various URL formats
  const getYouTubeId = (url) => {
    const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== arr[2] ? arr[2].split(/[?&]/)[0] : arr[0];
  };

  return (
    <section className="w-full bg-transparent text-white mt-10 md:mt-16 mb-3 md:mb-5 font-bellota-light">
      {/* ================= HERO TOP SECTION ================= */}
      <div className="flex flex-col md:flex-row items-center">
        {/* Left text section */}
        <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-15 flex flex-col justify-center text-center">
          <div className="space-y-2 md:space-y-3 text-stable no-water-effect px-4">
            <p className="text-lg md:text-xl tracking-[2px] uppercase text-white my-2 no-water-effect">
              DECODING IMPACT
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl mb-0 font-thin text-white no-water-effect" style={{ fontWeight: 200 }}>PR</h1>
            <div className="pt-2 md:pt-2 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl lg:text-2xl text-white italic leading-relaxed no-water-effect font-light" style={{ fontWeight: 300 }}>
                Editorial Calendar
              </p>
              <p className="text-xl md:text-2xl lg:text-2xl text-white italic leading-relaxed no-water-effect font-light" style={{ fontWeight: 300 }}>
                Collaborations
              </p>
            </div>
          </div>
        </div>

        {/* Right image/video section */}
        <div className="w-full md:w-1/2 flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[500px] aspect-[16/9]">
            {/* <button
            onClick={() =>
              openVideoModal("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            }
            className="w-full h-full focus:outline-none"
            aria-label="Play video"
          > */}
            <Image
              src="/PR-images/PR_top.webp"
              alt="Cultural celebration with people in traditional attire"
              width={600}
              height={337.5} // Maintain 16:9 aspect ratio (600 / 16 * 9)
              className="object-cover hover:opacity-90 transition-opacity duration-300"
              priority
              quality={100}
              unoptimized={false}
            />
            {/* <div className="absolute inset-0 flex items-center justify-center">
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
            </div> */}
            {/* </button> */}
          </div>
        </div>
      </div>

      {/* ================= VIDEO MODAL ================= */}
      {/* {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={closeVideoModal}
          ></div>
          <div className="relative z-10 w-full max-w-4xl">
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
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )} */}

      {/* ================= BOTTOM SECTION ================= */}
      <div className="w-full flex flex-col md:flex-row justify-between px-6 md:px-20 mt-6 md:mt-10 gap-4 md:gap-12 md:h-[70vh]">
        {/* Left Image (News Screenshot) */}
        <div className="w-full md:w-1/2 h-full flex justify-center md:justify-start">
          <div className="w-full h-[380px] md:h-[450px] relative max-w-[400px]">
            <Image
              src="/PR-images/PR-first.webp"
              alt="BuzzFeed news article screenshot"
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 h-full flex justify-center md:justify-end">
          <div className="w-full h-[380px] md:h-[450px] relative max-w-[800px]">
            <Image
              src="/PR-images/PR_2.webp"
              alt="Secondary news image"
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
