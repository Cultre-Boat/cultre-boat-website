"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DisplacementFilter } from "@pixi/filter-displacement";

gsap.registerPlugin(ScrollTrigger);

const SimpleScroll = ({ containerRef, leftImages, rightImages }) => {
  const canvasRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const maxScrollRef = useRef(0);
  const initialGapRef = useRef(0); // Store initial gap

  useEffect(() => {
    console.log(`Images received: Left=${leftImages.length}, Right=${rightImages.length}`);
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundColor: 0x000000,
      backgroundAlpha: 1, // Transparent to show underlying content
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    app.stage.addChild(leftContainer, rightContainer);

    // Set initial dimensions and gap
    const imageWidth = window.innerWidth * 0.42;
    const imageHeight = imageWidth * (4 / 3);
    initialGapRef.current = window.innerHeight * 0.05; // Fix gap based on initial viewport

    // Load images and create sprites
    const loader = new PIXI.Loader();
    const resourceMap = new Map();

    leftImages.forEach((src, i) => {
      const uniqueName = `left_${i}_${src}`;
      loader.add(uniqueName, src);
      resourceMap.set(uniqueName, src);
    });

    rightImages.forEach((src, i) => {
      const uniqueName = `right_${i}_${src}`;
      loader.add(uniqueName, src);
      resourceMap.set(uniqueName, src);
    });

    loader.onError.add((error, loader, resource) => {
      console.error(`PIXI Loader Error on resource: ${resource.url}`, error);
    });

    loader.load(() => {
      // Create sprites with fixed gap
      leftImages.forEach((src, i) => {
        const uniqueName = `left_${i}_${src}`;
        const sprite = PIXI.Sprite.from(loader.resources[uniqueName].texture);
        sprite.width = imageWidth;
        sprite.height = imageHeight;
        sprite.y = i * (imageHeight + initialGapRef.current);
        leftContainer.addChild(sprite);
      });

      rightImages.forEach((src, i) => {
        const uniqueName = `right_${i}_${src}`;
        const sprite = PIXI.Sprite.from(loader.resources[uniqueName].texture);
        sprite.width = imageWidth;
        sprite.height = imageHeight;
        sprite.y = i * (imageHeight + initialGapRef.current);
        rightContainer.addChild(sprite);
      });

      const positionContainers = () => {
        const screenWidth = window.innerWidth;
        leftContainer.x = screenWidth * 0.5 - imageWidth - screenWidth * 0.02;
        rightContainer.x = screenWidth * 0.5 + screenWidth * 0.02;
      };
      positionContainers();

      const calculateMaxScroll = () => {
        const leftColHeight = leftContainer.height;
        const rightColHeight = rightContainer.height;
        const calculatedMaxScroll = Math.max(leftColHeight, rightColHeight) - window.innerHeight;
        maxScrollRef.current = calculatedMaxScroll > 0 ? calculatedMaxScroll : 0;
      };
      calculateMaxScroll();

      console.log("--- Calculation Details ---");
      console.log(`Sprites created: Left=${leftContainer.children.length}, Right=${rightContainer.children.length}`);
      console.log(`Container heights: Left=${leftContainer.height.toFixed(2)}px, Right=${rightContainer.height.toFixed(2)}px`);
      console.log(`Window height: ${window.innerHeight.toFixed(2)}px`);
      console.log(`Initial gap: ${initialGapRef.current.toFixed(2)}px`);
      console.log(`Final maxScroll value: ${maxScrollRef.current.toFixed(2)}px`);
      console.log("---------------------------");

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
            end: () => `+=${maxScrollRef.current}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(rightContainer, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${maxScrollRef.current}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      }, containerRef);

      // Displacement filter
      const displacementSprite = PIXI.Sprite.from(
        "https://raw.githubusercontent.com/Pierrinho/elephant/master/pattern-clouds.jpg"
      );
      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      displacementSprite.scale.set(0.2);
      displacementSprite.alpha = 0;
      const displacementFilter = new DisplacementFilter(displacementSprite);
      displacementFilter.scale.set(10, 10);

      app.stage.addChild(displacementSprite);
      leftContainer.filters = [displacementFilter];
      rightContainer.filters = [displacementFilter];

      app.ticker.add(() => {
        displacementSprite.x += 0.2;
        displacementSprite.y += 0.2;
      });

      // Handle resize
      const handleResize = () => {
        const newImageWidth = window.innerWidth * 0.42;
        const newImageHeight = newImageWidth * (4 / 3);

        // Update sprite sizes but keep initial gap
        leftContainer.children.forEach((sprite, i) => {
          sprite.width = newImageWidth;
          sprite.height = newImageHeight;
          sprite.y = i * (newImageHeight + initialGapRef.current);
        });

        rightContainer.children.forEach((sprite, i) => {
          sprite.width = newImageWidth;
          sprite.height = newImageHeight;
          sprite.y = i * (newImageHeight + initialGapRef.current);
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
    });
  }, [containerRef, leftImages, rightImages]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[0] opacity-[1]"
    />
  );
};

export default SimpleScroll;