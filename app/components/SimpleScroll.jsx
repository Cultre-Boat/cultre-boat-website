"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SimpleScroll = ({
  containerRef,
  leftImages,
  rightImages,
  scrollHeight,
  
}) => {
  const canvasRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const currentOffsetRef = useRef(0);
  const imageWidthRef = useRef(0);
  const imageHeightRef = useRef(0);
  const gapRef = useRef(0);
  const singleLeftHeightRef = useRef(0);
  const singleRightHeightRef = useRef(0);
  const initialRightRef = useRef(0);
  const initialized = useRef(false);
  const texturesLoaded = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || initialized.current || typeof window === 'undefined') return;
    initialized.current = true;

    console.log('Device Pixel Ratio:', window.devicePixelRatio);
    console.log('Screen Size:', window.innerWidth, 'x', window.innerHeight);

    // Initialize PIXI application with optimized settings for mobile
    const app = new PIXI.Application({
      view: canvasRef.current,
      resizeTo: window,
      backgroundColor: 0x2a2a2a,
      backgroundAlpha: 1,
      resolution: Math.max(1, window.devicePixelRatio || 1), // Ensures sharp rendering on high-DPI screens
      autoDensity: true,
      antialias: true,
      powerPreference: 'high-performance', // Better performance on mobile
      preserveDrawingBuffer: false, // Better memory management
    });

    // Create containers
    const imagesContainer = new PIXI.Container();
    const leftContainer = new PIXI.Container();
    const rightContainer = new PIXI.Container();
    const smokeContainer = new PIXI.Container();
    leftContainerRef.current = leftContainer;
    rightContainerRef.current = rightContainer;
    imagesContainer.addChild(leftContainer, rightContainer);
    app.stage.addChild(imagesContainer, smokeContainer);

    // Set initial dimensions and gap
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      // Use 48% of screen width for images to ensure better quality on high-DPI screens
      const maxImageWidth = Math.min(screenWidth * 0.48, (screenWidth - 10) / 2);
      imageWidthRef.current = Math.max(150, maxImageWidth); // Increased min width for better quality
      imageHeightRef.current = imageWidthRef.current * (4 / 3); // Maintain 4:3 aspect ratio
      gapRef.current = Math.max(10, screenWidth * 0.015); // Optimized gap
      singleLeftHeightRef.current = leftImages.length * (imageHeightRef.current + gapRef.current);
      singleRightHeightRef.current = rightImages.length * (imageHeightRef.current + gapRef.current);
      initialRightRef.current = -(singleRightHeightRef.current - window.innerHeight);
      console.log('DPR:', dpr, 'Image Width:', imageWidthRef.current, 'Image Height:', imageHeightRef.current);
    };
    calculateDimensions();

    // Load images with progressive loading for better mobile performance
    const loader = new PIXI.Loader();
    const resourceMap = new Map();

    // Load priority images first (first 4 of each side)
    const priorityLeftImages = leftImages.slice(0, 4);
    const priorityRightImages = rightImages.slice(0, 4);
    const remainingLeftImages = leftImages.slice(4);
    const remainingRightImages = rightImages.slice(4);

    // Add priority images
    priorityLeftImages.forEach((src, i) => {
      const uniqueName = `left_${i}_${src}`;
      loader.add(uniqueName, src);
      resourceMap.set(uniqueName, src);
    });

    priorityRightImages.forEach((src, i) => {
      const uniqueName = `right_${i}_${src}`;
      loader.add(uniqueName, src);
      resourceMap.set(uniqueName, src);
    });

    const smokeTextureUrl = "/water14.png";
    const fallbackSmokeTexture = "https://i.imgur.com/5jXz7Yv.png";
    loader.add("smokeTexture", smokeTextureUrl);
    loader.add("fallbackSmokeTexture", fallbackSmokeTexture);

    const displacementMapUrl = "/water7.png";
    const fallbackDisplacementMap = "https://i.imgur.com/3PTiU4U.jpg";
    loader.add("displacementMap", displacementMapUrl);
    loader.add("fallbackDisplacementMap", fallbackDisplacementMap);

    loader.onError.add((error, loader, resource) => {
      console.error(`PIXI Loader Error on resource: ${resource.url}`, error);
    });

    loader.load((loader, resources) => {
      texturesLoaded.current = true;

      // Log loaded resources
      Object.keys(resources).forEach((key) => {
        const resource = resources[key];
        if (resource.error) {
          console.error(`Failed to load texture: ${resource.url}`, resource.error);
        } else {
          console.log(`Loaded texture: ${resource.url}, size: ${resource.texture?.width}x${resource.texture?.height}`);
        }
      });

      // Load remaining images progressively after priority images are loaded
      const loadRemainingImages = () => {
        const remainingLoader = new PIXI.Loader();
        
        remainingLeftImages.forEach((src, i) => {
          const uniqueName = `left_${i + 4}_${src}`;
          remainingLoader.add(uniqueName, src);
          resourceMap.set(uniqueName, src);
        });

        remainingRightImages.forEach((src, i) => {
          const uniqueName = `right_${i + 4}_${src}`;
          remainingLoader.add(uniqueName, src);
          resourceMap.set(uniqueName, src);
        });

        remainingLoader.load((loader, remainingResources) => {
          console.log('Remaining images loaded');
          // Add remaining images to containers
          remainingLeftImages.forEach((src, i) => {
            const uniqueName = `left_${i + 4}_${src}`;
            const texture = remainingResources[uniqueName]?.texture;
            if (!texture || !texture.valid) return;
            
            const sprite = PIXI.Sprite.from(texture);
            sprite.width = imageWidthRef.current;
            sprite.height = imageHeightRef.current;
            sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            sprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
            sprite.roundPixels = true;
            sprite.anchor.set(0);
            leftContainer.addChild(sprite);
          });

          remainingRightImages.forEach((src, i) => {
            const uniqueName = `right_${i + 4}_${src}`;
            const texture = remainingResources[uniqueName]?.texture;
            if (!texture || !texture.valid) return;
            
            const sprite = PIXI.Sprite.from(texture);
            sprite.width = imageWidthRef.current;
            sprite.height = imageHeightRef.current;
            sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            sprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
            sprite.roundPixels = true;
            sprite.anchor.set(0);
            rightContainer.addChild(sprite);
          });

          // Recalculate dimensions after all images are loaded
          calculateDimensions();
          positionContainers();
          updatePositions(currentOffsetRef.current);
        });
      };

      // Load remaining images after a short delay
      setTimeout(loadRemainingImages, 500);

      // Create sprites with optimized quality settings (only for priority images)
      priorityLeftImages.forEach((src, i) => {
        const uniqueName = `left_${i}_${src}`;
        const texture = resources[uniqueName]?.texture;
        if (!texture || !texture.valid) {
          console.error(`Skipping left image ${i}: Texture not loaded for ${src}`);
          return;
        }
        const sprite = PIXI.Sprite.from(texture);
        sprite.width = imageWidthRef.current;
        sprite.height = imageHeightRef.current;
        // High-quality rendering settings for mobile
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        sprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        sprite.roundPixels = true; // Prevents sub-pixel rendering artifacts
        sprite.anchor.set(0); // Ensure proper positioning
        leftContainer.addChild(sprite);
        console.log(`Left Image ${i}: original texture = ${sprite.texture.baseTexture.width}x${sprite.texture.baseTexture.height}, rendered = ${sprite.width}x${sprite.height}`);
      });

      priorityRightImages.forEach((src, i) => {
        const uniqueName = `right_${i}_${src}`;
        const texture = resources[uniqueName]?.texture;
        if (!texture || !texture.valid) {
          console.error(`Skipping right image ${i}: Texture not loaded for ${src}`);
          return;
        }
        const sprite = PIXI.Sprite.from(texture);
        sprite.width = imageWidthRef.current;
        sprite.height = imageHeightRef.current;
        // High-quality rendering settings for mobile
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        sprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        sprite.roundPixels = true; // Prevents sub-pixel rendering artifacts
        sprite.anchor.set(0); // Ensure proper positioning
        rightContainer.addChild(sprite);
        console.log(`Right Image ${i}: original texture = ${sprite.texture.baseTexture.width}x${sprite.texture.baseTexture.height}, rendered = ${sprite.width}x${sprite.height}`);
      });

      const positionContainers = () => {
        const screenWidth = window.innerWidth;
        calculateDimensions(); // Recalculate dimensions for accurate positioning
        leftContainer.x = 0; // Start at left edge
        rightContainer.x = imageWidthRef.current + gapRef.current; // Position right container with dynamic gap
        console.log('Image Width:', imageWidthRef.current, 'Left X:', leftContainer.x, 'Right X:', rightContainer.x, 'Screen Width:', screenWidth, 'Gap:', gapRef.current);
      };
      positionContainers();

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

      const dummy = { progress: 0 };
      const ctx = gsap.context(() => {
        gsap.to(dummy, {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollHeight}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const scrollPos = self.scroll();
              currentOffsetRef.current = ((scrollPos % singleLeftHeightRef.current) + singleLeftHeightRef.current) % singleLeftHeightRef.current;
              updatePositions(currentOffsetRef.current);
            },
          },
        });
      }, containerRef);

      let smokeSprite = null;
      let displacementSprite = null;

      const smokeTexture = resources.smokeTexture?.texture || resources.fallbackSmokeTexture?.texture;
      if (!smokeTexture || !smokeTexture.valid) {
        console.error(`Smoke texture not loaded, skipping smoke sprite`);
      } else {
        smokeSprite = PIXI.Sprite.from(smokeTexture);
        smokeSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        smokeSprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        // Reduced smoke size for better mobile performance (2x instead of 4x)
        smokeSprite.width = window.innerWidth * 2;
        smokeSprite.height = window.innerHeight * 2;
        smokeSprite.alpha = 0.35; // Slightly reduced for better performance
        smokeSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        smokeContainer.addChild(smokeSprite);

        const colorMatrix = new PIXI.filters.ColorMatrixFilter();
        smokeSprite.filters = [colorMatrix];
      }

      const displacementTexture = resources.displacementMap?.texture || resources.fallbackDisplacementMap?.texture;
      if (!displacementTexture || !displacementTexture.valid) {
        console.error(`Displacement texture not loaded, skipping displacement filter`);
      } else {
        displacementSprite = PIXI.Sprite.from(displacementTexture);
        displacementSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        displacementSprite.texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.ON;
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        displacementSprite.scale.set(0.4);
        displacementSprite.alpha = 0; // Invisible, only used for displacement
        displacementSprite.width = window.innerWidth;
        displacementSprite.height = window.innerHeight;

        const displacementColorMatrix = new PIXI.filters.ColorMatrixFilter();
        displacementSprite.filters = [displacementColorMatrix];

        // Reduced displacement intensity for better mobile performance
        const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
        const isMobile = window.innerWidth < 768;
        displacementFilter.scale.set(isMobile ? 4 : 8, isMobile ? 4 : 8);

        app.stage.addChild(displacementSprite);
        smokeContainer.filters = [displacementFilter];
        imagesContainer.filters = [displacementFilter];
      }

      // Optimized animation loop for better mobile performance
      app.ticker.add(() => {
        if (texturesLoaded.current && smokeSprite && displacementSprite) {
          // Slightly slower animation for better performance and quality on mobile
          displacementSprite.x -= 0.4;
          displacementSprite.y -= 0.4;
          smokeSprite.x -= 0.4;
          smokeSprite.y -= 0.2;
          if (displacementSprite.x < -window.innerWidth) displacementSprite.x += window.innerWidth;
          if (displacementSprite.y < -window.innerHeight) displacementSprite.y += window.innerHeight;
          if (smokeSprite.x < -window.innerWidth) smokeSprite.x += window.innerWidth;
          if (smokeSprite.y < -window.innerHeight) smokeSprite.y += window.innerHeight;
        }
      });

      const handleResize = () => {
  if (typeof window === 'undefined') return;

  calculateDimensions();

  /* update your sprites */
  leftContainer.children.forEach(s => {
    s.width  = imageWidthRef.current;
    s.height = imageHeightRef.current;
  });
  rightContainer.children.forEach(s => {
    s.width  = imageWidthRef.current;
    s.height = imageHeightRef.current;
  });
  if (smokeSprite) {
    // Reduced smoke size for better performance (2x instead of 4x)
    smokeSprite.width  = window.innerWidth  * 2;
    smokeSprite.height = window.innerHeight * 2;
  }
  if (displacementSprite) {
    displacementSprite.width  = window.innerWidth;
    displacementSprite.height = window.innerHeight;
  }

  positionContainers();
  updatePositions(currentOffsetRef.current);

  /* ---- single, correct hi-res resize ---- */
  const dpr  = Math.max(1, window.devicePixelRatio || 1);
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;

  app.renderer.resize(cssW * dpr, cssH * dpr);   // back-buffer in real pixels
  app.renderer.view.style.width  = cssW + 'px';  // CSS size stays viewport
  app.renderer.view.style.height = cssH + 'px';
};

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        ctx.revert();
        app.destroy(true, { children: true, texture: true, baseTexture: true });
        initialized.current = false;
        texturesLoaded.current = false;
      };
    });
  }, [containerRef, leftImages, rightImages, scrollHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[0]"
      style={{ display: 'block' }}
    />
  );
};

export default SimpleScroll;