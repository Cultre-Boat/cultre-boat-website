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

    // Initialize PIXI application with MAXIMUM quality settings
    const dpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth < 768;
    
    // Use FULL device resolution for pixel-perfect rendering (3.5 DPR)
    const resolution = dpr; // No capping - use actual device resolution!
    
    console.log('✓ Using full resolution:', resolution, 'x DPR');
    
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x2a4862,
      backgroundAlpha: 1,
      resolution: resolution, // FULL device resolution for maximum quality
      autoDensity: true,
      antialias: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
      preserveDrawingBuffer: false,
    });
    
    // Disable texture quality degradation
    PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF; // Disable mipmaps (they blur images!)
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.ROUND_PIXELS = false; // Allow subpixel rendering

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

    // NO external textures loaded for water effect - using procedural generation only!

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
        
        // Apply maximum quality texture settings
        texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF; // No mipmaps!
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR; // Smooth scaling
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP; // No edge artifacts
        
        // Keep original texture size, let PIXI scale naturally
        const originalWidth = texture.baseTexture.width;
        const originalHeight = texture.baseTexture.height;
        const aspectRatio = originalHeight / originalWidth;
        
        sprite.width = imageWidthRef.current;
        sprite.height = imageWidthRef.current * aspectRatio;
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
        
        // Apply maximum quality texture settings
        texture.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF; // No mipmaps!
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR; // Smooth scaling
        texture.baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP; // No edge artifacts
        
        // Keep original texture size, let PIXI scale naturally
        const originalWidth = texture.baseTexture.width;
        const originalHeight = texture.baseTexture.height;
        const aspectRatio = originalHeight / originalWidth;
        
        sprite.width = imageWidthRef.current;
        sprite.height = imageWidthRef.current * aspectRatio;
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

      // ========== LIGHTWEIGHT PROCEDURAL WATER EFFECT ==========
      // NO external images loaded - pure procedural generation!
      const isMobile = window.innerWidth < 768;
      let displacementSprite = null;
      let displacementFilter = null;

      try {
        // Create procedural displacement texture (works on all devices)
        const canvas = document.createElement('canvas');
        const size = isMobile ? 256 : 512; // Larger for desktop quality
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Generate organic water-like noise pattern using Perlin-style noise
        const imageData = ctx.createImageData(size, size);
        
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            
            // Multi-octave noise for natural water look
            const freq1 = 0.05;
            const freq2 = 0.1;
            const noise1 = Math.sin(x * freq1 + y * freq1) * 127 + 128;
            const noise2 = Math.cos(x * freq2 - y * freq2) * 64 + 128;
            const combined = (noise1 + noise2) / 2;
            
            imageData.data[i] = combined;     // R
            imageData.data[i + 1] = combined; // G  
            imageData.data[i + 2] = combined; // B
            imageData.data[i + 3] = 255;      // A
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Blur for smoother water effect
        ctx.filter = 'blur(4px)';
        ctx.drawImage(canvas, 0, 0);
        
        const dispTexture = PIXI.Texture.from(canvas);
        console.log(`✓ Generated procedural displacement (${size}x${size}) - zero image loading!`);
        
        if (dispTexture) {
          displacementSprite = new PIXI.Sprite(dispTexture);
          displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
          displacementSprite.scale.set(0.5);
          displacementSprite.alpha = 0; // Invisible, just for displacement
          app.stage.addChild(displacementSprite);

          // Create displacement filter with device-appropriate settings
          displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
          
          if (isMobile) {
            // Very subtle effect on mobile to preserve image quality
            displacementFilter.scale.set(2, 2);
          } else {
            // Stronger on desktop
            displacementFilter.scale.set(6, 6);
          }
          
          displacementFilter.padding = 20; // More padding to avoid edge artifacts

          // Apply water effect to image containers
          leftContainer.filters = [displacementFilter];
          rightContainer.filters = [displacementFilter];

          console.log('✓ Water effect active:', isMobile ? 'mobile (3x3)' : 'desktop (6x6)');
        }
      } catch (error) {
        console.warn('Water effect initialization failed:', error);
      }

      // Animate displacement for water movement
      if (displacementSprite) {
        const waterSpeed = isMobile ? 0.15 : 0.3; // Slower on mobile
        app.ticker.add(() => {
          if (displacementSprite && !displacementSprite.destroyed) {
            displacementSprite.x += waterSpeed;
            displacementSprite.y += waterSpeed * 0.8;
          }
        });
      }

      // Limit FPS on mobile for battery life
      app.ticker.maxFPS = isMobile ? 30 : 60;

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

  positionContainers();
  updatePositions(currentOffsetRef.current);

  /* ---- resize with optimized DPR ---- */
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;

  app.renderer.resize(cssW, cssH);   // Resolution is handled by autoDensity
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