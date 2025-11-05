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

    // Initialize PIXI application with maximum quality settings
    const dpr = window.devicePixelRatio || 1;
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x2a4862,
      backgroundAlpha: 1,
      resolution: Math.min(dpr, 2), // Cap at 2x for performance, but maintain quality
      autoDensity: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
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

    // Set initial dimensions and gap - render at native resolution
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      // Use 46% of screen width for images with better gap
      const maxImageWidth = Math.min(screenWidth * 0.46, (screenWidth - 20) / 2);
      imageWidthRef.current = Math.max(140, maxImageWidth);
      imageHeightRef.current = imageWidthRef.current * (4 / 3); // Maintain 4:3 aspect ratio
      gapRef.current = Math.max(15, screenWidth * 0.025); // Better gap spacing
      singleLeftHeightRef.current = leftImages.length * (imageHeightRef.current + gapRef.current);
      singleRightHeightRef.current = rightImages.length * (imageHeightRef.current + gapRef.current);
      initialRightRef.current = -(singleRightHeightRef.current - screenHeight);
      console.log('Image Width:', imageWidthRef.current, 'Image Height:', imageHeightRef.current, 'Gap:', gapRef.current);
    };
    calculateDimensions();

    // Load ALL images at once for instant display
    const loader = new PIXI.Loader();
    const resourceMap = new Map();

    // Add all images to loader
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

      // Create sprites with NEAREST neighbor for pixel-perfect rendering
      leftImages.forEach((src, i) => {
        const uniqueName = `left_${i}_${src}`;
        const texture = resources[uniqueName]?.texture;
        if (!texture || !texture.valid) {
          console.error(`Skipping left image ${i}: Texture not loaded for ${src}`);
          return;
        }
        const sprite = PIXI.Sprite.from(texture);
        
        // Keep original texture size, let PIXI scale naturally
        const originalWidth = texture.baseTexture.width;
        const originalHeight = texture.baseTexture.height;
        const aspectRatio = originalHeight / originalWidth;
        
        sprite.width = imageWidthRef.current;
        sprite.height = imageWidthRef.current * aspectRatio;
        
        // Use NEAREST for no interpolation (sharper on mobile)
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        sprite.roundPixels = true;
        sprite.anchor.set(0);
        leftContainer.addChild(sprite);
        console.log(`Left ${i}: ${originalWidth}x${originalHeight} -> ${sprite.width}x${sprite.height}`);
      });

      rightImages.forEach((src, i) => {
        const uniqueName = `right_${i}_${src}`;
        const texture = resources[uniqueName]?.texture;
        if (!texture || !texture.valid) {
          console.error(`Skipping right image ${i}: Texture not loaded for ${src}`);
          return;
        }
        const sprite = PIXI.Sprite.from(texture);
        
        // Keep original texture size, let PIXI scale naturally
        const originalWidth = texture.baseTexture.width;
        const originalHeight = texture.baseTexture.height;
        const aspectRatio = originalHeight / originalWidth;
        
        sprite.width = imageWidthRef.current;
        sprite.height = imageWidthRef.current * aspectRatio;
        
        // Use NEAREST for no interpolation (sharper on mobile)
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        sprite.roundPixels = true;
        sprite.anchor.set(0);
        rightContainer.addChild(sprite);
        console.log(`Right ${i}: ${originalWidth}x${originalHeight} -> ${sprite.width}x${sprite.height}`);
      });
      
      // Recalculate heights based on actual sprite dimensions after they're created
      let actualLeftHeight = 0;
      leftContainer.children.forEach((sprite) => {
        actualLeftHeight += sprite.height + gapRef.current;
      });
      
      let actualRightHeight = 0;
      rightContainer.children.forEach((sprite) => {
        actualRightHeight += sprite.height + gapRef.current;
      });
      
      singleLeftHeightRef.current = actualLeftHeight;
      singleRightHeightRef.current = actualRightHeight;
      initialRightRef.current = -(actualRightHeight - window.innerHeight);
      
      console.log('Actual Heights - Left:', actualLeftHeight, 'Right:', actualRightHeight, 'Initial Right Y:', initialRightRef.current);

      const positionContainers = () => {
        const screenWidth = window.innerWidth;
        
        // Center the two columns on screen
        const totalWidth = imageWidthRef.current * 2 + gapRef.current;
        const startX = (screenWidth - totalWidth) / 2;
        
        leftContainer.x = startX;
        rightContainer.x = startX + imageWidthRef.current + gapRef.current;
        
        console.log('Screen:', screenWidth, 'Image Width:', imageWidthRef.current, 'Gap:', gapRef.current, 'Left X:', leftContainer.x, 'Right X:', rightContainer.x);
      };
      
      // Position containers AFTER heights are calculated
      positionContainers();

      const updatePositions = (offset) => {
        const leftLoopHeight = singleLeftHeightRef.current;
        leftContainer.children.forEach((sprite, i) => {
          const spriteHeight = sprite.height;
          const baseY = i * (spriteHeight + gapRef.current);
          let y = baseY - (offset % leftLoopHeight);
          if (y < -spriteHeight) y += leftLoopHeight;
          if (y > leftLoopHeight) y -= leftLoopHeight;
          sprite.y = y;
        });

        const rightLoopHeight = singleRightHeightRef.current;
        const initialRight = initialRightRef.current;
        rightContainer.children.forEach((sprite, i) => {
          const spriteHeight = sprite.height;
          const baseY = i * (spriteHeight + gapRef.current);
          let y = baseY + (offset % rightLoopHeight) + initialRight;
          if (y < -spriteHeight) y += rightLoopHeight;
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

      // Water effect disabled on mobile for crisp images
      console.log('Water effect disabled on mobile - clean image rendering');

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
  // Water effect removed for mobile

  positionContainers();
  updatePositions(currentOffsetRef.current);

  /* ---- resize with capped DPR for quality/performance balance ---- */
  const dpr  = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;

  app.renderer.resize(cssW, cssH);   // Use CSS dimensions, resolution is already set in app config
  app.renderer.view.style.width  = cssW + 'px';
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