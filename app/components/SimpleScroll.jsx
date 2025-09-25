"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DisplacementFilter } from "@pixi/filter-displacement";

gsap.registerPlugin(ScrollTrigger);

// 1. REMOVE the `maxScroll` and `onMaxScrollCalculated` props.
const SimpleScroll = ({ containerRef, leftImages, rightImages }) => {
  
  const canvasRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  
  // 2. ADD a ref to store the maxScroll value internally.
  const maxScrollRef = useRef(0);

  // Remove maxScroll and onMaxScrollCalculated from the dependency array.
  useEffect(() => {
     console.log(`Images received: Left=${leftImages.length}, Right=${rightImages.length}`);
    if (!canvasRef.current || !containerRef.current) return;

    // ... (PIXI application setup remains the same)
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundColor: 0x000000,
      backgroundAlpha: 1,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    app.stage.addChild(leftContainer, rightContainer);

    const imageWidth = window.innerWidth * 0.45;
    const imageHeight = imageWidth * (4 / 3);
    const gap = window.innerHeight * 0.10;

    // ... (Loader logic remains the same)
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
      // ... (Sprite creation remains the same)
      leftImages.forEach((src, i) => {
        const uniqueName = `left_${i}_${src}`;
        const sprite = PIXI.Sprite.from(loader.resources[uniqueName].texture);
        sprite.width = imageWidth;
        sprite.height = imageHeight;
        sprite.y = i * (imageHeight + gap);
        leftContainer.addChild(sprite);
      });

      rightImages.forEach((src, i) => {
        const uniqueName = `right_${i}_${src}`;
        const sprite = PIXI.Sprite.from(loader.resources[uniqueName].texture);
        sprite.width = imageWidth;
        sprite.height = imageHeight;
        sprite.y = i * (imageHeight + gap);
        rightContainer.addChild(sprite);
      });

      const positionContainers = () => {
        const screenWidth = window.innerWidth;
        leftContainer.x = screenWidth * 0.5 - imageWidth - screenWidth * 0.02;
        rightContainer.x = screenWidth * 0.5 + screenWidth * 0.02;
      };
      positionContainers();

      // MODIFIED: This function now updates the ref instead of calling a prop.
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
      console.log(`Final maxScroll value: ${maxScrollRef.current.toFixed(2)}px`);
      console.log("---------------------------");



      gsap.set(leftContainer, { y: 0 });
      gsap.set(rightContainer, { y: -rightContainer.height + window.innerHeight });

      const ctx = gsap.context(() => {
        gsap.to(leftContainer, {
          y: -leftContainer.height + window.innerHeight,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            // 3. CHANGE `end` to a function that reads the ref's current value.
            // This makes it dynamic and always correct on creation and resize.
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
            // 3. CHANGE `end` here as well.
            end: () => `+=${maxScrollRef.current}`,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });
      }, containerRef);

      // ... (Displacement filter logic remains the same)
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
        displacementSprite.x += 0.3;
        displacementSprite.y += 0.3 ;
      });

      // Handle resize
      const handleResize = () => {
        const newImageWidth = window.innerWidth * 0.45;
        const newImageHeight = newImageWidth * (4 / 3);
        const newGap = window.innerHeight * 0.15;

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
        // Recalculate and update the ref on resize. GSAP will pick up the new
        // value automatically because of `invalidateOnRefresh: true` and the function in `end`.
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
    // MODIFIED: Clean up the dependency array.
  }, [containerRef, leftImages, rightImages]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[0] opacity-[0.7]"
    />
  );
};

export default SimpleScroll;