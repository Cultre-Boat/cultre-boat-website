"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DisplacementFilter } from "@pixi/filter-displacement";

gsap.registerPlugin(ScrollTrigger);

export default function PixiImage({ containerRef, leftImages, rightImages, onMaxScrollCalculated }) {
  const canvasRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundColor: 0x000000,
      backgroundAlpha: 1,
    });

    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    app.stage.addChild(leftContainer, rightContainer);

    // Load images and create sprites
    const imageWidth = window.innerWidth * 0.35;
    const imageHeight = imageWidth * (4 / 3);
    const gap = window.innerHeight * 0.1;

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

    // Displacement filter
    const displacementSprite = PIXI.Sprite.from(
      "https://raw.githubusercontent.com/Pierrinho/elephant/master/pattern-clouds.jpg"
    );
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.4);
    displacementSprite.alpha = 0;
    const displacementFilter = new DisplacementFilter(displacementSprite);

    app.stage.addChild(displacementSprite);
    leftContainer.filters = [displacementFilter];
    rightContainer.filters = [displacementFilter];

    app.ticker.add(() => {
      displacementSprite.x += 0.3;
      displacementSprite.y += 0.3;
    });

    // Handle resize
    const handleResize = () => {
      const newImageWidth = window.innerWidth * 0.35;
      const newImageHeight = newImageWidth * (4 / 3);
      const newGap = window.innerHeight * 0.1;

      // Update sprite sizes and positions
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
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [containerRef, leftImages, rightImages, onMaxScrollCalculated]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[0] opacity-[0.7]" />;
}