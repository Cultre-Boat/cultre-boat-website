"use client";

import { useState } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideoModal = (url) => {
    setVideoUrl(url);
    setIsVideoOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setVideoUrl(null);
    setIsVideoOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="w-full bg-transparent text-white mt-20 md:mt-25 mb-20 md:mb-40">
      <div className="flex flex-col md:flex-row">
        {/* Left content section */}
        <div className="w-full md:w-1/2 p-6 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="space-y-4 md:space-y-12">
            <h3 className="text-xs md:text-base lg:text-lg tracking-widest uppercase font-medium">
              DECODING IMPACT
            </h3>

            <h1 className="text-4xl md:text-7xl lg:text-8xl">PR</h1>

            <div className="pt-4 md:pt-16 ml-0 md:ml-[65px] max-w-2xl">
              <h2 className="text-xl md:text-3xl lg:text-3xl font-medium">
                Editorial Calendar
              </h2>
              <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 italic">
                Potential Collaborations
              </p>
            </div>
          </div>
        </div>

        {/* Right image section - now with video modal trigger */}
        <div className="w-full md:w-4/5 h-[30vh] sm:h-[40vh] md:h-auto relative right-[2%]">
          <button 
            onClick={() => openVideoModal("https://www.youtube.com/watch?v=fPNV5JEMx5A")}
            className="w-full h-full focus:outline-none"
            aria-label="Play video"
          >
            <Image
              src="/PR-main.png"
              alt="Cultural celebration with people in traditional attire"
              fill
              className="object-cover hover:opacity-90 transition-opacity duration-300"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeVideoModal}
          ></div>

          {/* Video Container */}
          <div className="relative z-10 w-full max-w-4xl rounded-lg overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Responsive Video Embed */}
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]}?autoplay=1&modestbranding=1&rel=0`}
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
    </section>
  );
}