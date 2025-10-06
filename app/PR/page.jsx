"use client";

import { useState, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "@pixi/filter-displacement";
import Hero from "../PR/hero";
import Second from "../PR/second";
import Third from "../PR/second/third";
import Influencers from "./second/influencers";
import Stylist from "./second/stylist";
import PixiWaterImages from "../../app/components/PixiWaterImages";
import FullScreenWaterEffect from "../components/FullScreenWaterEffect";
const PixiWaterText = ({ containerRef }) => {
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    if (!pixiContainerRef.current || !containerRef.current) return;

    // Get text elements within containerRef, excluding no-water-effect
    const textElements = containerRef.current.querySelectorAll(
      "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
    );
    if (textElements.length === 0) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    pixiContainerRef.current.appendChild(app.view);
    app.view.style.position = "absolute";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.pointerEvents = "none";

    // Displacement sprite with fallback
    const displacementSprite = PIXI.Sprite.from("/pattern-clouds.jpg");
    displacementSprite.texture.baseTexture.on("error", () => {
      console.error("Failed to load /pattern-clouds.jpg, using fallback");
      displacementSprite.texture = PIXI.Texture.from("https://i.imgur.com/3PTiU4U.jpg");
    });
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.alpha = 0;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    const displacementFilter = new DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(10, 10);

    app.stage.addChild(displacementSprite);

    // Create PIXI text for each DOM text element
    const textSprites = [];
    textElements.forEach((el) => {
      const text = el.textContent;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const textSprite = new PIXI.Text(text, {
        fontFamily: style.fontFamily,
        fontSize: parseFloat(style.fontSize),
        fontWeight: style.fontWeight,
        fill: style.color,
        align: "left",
      });

      textSprite.x = rect.left + rect.width / 2;
      textSprite.y = rect.top + rect.height / 2;
      textSprite.anchor.set(0.5);
      textSprite.filters = [displacementFilter];

      app.stage.addChild(textSprite);
      textSprites.push({ sprite: textSprite, element: el });
    });

    // Animate displacement
    app.ticker.add(() => {
      displacementSprite.x += 3;
      displacementSprite.y += 3;
    });

    // Update positions on resize and scroll
    const updatePositions = () => {
      textSprites.forEach(({ sprite, element }) => {
        const rect = element.getBoundingClientRect();
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        sprite.visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      app.renderer.resize(window.innerWidth, window.innerHeight);
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
    };

    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current) pixiContainerRef.current.innerHTML = "";
    };
  }, [containerRef]);

  return <div ref={pixiContainerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2]" />;
};


export default function PRPortfolio() {
  
  const fashionImages = [
    { src: "/PR-images/1.webp", link: "#" },
    { src: "/PR-images/2.webp", link: "#" },
    { src: "/PR-images/16-1.webp", link: "#" },
    { src: "/PR-images/3.webp", link: "#" },
    { src: "/PR-images/4.webp", link: "#" },
    { src: "/PR-images/5.webp", link: "#" },
    { src: "/PR-images/6.webp", link: "#" },
    { src: "/PR-images/7.webp", link: "#" },
    { src: "/PR-images/8.webp", link: "#" },
    { src: "/PR-images/9.webp", link: "#" },
    { src: "/PR-images/10.webp", link: "#" },
    { src: "/PR-images/11.webp", link: "#" },
    { src: "/PR-images/12.webp", link: "#" },
    { src: "/PR-images/13.webp", link: "#" },
    { src: "/PR-images/14.webp", link: "#" },
    { src: "/PR-images/15.webp", link: "#" },
  ];

  const contentRef = useRef(null);
  
    useEffect(() => {
      if (!contentRef.current) return;
  
      // Hide text elements within contentRef, excluding no-water-effect
      const textElements = contentRef.current.querySelectorAll(
        "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
      );
      textElements.forEach((el) => {
        el.style.opacity = "0";
      });
  
      // Debug image loading
      const images = contentRef.current.querySelectorAll("img");
      images.forEach((img) => {
        if (!img.complete || img.naturalWidth === 0) {
          console.error(`Failed to load image: ${img.src}`);
        }
      });
  
      return () => {
        textElements.forEach((el) => {
          el.style.opacity = "1";
        });
      };
    }, []);

  return (
    <>
     <PixiWaterImages containerRef={contentRef} />
      <PixiWaterText containerRef={contentRef} />
      <div className="text-white min-h-screen p-8 px-0" ref={contentRef}>
        <Hero />
        <Second />
        <div className="px-4 sm:px-4 md:px-6 lg:px-10 mt-25">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-8">
            {fashionImages.map((image, index) => (
              <div key={index} className="col-span-1 w-full flex justify-center">
                <img
                  src={image.src}
                  alt={`Fashion ${index + 1}`}
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <Third />
        <Influencers />
        <Stylist />
      </div>
    </>
  );
}