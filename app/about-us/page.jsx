"use client";
import React, { useEffect } from 'react'; // Import useEffect here
import Link from 'next/link';
import Image from 'next/image';
import MovingFog from '../components/MovingFog';
import { gsap } from "gsap";

// Note: The 'WaterEffect' component was imported but not used, so I've removed it.

const StudioAbout = () => {
  // ✅ useEffect hook is now correctly placed inside the component
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
        attr: { baseFrequency: "0.019 0.02" },
        duration: 20,
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: "section",
          start: "top bottom",
          toggleActions: "play pause resume reset",
        },
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
        attr: { baseFrequency: "0.02 0.10" },
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

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
      <div className="w-full bg-transparent text-white min-h-screen p-6 md:p-16 overflow-x-hidden mt-20">
     
        
        <h5 className="text-xs md:text-sm uppercase tracking-wider mb-6 md:mb-8 pl-0 md:pl-10 ">WHO ARE WE</h5>

        <div className="flex flex-col md:flex-row mb-12 md:mb-16 relative pl-0 md:pl-20">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 md:mb-8 leading-tight md:leading-snug">
              Everybody loves a <br className="hidden md:block"/>good story and we <br className="hidden md:block"/>love to build them.
            </h1>
            <div className="relative left-0 md:left-30 p-4 space-y-2 text-base md:text-lg text-gray-400">
              <Link href="https://www.facebook.com/CultreBoat/" className=" hover:text-white transition hidden md:block">Facebook</Link>
              <Link href="https://www.instagram.com/cultreboat/" className=" hover:text-white transition hidden md:block">Instagram</Link>
              <Link href="https://www.linkedin.com/company/cultre-boat" className=" hover:text-white transition hidden md:block">LinkedIn</Link>
            </div>
          </div>

          {/* Image container must be relative for the fill prop to work */}
          <div className="md:w-1/2 md:absolute md:-right-1/10 h-48 md:h-64 lg:h-80 mt-8 md:mt-0 md:pl-20 relative">
            {/* ✅ Updated Image component */}
            <Image
              src="/About-main.jpeg"
              alt="Creative studio atmosphere"
              fill // Use fill instead of layout="fill"
              className="object-cover opacity-90" // Use className for object-fit
            />
            {/* Decorative corners remain the same */}
            <div className="absolute top-1/2 -left-4 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 opacity-70">
              <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-white"></div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-10 mb-12 md:mb-10 max-w-full md:max-w-6xl pl-0 md:pl-44">
          <p className="text-xl md:text-3xl text-gray-300 tracking-wider text-justify">
            We're a creative studio that specializes in brand strategy and<br className="hidden md:block"/>
            digital creation, who enjoy a close working relationship with<br className="hidden md:block"/>
            each of our clients and engaging in meaningful digital<br className="hidden md:block"/>
            experiences.
          </p>
        </div>

        <div className="flex justify-center">
          <p className="text-xl md:text-3xl text-gray-300 mt-12 md:mt-16 max-w-full md:max-w-5xl text-center md:text-right tracking-wider ">
            We're marketers, copywriters, thinkers, social media enthusiasts,
            visual designers and <span>most importantly, communicators.</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default StudioAbout;