"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixiWaterImages({ containerRef }) {
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    if (!pixiContainerRef.current || !containerRef.current) return;
    let destroyed = false;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    // Get image elements within containerRef, excluding no-water-effect
    const imageElements = containerRef.current.querySelectorAll(
      "img:not(.no-water-effect)"
    );
    if (imageElements.length === 0) return;

    // Wait for next frame to ensure DOM layout is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (destroyed) return;
        
        // Initialize PIXI application
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

        // Displacement sprite (defensive on mobile browsers)
        let displacementSprite = null;
        let displacementFilter = null;
        try {
          displacementSprite = PIXI.Sprite.from("/water3.jpg");
          if (displacementSprite && displacementSprite.texture && displacementSprite.texture.baseTexture) {
            displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
          }
          if (displacementSprite && displacementSprite.scale) {
            displacementSprite.scale.set(0.4);
          }
          if (displacementSprite) {
            displacementSprite.alpha = 0;
            displacementSprite.width = window.innerWidth;
            displacementSprite.height = window.innerHeight;
          }
          if (PIXI.filters && PIXI.filters.DisplacementFilter && displacementSprite) {
            displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
            const sx = isMobile ? 4 : 5;
            const sy = isMobile ? 4 : 5;
            if (displacementFilter && displacementFilter.scale) {
              displacementFilter.scale.set(sx, sy);
            }
            if (displacementFilter) displacementFilter.padding = 30;
          }
          if (displacementSprite) app.stage.addChild(displacementSprite);
        } catch (e) {
          console.warn('[PixiWaterImages] Displacement setup failed; skipping water effect', e);
        }

        // Create PIXI sprites for each DOM image element
        const imageSprites = [];
        imageElements.forEach((el) => {
          const src = el.src;
          if (!src) return;
          
          const rect = el.getBoundingClientRect();
          const sprite = PIXI.Sprite.from(src);
          
          // Use actual rect dimensions (DOM should be laid out by now)
          sprite.width = rect.width;
          sprite.height = rect.height;
          sprite.x = rect.left + rect.width / 2;
          sprite.y = rect.top + rect.height / 2;
          
          if (displacementFilter) sprite.filters = [displacementFilter];
          sprite.anchor.set(0.5);
          sprite.visible = true;
          
          app.stage.addChild(sprite);
          imageSprites.push({ sprite, element: el });
          
          // Hide original immediately so PIXI sprite shows
          el.style.opacity = "0";
        });
        
        // Define updateNow function before first use
        const updateNow = () => {
          if (destroyed) return;
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
        // Force initial update/positioning AFTER sprites and canvas are in the DOM.
        updateNow();

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const speed = prefersReduced ? 0.03 : (isMobile ? 0.5 : 1);

        const tick = () => {
          if (!displacementSprite) return;
          displacementSprite.x += speed;
          displacementSprite.y += speed;
        };
        app.ticker.add(tick);

        // Visibility control using IntersectionObserver to avoid drawing offscreen sprites
        const elementToSprite = new Map();
        const io = new IntersectionObserver((entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            const pair = imageSprites.find((p) => p.element === target);
            if (pair) pair.sprite.visible = isIntersecting;
          });
        }, { root: null, threshold: 0.1 });

        // Update positions and sizes on resize and scroll (throttled)
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
        updatePositions();

        // Observe elements for on-screen toggling
        imageSprites.forEach(({ element }) => io.observe(element));

        // Pause when tab is hidden to save resources
        const onVisibility = () => {
          if (document.hidden) {
            app.ticker.stop();
          } else {
            app.ticker.start();
          }
        };
        document.addEventListener('visibilitychange', onVisibility);
      });
    });

    // Cleanup
    return () => {
      destroyed = true;
    };
  }, [containerRef]);

  return (
    <div
      ref={pixiContainerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
