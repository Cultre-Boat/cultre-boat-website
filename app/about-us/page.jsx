"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WaterEffect from "../components/WaterEffect"; 
import MovingFog from '../components/MovingFog';

const StudioAbout = () => {
  return (
    <div className="w-full bg-transparent text-white min-h-screen p-6 md:p-16 overflow-x-hidden mt-20">
      {/* <div className="absolute inset-0 z-0"> */}
        <MovingFog />
      {/* </div> */}
      {/* WHO ARE WE heading */}
      <h5 className="text-xs md:text-sm uppercase tracking-wider mb-6 md:mb-8 pl-0 md:pl-10 font-bold">WHO ARE WE</h5>

      {/* Main content section */}
      <div className="flex flex-col md:flex-row mb-12 md:mb-16 relative pl-0 md:pl-20">
        {/* Text content */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 md:mb-8 leading-tight md:leading-snug">
            Everybody loves a <br className="hidden md:block"/>good story and we  <br className="hidden md:block"/>love to build them.
          </h1>
           <div className="relative left-0 md:left-30 p-4 space-y-2 text-base md:text-lg text-gray-400">
            <Link href="https://www.facebook.com/CultreBoat/" className=" hover:text-white transition hidden md:block">Facebook</Link>
            <Link href="https://www.instagram.com/cultreboat/" className=" hover:text-white transition hidden md:block">Instagram</Link>
            <Link href="https://www.linkedin.com/company/cultre-boat" className=" hover:text-white transition hidden md:block">LinkedIn</Link>
          </div>
         
        </div>
        

        {/* Image with decorative corners */}
        <div className="md:w-1/2 md:absolute md:-right-1/10 h-48 md:h-64 lg:h-80 mt-8 md:mt-0 md:pl-20 relative">
          <Image
            src="/About-main.jpeg"
            alt="Creative studio atmosphere"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />

          <div className="absolute top-1/2 -left-4 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 opacity-70">
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-white"></div>
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-white"></div>
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-white"></div>
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-white"></div>
          </div>

          {/* Social links - position adjusted for mobile */}
         
        </div>
      </div>

      {/* First paragraph section */}
      <div className="mt-10 md:mt-10 mb-12 md:mb-10 max-w-full md:max-w-6xl pl-0 md:pl-44">
        <p className="text-xl md:text-3xl text-gray-300 tracking-wider text-justify">
          We're a creative studio that specializes in brand strategy and<br className="hidden md:block"/>
          digital creation, who enjoy a close working relationship with<br className="hidden md:block"/>
          each of our clients and engaging in meaningful digital<br className="hidden md:block"/>
          experiences.
        </p>
      </div>

      {/* Second paragraph section */}
      <div className="flex justify-center">
        <p className="text-xl md:text-3xl text-gray-300 mt-12 md:mt-16 max-w-full md:max-w-5xl text-center md:text-right tracking-wider ">
          We're marketers, copywriters, thinkers, social media enthusiasts,
          visual designers and <span className="font-medium">most importantly, communicators.</span>
        </p>
      </div>
    </div>
  );
};

export default StudioAbout;