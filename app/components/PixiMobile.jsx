"use client";

import { useEffect, forwardRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DisplacementFilter } from "@pixi/filter-displacement";

gsap.registerPlugin(ScrollTrigger);

const PixiMobile = forwardRef(({ containerRef, leftImages, rightImages, onMaxScrollCalculated }, ref) => {
  useEffect(() => {
    if (!ref?.current || !containerRef.current) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1); // cap DPR

    const app = new PIXI.Application({
      view: ref.current, // Use the forwarded ref directly
      resizeTo: window,
      backgroundColor: 0x000000,
      backgroundAlpha: 0, // transparent
      antialias: false,
      resolution: dpr,
      powerPreference: "low-power",
    });

    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    app.stage.addChild(leftContainer, rightContainer);

    const imageWidth = window.innerWidth * 0.47;
    const imageHeight = imageWidth * (4 / 3);
    const gap = window.innerHeight * 0.12;
    

    leftImages.forEach((src, i) => {
  const sprite = PIXI.Sprite.from(src);
  sprite.texture.baseTexture.on("loaded", () => console.log(`Loaded: ${src}`));
  sprite.texture.baseTexture.on("error", () => console.error(`Failed to load: ${src}`));
  sprite.width = imageWidth;
  sprite.height = imageHeight;
  sprite.y = i * (imageHeight + gap);
  leftContainer.addChild(sprite);
});

    rightImages.forEach((src, i) => {
      const sprite = PIXI.Sprite.from(src);
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
    const dispTexture = PIXI.Texture.from("/pattern-clouds.jpg");
    dispTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacementSprite = new PIXI.Sprite(dispTexture);
    displacementSprite.scale.set(0.4);
    const displacementFilter = new DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(2); // gentle ripple
    displacementFilter.padding = 0;

    app.stage.addChild(displacementSprite);
    leftContainer.filters = [displacementFilter];
    rightContainer.filters = [displacementFilter];

    app.ticker.maxFPS = 30; // lock fps
    app.ticker.add(() => {
      displacementSprite.x += 0.25;
      displacementSprite.y += 0.25;
    });

    const onResize = () => {
      const nw = window.innerWidth * 0.47;
      const nh = nw * (4 / 3);
      const ng = window.innerHeight * 0.12;
      [...leftContainer.children, ...rightContainer.children].forEach((s, i) => {
        s.width = nw;
        s.height = nh;
        s.y = Math.floor(i / leftImages.length) * (nh + ng); // quick remap
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