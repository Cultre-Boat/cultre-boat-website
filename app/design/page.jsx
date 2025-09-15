"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Last from "../components/design-last";
import Logos from "../components/brand-logos";
import Mailers from "../components/mailers";
import LIZ from "../components/designLiz";
import WaterEffect from "../components/WaterEffect";
import MovingFog from "../components/MovingFog";

export default function DesignPortfolio() {
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


  return (
    <>
      <MovingFog />
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
      <div className=" text-white leading-relaxed overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header Section */}
          <section className="py-2 relative mt-25">
            <div className="flex flex-col lg:flex-row items-center min-h-[400px] lg:min-h-[400px] gap-5 lg:gap-10 md:mt-20">
              <div className="flex-1 text-center lg:text-left px-4 lg:px-5">
                <p className="text-sm lg:text-base tracking-[2px] uppercase text-gray-500 my-5 font-light">
                  DECODING BRANDING
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight mb-5 leading-none">
                  DESIGN
                </h1>
                <p className="text-base lg:text-lg text-gray-300 mt-2.5 mb-0">
                  Brand Identity Design
                </p>
                <p className="text-base lg:text-lg text-gray-300 -mb-2.5 ">
                  Tone Of Voice
                </p>
              </div>
              <div className="flex-1 relative w-full max-w-md lg:max-w-2xl">
                <Image
                  src="/Design-image1.png"
                  alt="Traditional Fashion Design"
                  width={600}
                  height={400}
                  className="w-full h-auto opacity-90"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="py-2 mt-10 md:mt-0">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-24 justify-center mb-10">
              {/* Left Image - Bigger Width */}
              <div className="relative overflow-hidden w-full lg:w-[650px] h-[335px] md:mt-5 -mb-6 md:mb-0">
                <span className="absolute  left-0 z-10 bg-black text-white py-2.5 px-2.5 rounded-tr-lg rounded-br-lg text-sm lg:text-base tracking-wider">
                  For GURORGANIC by Pernia Qureshi
                </span>
                <Image
                  src="/Design-image2.svg"
                  alt="Gurorganic Campaign"
                  width={650}
                  height={320}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Right Image - Smaller Width */}
              <div className="relative overflow-hidden w-full lg:w-[500px]">
                <Image
                  src="/Design-image3 1.png"
                  alt="Fashion Photography"
                  width={500}
                  height={350}
                  className="w-full h-auto mt-5"
                />
              </div>
            </div>
          </section>

         {/* Creative Direction Section with Video */}
{/* Creative Direction Section with Video */}
<section className="py-2 text-center">
  <h2 className="text-xl lg:text-2xl font-light tracking-[2px] uppercase">
    CREATIVE DIRECTION AND STRATEGY
  </h2>
  <p className="text-xs lg:text-sm text-gray-500 italic mb-0 md:mb-14">
    Brand Positioning
  </p>

  <div className="flex flex-col lg:flex-row gap-3 lg:gap-12 justify-center mx-4 mb-9 items-end">
    {/* Left side - Video with play button */}
    <div className="relative overflow-hidden w-full max-w-[600px]">
      <button
        onClick={() =>
          openVideoModal("https://www.youtube.com/watch?v=C-4C4VnyZco")
        }
        className="w-full focus:outline-none block"
        aria-label="Play video"
      >
        <Image
          src="/Design-image4 1.png"
          alt="Kalki Fashion"
          width={600}
          height={350}
          className="w-full h-[350px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
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

    {/* Right side - Regular image */}
    <div className="relative overflow-hidden w-full max-w-[600px]">
      <Image
        src="/Design-image5 1.png"
        alt="Product Photography"
        width={600}
        height={350}
        className="w-full h-[350px] object-contain"
      />
    </div>
  </div>
</section>
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

                {/* Responsive Video Embed */}
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      videoUrl.split("v=")[1]
                    }?autoplay=1&modestbranding=1&rel=0`}
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

          {/* Visual Vocabulary Section */}
          <section className="py-2 text-center">
            <h2 className="text-xl lg:text-2xl font-light tracking-[2px] uppercase">
              VISUAL VOCABULARY
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 italic mb-14">
              Exhibition Guidelines
            </p>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-24 justify-center mx-4 mb-9">
              <div className="relative overflow-hidden">
                <div className="w-full h-96 lg:h-[450px] relative overflow-hidden">
                  <Image
                    src="/image 2.png"
                    alt="Visual Vocabulary Design 1"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden">
                <div className="w-full h-96 lg:h-[450px] relative overflow-hidden">
                  <Image
                    src="/image 3.png"
                    alt="Visual Vocabulary Design 2"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Print Section */}
          <section className="text-center py-2">
            <h2 className="text-xl lg:text-2xl font-light tracking-[2px] uppercase">
              PRINT AND DIGITAL DESIGN
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 italic mb-14">
              Collaterals
            </p>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-24 justify-center mx-4 mb-5">
              <div className="relative overflow-hidden">
                <div className="w-full h-96 lg:h-[450px] relative overflow-hidden">
                  <Image
                    src="/Design-image8.svg"
                    alt="Print Design 1"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden">
                <div className="w-full h-96 lg:h-[450px] relative overflow-hidden">
                  <Image
                    src="/image-5.png"
                    alt="Print Design 2"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Collage Section */}
          <section className="py-2">
            <div className="text-center mb-12 ">
              <hr className="w-3/5 h-px bg-gray-600 border-none mx-auto mb-10" />
              <p className="text-xl lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl text-gray-300 max-w-[60%] mx-auto leading-7 font-light mt-2">
                Explore our latest projects showcasing our design capabilities
                across various mediums and industries.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center justify-center px-4">
              <div className="flex flex-col gap-4 w-full max-w-lg lg:max-w-xl">
                <div>
                  <Image
                    src="/Mailer/1.jpg"
                    alt="Portfolio Item 1"
                    width={570}
                    height={400}// ✅ ensures it defers loading
                    quality={75}
                    loading="eager"
                    className="w-full h-auto block object-contain"
                  />
                </div>
                <div>
                  <Image
                    src="/Mailer/4.jpg"
                    alt="Portfolio Item 4"
                    width={570}
                    height={400}
                    loading="eager" // ✅ ensures it defers loading
                    quality={75}
                    className="w-full h-auto block object-contain"
                  />
                </div>
                <div>
                  <Image
                    src="/Mailer/6.jpg"
                    alt="Portfolio Item 6"
                    width={570}
                    height={400}
                    loading="eager" // ✅ ensures it defers loading
                    quality={75}
                    className="w-full h-auto block object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-lg lg:max-w-xl">
                <div>
                  <Image
                    src="/Mailer/2.png"
                    alt="Portfolio Item 2"
                    width={570}
                    height={400}
                    loading="eager" // ✅ ensures it defers loading
                    quality={75}
                    className="w-full h-auto block object-contain"
                  />
                </div>
                <div>
                  <Image
                    src="/Mailer/5.jpg"
                    alt="Portfolio Item 5"
                    width={570}
                    height={400}
                    loading="eager" // ✅ ensures it defers loading
                    quality={75}
                    className="w-full h-auto block object-contain"
                  />
                </div>
                <div>
                  <Image
                    src="/Mailer/7.jpg"
                    alt="Portfolio Item 7"
                    width={570}
                    height={400}
                    loading="eager" // ✅ ensures it defers loading
                    quality={75}
                    className="w-full h-auto block object-contain"
                  />
                </div>
                <div>
                  <Image
                    src="/Mailer/Group.png"
                    alt="Portfolio Item 8"
                    width={570}
                    height={400}
                    loading="eager" // ✅ ensures it defers loading
                    quality={75}
                    className="w-full h-auto block object-contain"
                  />
                </div>
              </div>
            </div>
            <hr className="w-3/5 h-px bg-gray-600 border-none mx-auto mb-5 mt-15" />
          </section>

          <section className="py-2">
            <Logos />
          </section>
        </div>
      </div>
    </>
  );
}
