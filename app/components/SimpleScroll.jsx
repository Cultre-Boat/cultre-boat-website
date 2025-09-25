"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DisplacementFilter } from "@pixi/filter-displacement";
import { Assets } from "@pixi/assets"; // Explicitly import Assets

gsap.registerPlugin(ScrollTrigger);

// Initialize Pixi.js Assets (required for v6 with @pixi/assets)
Assets.init({ manifest: { bundles: [] } });

export default function PixiImage({ containerRef, leftImages, rightImages, onMaxScrollCalculated }) {
  const canvasRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const appRef = useRef(null);
  const displacementSpriteRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Initialize PIXI application with mobile optimizations
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundColor: 0x000000,
      backgroundAlpha: 1,
      autoDensity: true,
      resolution: isMobile ? 1 : window.devicePixelRatio,
      powerPreference: "high-performance",
      antialias: !isMobile,
    });
    appRef.current = app;

    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    app.stage.addChild(leftContainer, rightContainer);

    // Image dimensions
    const imageWidth = window.innerWidth * (isMobile ? 0.45 : 0.35);
    const imageHeight = imageWidth * (4 / 3);
    const gap = window.innerHeight * 0.1;

    // Preload images using Assets.load
    Assets.load([...leftImages, ...rightImages]).then(() => {
      leftImages.forEach((src, i) => {
        const sprite = PIXI.Sprite.from(src);
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

      // Position containers
      const positionContainers = () => {
        const screenWidth = window.innerWidth;
        leftContainer.x = screenWidth * 0.5 - imageWidth - screenWidth * 0.02;
        rightContainer.x = screenWidth * 0.5 + screenWidth * 0.02;
      };
      positionContainers();

      // Calculate maxScroll
      const calculateMaxScroll = () => {
        const leftColHeight = leftContainer.height;
        const rightColHeight = rightContainer.height;
        const maxScroll = Math.max(leftColHeight, rightColHeight) - window.innerHeight;
        if (onMaxScrollCalculated) {
          onMaxScrollCalculated(maxScroll);
        }
      };
      calculateMaxScroll();

      // GSAP animations
      gsap.set(leftContainer, { y: 0 });
      gsap.set(rightContainer, { y: -rightContainer.height + window.innerHeight });

      const ctx = gsap.context(() => {
        gsap.to(leftContainer, {
          y: -leftContainer.height + window.innerHeight,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${Math.max(leftContainer.height, rightContainer.height) - window.innerHeight}`,
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(rightContainer, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${Math.max(leftContainer.height, rightContainer.height) - window.innerHeight}`,
            scrub: 2,
            invalidateOnRefresh: true,
          },
        });
      }, containerRef);

      // Displacement filter with mobile optimizations
      const displacementTexture = PIXI.Texture.from(
        "https://raw.githubusercontent.com/Pierrinho/elephant/master/pattern-clouds.jpg",
        { resolution: isMobile ? 0.5 : 1 }
      );
      const displacementSprite = new PIXI.Sprite(displacementTexture);
      displacementSpriteRef.current = displacementSprite;
      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      displacementSprite.scale.set(isMobile ? 0.2 : 0.4);
      displacementSprite.alpha = 0;
      const displacementFilter = new DisplacementFilter(displacementSprite);
      displacementFilter.scale.set(isMobile ? 5 : 10);

      app.stage.addChild(displacementSprite);
      leftContainer.filters = [displacementFilter];
      rightContainer.filters = [displacementFilter];

      // Optimize ticker for mobile
      let lastTime = 0;
      const update = (time) => {
        if (!displacementSpriteRef.current) return;
        const delta = time - lastTime;
        if (delta > (isMobile ? 33 : 16)) {
          displacementSprite.x += isMobile ? 0.3 : 0.5;
          displacementSprite.y += isMobile ? 0.3 : 0.5;
          lastTime = time;
        }
      };
      app.ticker.add(update);

      // Handle resize
      const handleResize = () => {
        const newImageWidth = window.innerWidth * (isMobile ? 0.45 : 0.35);
        const newImageHeight = newImageWidth * (4 / 3);
        const newGap = window.innerHeight * 0.1;

        leftContainer.children.forEach((sprite, i) => {
          sprite.width = newImageWidth;
          sprite.height = newImageHeight;
          sprite.y = i * (newImageHeight + newGap);
        });

        rightContainer.children.forEach((sprite, i) => {
          sprite.width = newImageWidth;
          sprite.height = newImageHeight;
          sprite.y = i * (newImageHeight + newGap);
        });

        positionContainers();
        calculateMaxScroll();
      };
      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        ctx.revert();
        app.ticker.remove(update);
        app.destroy(true, { children: true, texture: true, baseTexture: true });
      };
    });

  }, [containerRef, leftImages, rightImages, onMaxScrollCalculated]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[0]" />;
}