"use client";
import { useEffect } from "react";
import { gsap } from "gsap";

// Applies the animated water distortion (#textWaterFilter) to headings, paragraphs and links.
// Needs <WaterFilterDefs /> rendered on the same page.
export default function useWaterTextAnimation() {
  useEffect(() => {
    const textTurbulence = document.querySelector("#textWaterFilter feTurbulence");
    const textDisplacementMap = document.querySelector("#textWaterFilter feDisplacementMap");

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
  }, []);
}
