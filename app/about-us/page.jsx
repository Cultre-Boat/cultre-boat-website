"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { gsap } from "gsap";
import BtsImages from "../components/BtsImages";
import SectionLabel from "../components/SectionLabel";
import WaterFilterDefs from "../components/WaterFilterDefs";
import useWaterTextAnimation from "../hooks/useWaterTextAnimation";
import { socialLinks } from "../lib/socialLinks";

const StudioAbout = () => {
  useWaterTextAnimation();

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
      });
    }

  }, []);

  return (
    <>
      <WaterFilterDefs withImageFilter />

      <div className="w-full bg-transparent text-white min-h-screen overflow-x-hidden px-6 md:px-16 lg:px-24 pt-28 md:pt-36 pb-4 md:pb-4">

        {/* Intro: headline */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-12">
            <SectionLabel className="mb-6 flex items-center gap-4">
              <span className="w-10 h-[1px] bg-white/60"></span>
              Who are we
            </SectionLabel>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">
              Everybody loves a good story and we love to build them.
            </h1>
          </div>
        </section>

        {/* Statement */}
        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-16">
          <SectionLabel className="md:col-span-2">
            Our studio
          </SectionLabel>
          <p className="md:col-span-10 text-2xl md:text-4xl lg:text-5xl text-gray-200 font-light leading-snug">
            We're a creative studio that specializes in brand strategy and digital creation, who enjoy a close working relationship with each of our clients and engaging in meaningful digital experiences.
          </p>
        </section>

        {/* BTS photos (public/BTSimages/web) */}
        <section className="mt-10 md:mt-14">
          <SectionLabel className="mb-6 md:mb-10">
            Behind the scenes
          </SectionLabel>
          {/* Pull the photos out past the page padding so the side margin matches the gap between photos */}
          <div className="-mx-4 md:-mx-[52px] lg:-mx-[84px]">
            <BtsImages />
          </div>
        </section>

        {/* Team */}
        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-16">
          <SectionLabel className="md:col-span-2">
            Our people
          </SectionLabel>
          <div className="md:col-span-10">
            <ul className="flex flex-wrap gap-3 mb-8">
              {["Marketers", "Copywriters", "Thinkers", "Social media enthusiasts", "Visual designers"].map((role) => (
                <li
                  key={role}
                  className="text-sm md:text-base uppercase tracking-widest border border-white/20 rounded-full px-4 py-2 text-white/80"
                >
                  {role}
                </li>
              ))}
            </ul>
            <p className="text-xl md:text-3xl text-gray-300 font-light leading-relaxed">
              We're marketers, copywriters, thinkers, social media enthusiasts, visual designers and <span className="text-white">most importantly, communicators.</span>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 md:mt-8 grid grid-cols-2 gap-6 md:gap-16">
          <div>
            <p className="text-4xl md:text-6xl font-light">10+</p>
            <SectionLabel className="mt-2">Years</SectionLabel>
          </div>
          <div>
            <p className="text-4xl md:text-6xl font-light">50+</p>
            <SectionLabel className="mt-2">Brands served</SectionLabel>
          </div>
        </section>

        {/* How we work */}
        <section className="mt-8 md:mt-10">
          <SectionLabel className="mb-5 md:mb-6">
            How we work
          </SectionLabel>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {[
              { title: "Decode the brand", text: "Brand positioning & strategy that defines who the brand is and who it speaks to." },
              { title: "Shape the identity", text: "Brand identity, visual vocabulary and tone of voice that carry the story consistently." },
              { title: "Create across media", text: "Print & digital design, campaigns and collaterals built from one brand system." },
              { title: "Amplify and grow", text: "Content creation & management, influencer collaboration and creative consultancy to build retention." },
            ].map((step, i) => (
              <li key={step.title}>
                <span className="text-xs tracking-[0.3em] text-white/50">0{i + 1}</span>
                <h3 className="mt-3 text-xl md:text-2xl font-light">{step.title}</h3>
                <p className="mt-2 text-sm md:text-base text-gray-300 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Social */}
        <section className="mt-10 md:mt-14 flex flex-wrap gap-x-10 gap-y-4">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm md:text-base uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300"
            >
              <span className="w-8 h-[1px] bg-gray-400 group-hover:bg-white group-hover:w-12 transition-all duration-300"></span>
              {link.label}
            </Link>
          ))}
        </section>
      </div>
    </>
  );
};

export default StudioAbout;
