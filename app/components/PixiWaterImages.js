"use client";

import { useLayoutEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixiWaterImages({ containerRef }) {
  const pixiContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (!pixiContainerRef.current) {
      console.warn('[PixiWaterImages] pixiContainerRef not ready');
      return;
    }
    if (!containerRef || !containerRef.current) {
      console.warn('[PixiWaterImages] containerRef not ready');
      return;
    }
    
    let destroyed = false;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    console.log('[PixiWaterImages] Starting initialization...');
    console.log('[PixiWaterImages] Container element:', containerRef.current);
    
    // Get image elements within containerRef, excluding no-water-effect
    // This includes both <img> tags and Next.js Image components (which render as <img>)
    const imageElements = containerRef.current.querySelectorAll(
      "img:not(.no-water-effect)"
    );
    console.log('[PixiWaterImages] Found images:', imageElements.length);
    console.log('[PixiWaterImages] Container ID:', containerRef.current.id);
    
    // Log first few image sources for debugging
    if (imageElements.length > 0) {
      console.log('[PixiWaterImages] Sample images:', 
        Array.from(imageElements).slice(0, 5).map(img => ({
          src: img.src.substring(img.src.lastIndexOf('/') + 1),
          class: img.className,
          width: img.width,
          height: img.height
        }))
      );
    }
    
    if (imageElements.length === 0) {
      console.warn('[PixiWaterImages] No images found to apply water effect');
      console.warn('[PixiWaterImages] Container HTML:', containerRef.current.innerHTML.substring(0, 500));
      return;
    }

    // Initialize PIXI application immediately (useLayoutEffect runs after DOM paint)
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    app.ticker.maxFPS = isMobile ? 15 : 30;
    pixiContainerRef.current.appendChild(app.view);
    app.view.style.position = "absolute";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.pointerEvents = "none";

    // Displacement sprite for water effect
    const displacementTexture = PIXI.Texture.from("/water3.jpg");
    const displacementSprite = new PIXI.Sprite(displacementTexture);
    
    // Log when texture loads
    displacementTexture.baseTexture.on('loaded', () => {
      console.log('[PixiWaterImages] Water texture loaded successfully!');
    });
    displacementTexture.baseTexture.on('error', (err) => {
      console.error('[PixiWaterImages] Failed to load water texture:', err);
    });
    
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.5);
    displacementSprite.alpha = 0;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    app.stage.addChild(displacementSprite);
    
    // Create displacement filter for water effect
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    const sx = isMobile ? 4 : 6; // Balanced desktop water effect
    const sy = isMobile ? 4 : 6;
    displacementFilter.scale.set(sx, sy);
    displacementFilter.padding = 30;
    
    console.log('[PixiWaterImages] Water effect initialized with scale:', sx, sy);
    console.log('[PixiWaterImages] Found', imageElements.length, 'images to apply water effect');
    console.log('[PixiWaterImages] Canvas size:', app.view.width, 'x', app.view.height);

    // Create PIXI sprites for each DOM image element
    const imageSprites = [];
    
    // Wait for images to be laid out and visible
    const initSprites = () => {
      if (destroyed) return;
      
      // Check if at least one image has valid dimensions
      let hasValidDimensions = false;
      imageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          hasValidDimensions = true;
        }
      });
      
      if (!hasValidDimensions) {
        console.log('[PixiWaterImages] Images not yet laid out, retrying...');
        requestAnimationFrame(initSprites);
        return;
      }
      
      console.log('[PixiWaterImages] Images ready, creating sprites...');
      
      imageElements.forEach((el) => {
        const src = el.src;
        if (!src) return;
        
        const rect = el.getBoundingClientRect();
        console.log(`[PixiWaterImages] Image rect:`, rect.width, 'x', rect.height, 'at', rect.left, rect.top);
        
        // Skip if still no dimensions
        if (rect.width === 0 || rect.height === 0) {
          console.warn('[PixiWaterImages] Skipping image with 0 dimensions');
          return;
        }
        
        const sprite = PIXI.Sprite.from(src);
        
        // Use actual rect dimensions
        sprite.width = rect.width;
        sprite.height = rect.height;
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        
        sprite.filters = [displacementFilter]; // Always apply water effect
        sprite.anchor.set(0.5);
        sprite.visible = true;
        
        app.stage.addChild(sprite);
        imageSprites.push({ sprite, element: el });
        
        console.log(`[PixiWaterImages] Created sprite at (${sprite.x.toFixed(0)}, ${sprite.y.toFixed(0)}) size ${sprite.width.toFixed(0)}x${sprite.height.toFixed(0)}`);
        
        // Hide original image so PIXI sprite shows
        el.style.opacity = "0";
      });
      
      console.log('[PixiWaterImages] Total sprites created:', imageSprites.length);
      
      // Setup scroll/resize listeners and IntersectionObserver after sprites are created
      if (imageSprites.length > 0) {
        setupListeners();
      }
    };
    
    // Start the initialization process
    requestAnimationFrame(() => {
      requestAnimationFrame(initSprites);
    });
    
    // Define updateNow function
    const updateNow = () => {
      if (destroyed || imageSprites.length === 0) return;
      imageSprites.forEach(({ sprite, element }) => {
        try {
          if (!sprite || sprite.destroyed || !sprite.transform || !sprite.scale) return;
          if (!element || !document.body.contains(element)) return;
          const rect = element.getBoundingClientRect();
          if (rect.width && rect.height) {
            sprite.width = rect.width;
            sprite.height = rect.height;
            sprite.x = rect.left + rect.width / 2;
            sprite.y = rect.top + rect.height / 2;
          }
          // visibility managed by IO, keep conservative fallback
          if (!('isIntersecting' in element)) {
            sprite.visible = rect.top < window.innerHeight && rect.bottom > 0;
          }
        } catch (e) {
          // Ignore errors from destroyed sprites
        }
      });
      if (!destroyed) {
        try {
          app.renderer.resize(window.innerWidth, window.innerHeight);
          if (displacementSprite && displacementSprite.scale) {
            displacementSprite.width = window.innerWidth;
            displacementSprite.height = window.innerHeight;
          }
        } catch (e) {
          // Ignore resize errors
        }
      }
    };
    
    const setupListeners = () => {
      // Visibility control using IntersectionObserver
      const io = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const pair = imageSprites.find((p) => p.element === target);
          if (pair) pair.sprite.visible = isIntersecting;
        });
      }, { root: null, threshold: 0.1 });

      // Update positions and sizes on resize and scroll
      let resizeRaf = 0;
      const updatePositions = () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          if (destroyed) return;
          resizeRaf = 0;
          updateNow();
        });
      };

      window.addEventListener("resize", updatePositions);
      window.addEventListener("scroll", updatePositions, { passive: true });
      
      // Observe elements for on-screen toggling
      imageSprites.forEach(({ element }) => io.observe(element));
      
      // Store cleanup functions
      cleanupFunctions.push(() => {
        imageSprites.forEach(({ element }) => io.unobserve(element));
        io.disconnect();
        window.removeEventListener("resize", updatePositions);
        window.removeEventListener("scroll", updatePositions);
      });
    };
    
    const cleanupFunctions = [];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = prefersReduced ? 0.03 : (isMobile ? 0.3 : 0.65); // Balanced animation speed

    const tick = () => {
      displacementSprite.x += speed;
      displacementSprite.y += speed;
    };
    app.ticker.add(tick);
    
    console.log('[PixiWaterImages] Water animation speed:', speed);

    // Pause when tab is hidden to save resources
    const onVisibility = () => {
      if (document.hidden) {
        app.ticker.stop();
      } else {
        app.ticker.start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Cleanup
    return () => {
      destroyed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      cleanupFunctions.forEach(fn => fn());
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current) pixiContainerRef.current.innerHTML = "";
    };
  }, [containerRef]);

  return (
    <div
      ref={pixiContainerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
