"use client";

import { useEffect, forwardRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PixiMobile = forwardRef(({ containerRef, leftImages, rightImages, onMaxScrollCalculated }, ref) => {
  useEffect(() => {
    if (!ref?.current || !containerRef.current) return;

    // Optimize DPR for mobile - use actual DPR but cap at 2 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const app = new PIXI.Application({
      view: ref.current, // Use the forwarded ref directly
      resizeTo: window,
      backgroundColor: 0x000000,
      backgroundAlpha: 0, // transparent
      antialias: true, // Enable antialiasing for better quality
      resolution: dpr,
      powerPreference: "high-performance", // Better performance on modern mobile devices
      preserveDrawingBuffer: false, // Better memory management
    });

    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    app.stage.addChild(leftContainer, rightContainer);

    // Optimize image dimensions for better quality on mobile
    const screenWidth = window.innerWidth;
    const imageWidth = Math.min(screenWidth * 0.48, 400); // Cap at 400px for performance
    const imageHeight = imageWidth * (4 / 3);
    const gap = Math.max(window.innerHeight * 0.08, 20); // Reduced gap for better performance
    

    leftImages.forEach((src, i) => {
      const sprite = PIXI.Sprite.from(src);
      sprite.texture.baseTexture.on("loaded", () => console.log(`Loaded: ${src}`));
      sprite.texture.baseTexture.on("error", () => console.error(`Failed to load: ${src}`));
      
      // High-quality rendering settings
      sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
      sprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
      sprite.roundPixels = true;
      sprite.anchor.set(0);
      
      sprite.width = imageWidth;
      sprite.height = imageHeight;
      sprite.y = i * (imageHeight + gap);
      leftContainer.addChild(sprite);
    });

    rightImages.forEach((src, i) => {
      const sprite = PIXI.Sprite.from(src);
      
      // High-quality rendering settings
      sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
      sprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
      sprite.roundPixels = true;
      sprite.anchor.set(0);
      
      sprite.width = imageWidth;
      sprite.height = imageHeight;
      sprite.y = i * (imageHeight + gap);
      rightContainer.addChild(sprite);
    });

    const positionContainers = () => {
      const sw = window.innerWidth;
      leftContainer.x = sw * 0.5 - imageWidth - sw * 0.02;
      rightContainer.x = sw * 0.5 + sw * 0.02;
    };
    positionContainers();

    const calculateMaxScroll = () => {
      const h = Math.max(leftContainer.height, rightContainer.height);
      onMaxScrollCalculated?.(Math.max(0, h - window.innerHeight));
    };
    calculateMaxScroll();

    gsap.set(leftContainer, { y: 0 });
    gsap.set(rightContainer, { y: -rightContainer.height + window.innerHeight });

    const ctx = gsap.context(() => {
      const st = {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${Math.max(leftContainer.height, rightContainer.height) - window.innerHeight}`,
        scrub: 1.5,
        invalidateOnRefresh: true,
      };
      gsap.to(leftContainer, { y: -leftContainer.height + window.innerHeight, ease: "none", scrollTrigger: st });
      gsap.to(rightContainer, { y: 0, ease: "none", scrollTrigger: st });
    });

    // --- MOBILE-OPTIMISED WATER ---
    // Only apply displacement effects on larger screens for better performance
    if (window.innerWidth >= 768) {
      const dispTexture = PIXI.Texture.from("/pattern-clouds.jpg");
      dispTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      const displacementSprite = new PIXI.Sprite(dispTexture);
      displacementSprite.scale.set(0.4);
      const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
      displacementFilter.scale.set(1.5); // Reduced intensity for better performance
      displacementFilter.padding = 0;

      app.stage.addChild(displacementSprite);
      leftContainer.filters = [displacementFilter];
      rightContainer.filters = [displacementFilter];
    }

    app.ticker.maxFPS = 60; // Increased FPS for smoother animation
    app.ticker.add(() => {
      // Only animate displacement if it exists (larger screens)
      if (window.innerWidth >= 768 && app.stage.children.includes(displacementSprite)) {
        displacementSprite.x += 0.25;
        displacementSprite.y += 0.25;
      }
    });

    const onResize = () => {
      const screenWidth = window.innerWidth;
      const nw = Math.min(screenWidth * 0.48, 400);
      const nh = nw * (4 / 3);
      const ng = Math.max(window.innerHeight * 0.08, 20);
      [...leftContainer.children, ...rightContainer.children].forEach((s, i) => {
        s.width = nw;
        s.height = nh;
        s.y = Math.floor(i / leftImages.length) * (nh + ng);
      });
      positionContainers();
      calculateMaxScroll();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [containerRef, leftImages, rightImages, onMaxScrollCalculated, ref]);

  return(<>
    <div style={{ position: "fixed", top: 0, left: 0, color: "white" }}>PixiMobile Debug</div>
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
  </>);
});

PixiMobile.displayName = "PixiMobile";
export default PixiMobile;