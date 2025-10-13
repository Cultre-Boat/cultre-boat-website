"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CombinedWaterAndImagesEffect({ leftImages, rightImages, scrollHeight }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // Assuming you have a scroll container ref
  const initialized = useRef(false);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const currentOffsetRef = useRef(0);
  const imageWidthRef = useRef(0);
  const imageHeightRef = useRef(0);
  const gapRef = useRef(0);
  const singleLeftHeightRef = useRef(0);
  const singleRightHeightRef = useRef(0);
  const initialRightRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current || initialized.current) return;
    initialized.current = true;

    // Initialize single PIXI application
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundColor: 0x1A1A1A,
      backgroundAlpha: 1,
      resolution: Math.max(1, window.devicePixelRatio || 1),
      autoDensity: true,
    });

    // Create containers
    const imagesContainer = new PIXI.Container(); // Wrapper for left/right images
    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    const smokeContainer = new PIXI.Container(); // For smoke overlay
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    imagesContainer.addChild(leftContainer, rightContainer);
    app.stage.addChild(imagesContainer, smokeContainer); // Images below, smoke above

    // Initialize image refs (same as PixiImage)
    imageWidthRef.current = window.innerWidth * 0.35;
    imageHeightRef.current = imageWidthRef.current * (4 / 3);
    gapRef.current = window.innerHeight * 0.1;
    singleLeftHeightRef.current = leftImages.length * (imageHeightRef.current + gapRef.current);
    singleRightHeightRef.current = rightImages.length * (imageHeightRef.current + gapRef.current);
    initialRightRef.current = -(singleRightHeightRef.current - window.innerHeight);

    // Create image sprites (same as PixiImage)
    leftImages.forEach((src) => {
      const sprite = PIXI.Sprite.from(src);
      sprite.width = imageWidthRef.current;
      sprite.height = imageHeightRef.current;
      leftContainer.addChild(sprite);
    });

    rightImages.forEach((src) => {
      const sprite = PIXI.Sprite.from(src);
      sprite.width = imageWidthRef.current;
      sprite.height = imageHeightRef.current;
      rightContainer.addChild(sprite);
    });

    // Position image containers (same as PixiImage)
    const positionContainers = () => {
      const screenWidth = window.innerWidth;
      leftContainer.x = screenWidth * 0.5 - imageWidthRef.current - screenWidth * 0.02;
      rightContainer.x = screenWidth * 0.5 + screenWidth * 0.02;
    };
    positionContainers();

    // Update image positions for infinite scrolling (same as PixiImage)
    const updatePositions = (offset) => {
      const leftLoopHeight = singleLeftHeightRef.current;
      leftContainer.children.forEach((sprite, i) => {
        const baseY = i * (imageHeightRef.current + gapRef.current);
        let y = baseY - (offset % leftLoopHeight);
        if (y < -imageHeightRef.current) y += leftLoopHeight;
        if (y > leftLoopHeight) y -= leftLoopHeight;
        sprite.y = y;
      });

      const rightLoopHeight = singleRightHeightRef.current;
      const initialRight = initialRightRef.current;
      rightContainer.children.forEach((sprite, i) => {
        const baseY = i * (imageHeightRef.current + gapRef.current);
        let y = baseY + (offset % rightLoopHeight) + initialRight;
        if (y < -imageHeightRef.current) y += rightLoopHeight;
        if (y > rightLoopHeight) y -= rightLoopHeight;
        sprite.y = y;
      });
    };
    updatePositions(0);

    // GSAP scroll animation for images (same as PixiImage)
    const dummy = { progress: 0 };
    const ctx = gsap.context(() => {
      gsap.to(dummy, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${scrollHeight}`,
          scrub: 2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const scrollPos = self.scroll();
            currentOffsetRef.current = (scrollPos % singleLeftHeightRef.current + singleLeftHeightRef.current) % singleLeftHeightRef.current;
            updatePositions(currentOffsetRef.current);
          },
        },
      });
    }, containerRef);

    // Smoke setup (from FullScreenScreenWaterEffect)
    const smokeTextureUrl = "/water14copy2.png";
    const fallbackSmokeTexture = "https://i.imgur.com/5jXz7Yv.png";
    const smokeSprite = PIXI.Sprite.from(smokeTextureUrl);
    smokeSprite.texture.baseTexture.on("error", () => {
      smokeSprite.texture = PIXI.Texture.from(fallbackSmokeTexture);
    });
    smokeSprite.width = window.innerWidth * 2;
    smokeSprite.height = window.innerHeight * 2;
    smokeSprite.alpha = 0.4;
    smokeSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    smokeContainer.addChild(smokeSprite);

    const colorMatrix = new PIXI.filters.ColorMatrixFilter();
    smokeSprite.filters = [colorMatrix];
    colorMatrix.contrast(0.5, false);

    // Shared displacement setup (from FullScreenScreenWaterEffect, but shared)
    const displacementMapUrl = "/water7.jpg"; // Or use smokeTextureUrl for stronger link to smoke pattern
    const fallbackDisplacementMap = "https://i.imgur.com/3PTiU4U.jpg";
    const displacementSprite = PIXI.Sprite.from(displacementMapUrl);
    displacementSprite.texture.baseTexture.on("error", () => {
      displacementSprite.texture = PIXI.Texture.from(fallbackDisplacementMap);
    });
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.1);
    displacementSprite.alpha = 0; // Invisible
    displacementSprite.width = window.innerWidth * 2;
    displacementSprite.height = window.innerHeight * 2;

    const displacementColorMatrix = new PIXI.filters.ColorMatrixFilter();
    displacementSprite.filters = [displacementColorMatrix];
    displacementColorMatrix.contrast(1.2, false);

    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(10, 10); // Adjust for desired distortion strength on images

    app.stage.addChild(displacementSprite); // Add to stage for global positioning

    // Apply filter to both smoke and images for synced waving/distortion
    smokeContainer.filters = [displacementFilter];
    imagesContainer.filters = [displacementFilter]; // This distorts images when wave passes

    // Animate (from FullScreenScreenWaterEffect, adjusted for bottom-right to top-left wave)
    app.ticker.add(() => {
      // Move displacement for waving (positive x/y for bottom-right start, moving top-left)
      displacementSprite.x -= 2; // Move left
      displacementSprite.y -= 1.5; // Move up

      // Move smoke in sync
      smokeSprite.x -= 1; // Move left
      smokeSprite.y -= 0.5; // Move up

      // Reset for seamless looping
      if (displacementSprite.x < -window.innerWidth) displacementSprite.x += window.innerWidth;
      if (displacementSprite.y < -window.innerHeight) displacementSprite.y += window.innerHeight;
      if (smokeSprite.x < -window.innerWidth) smokeSprite.x += window.innerWidth;
      if (smokeSprite.y < -window.innerHeight) smokeSprite.y += window.innerHeight;
    });

    // Handle resize (combined from both)
    const handleResize = () => {
      imageWidthRef.current = window.innerWidth * 0.35;
      imageHeightRef.current = imageWidthRef.current * (4 / 3);
      gapRef.current = window.innerHeight * 0.3;
      singleLeftHeightRef.current = leftImages.length * (imageHeightRef.current + gapRef.current);
      singleRightHeightRef.current = rightImages.length * (imageHeightRef.current + gapRef.current);
      initialRightRef.current = -(singleRightHeightRef.current - window.innerHeight);

      leftContainer.children.forEach((sprite) => {
        sprite.width = imageWidthRef.current;
        sprite.height = imageHeightRef.current;
      });
      rightContainer.children.forEach((sprite) => {
        sprite.width = imageWidthRef.current;
        sprite.height = imageHeightRef.current;
      });

      smokeSprite.width = window.innerWidth * 2;
      smokeSprite.height = window.innerHeight * 2;
      displacementSprite.width = window.innerWidth * 2;
      displacementSprite.height = window.innerHeight * 2;

      positionContainers();
      updatePositions(currentOffsetRef.current);
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      initialized.current = false;
    };
  }, [containerRef, leftImages, rightImages, scrollHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none"
    />
  );
}