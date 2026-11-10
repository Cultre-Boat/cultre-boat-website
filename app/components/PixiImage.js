"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Space between images (both between stacked images and between the two columns),
// as a fraction of viewport height.
const GAP_RATIO = 0.015;
// Column width as a fraction of viewport width.
const COLUMN_WIDTH_RATIO = 0.31;
// Height/width used for an image whose texture hasn't loaded yet (most images are 2:3).
const PLACEHOLDER_ASPECT = 1.5;

// Scales a sprite to the column width, keeping its own aspect ratio (no crop, no stretch,
// no empty space around it). Must wait for the texture to load, otherwise the size is read
// from a 1px placeholder and the image blows up.
function fitSpriteToWidth(sprite, width) {
  const { texture } = sprite;
  if (!texture.baseTexture.valid) return;
  sprite.scale.set(width / texture.width);
  sprite.x = 0;
}

// Height a sprite takes up in its column (uses a placeholder until the texture loads).
function spriteHeight(sprite, width) {
  return sprite.texture.baseTexture.valid ? sprite.height : width * PLACEHOLDER_ASPECT;
}

export default function CombinedWaterAndImagesEffect({ containerRef, leftImages, rightImages, scrollHeight }) {
  const hostRef = useRef(null);
  const initialized = useRef(false);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const currentOffsetRef = useRef(0);
  const imageWidthRef = useRef(0);
  const gapRef = useRef(0);
  const singleLeftHeightRef = useRef(0);
  const singleRightHeightRef = useRef(0);
  const initialRightRef = useRef(0);

  useEffect(() => {
    if (!hostRef.current || initialized.current) return;
    initialized.current = true;

    // Pixi creates its own canvas each mount. Re-using one canvas breaks after a remount
    // (React Strict Mode in dev), because destroying the app loses that canvas's WebGL context.
    let app;
    try {
      app = new PIXI.Application({
      resizeTo: window,
      backgroundColor: 0x2a4862,
      backgroundAlpha: 1,
      resolution: Math.max(1, window.devicePixelRatio || 1),
      autoDensity: true,
      });
    } catch (error) {
      console.error("Homepage WebGL effect could not start:", error);
      initialized.current = false;
      return;
    }
    app.view.style.display = "block";
    hostRef.current.appendChild(app.view);

    // Create containers
    const imagesContainer = new PIXI.Container(); // Wrapper for left/right images
    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    const smokeContainer = new PIXI.Container(); // For smoke overlay
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    imagesContainer.addChild(leftContainer, rightContainer);
    app.stage.addChild(imagesContainer, smokeContainer); // Images below, smoke above

    // Column sizes
    const calculateDimensions = () => {
      imageWidthRef.current = window.innerWidth * COLUMN_WIDTH_RATIO;
      gapRef.current = window.innerHeight * GAP_RATIO;
    };
    calculateDimensions();

    // Total height of one column (images have different heights, so add them up)
    const measureColumn = (container) =>
      container.children.reduce(
        (sum, sprite) => sum + spriteHeight(sprite, imageWidthRef.current) + gapRef.current,
        0
      );

    const measureColumns = () => {
      singleLeftHeightRef.current = measureColumn(leftContainer);
      singleRightHeightRef.current = measureColumn(rightContainer);
      initialRightRef.current = -(singleRightHeightRef.current - window.innerHeight);
    };

    // Two columns centred on screen, with the same gap between them as between images
    const positionContainers = () => {
      const center = window.innerWidth / 2;
      leftContainer.x = center - imageWidthRef.current - gapRef.current / 2;
      rightContainer.x = center + gapRef.current / 2;
    };

    // Update image positions for infinite scrolling. Each image starts where the previous one ends.
    const layoutColumn = (container, loopHeight, shift) => {
      let baseY = 0;
      container.children.forEach((sprite) => {
        const h = spriteHeight(sprite, imageWidthRef.current);
        let y = baseY + shift;
        if (y < -h) y += loopHeight;
        if (y > loopHeight) y -= loopHeight;
        sprite.y = y;
        baseY += h + gapRef.current;
      });
    };

    const updatePositions = (offset) => {
      const leftLoopHeight = singleLeftHeightRef.current;
      const rightLoopHeight = singleRightHeightRef.current;
      layoutColumn(leftContainer, leftLoopHeight, -(offset % leftLoopHeight));
      layoutColumn(rightContainer, rightLoopHeight, (offset % rightLoopHeight) + initialRightRef.current);
    };

    // Create image sprites; re-fit and re-measure the columns as each texture loads
    const fitAll = () =>
      [...leftContainer.children, ...rightContainer.children].forEach((sprite) =>
        fitSpriteToWidth(sprite, imageWidthRef.current)
      );

    const addImageSprite = (container, src) => {
      const sprite = PIXI.Sprite.from(src);
      container.addChild(sprite);
      const onLoaded = () => {
        if (sprite.destroyed) return;
        fitSpriteToWidth(sprite, imageWidthRef.current);
        measureColumns();
        updatePositions(currentOffsetRef.current);
      };
      if (sprite.texture.baseTexture.valid) fitSpriteToWidth(sprite, imageWidthRef.current);
      else sprite.texture.baseTexture.once("loaded", onLoaded);
    };

    leftImages.forEach((src) => addImageSprite(leftContainer, src));
    rightImages.forEach((src) => addImageSprite(rightContainer, src));

    measureColumns();
    positionContainers();
    updatePositions(0);

    // GSAP scroll animation for images (same as PixiImage)
    const dummy = { progress: 0 };
    const ctx = gsap.context(() => {
      gsap.to(dummy, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef?.current,
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
    }, containerRef?.current || undefined);

    // Smoke setup (from FullScreenScreenWaterEffect)
    const smokeTextureUrl = "/water14copy2.png";
    const fallbackSmokeTexture = "https://i.imgur.com/5jXz7Yv.png";
    const smokeSprite = PIXI.Sprite.from(smokeTextureUrl);
    smokeSprite.texture.baseTexture.on("error", () => {
      smokeSprite.texture = PIXI.Texture.from(fallbackSmokeTexture);
    });
    smokeSprite.width = window.innerWidth * 0.1;
    smokeSprite.height = window.innerHeight * 0.1;
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
    displacementFilter.scale.set(8, 8); // Adjust for desired distortion strength on images

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
      calculateDimensions();
      fitAll();
      measureColumns();

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
    <div
      ref={hostRef}
      className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none"
    />
  );
}