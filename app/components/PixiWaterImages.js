"use client";

import { useLayoutEffect, useRef } from "react";
import * as PIXI from "pixi.js";

// Fit the whole image inside the element's box: no crop, no stretch, no zoom.
// Skipped until the texture loads, since an unloaded texture reports a 1px size.
function fitSpriteInRect(sprite, rect) {
  const { texture } = sprite;
  if (!texture.baseTexture.valid) return;
  sprite.scale.set(Math.min(rect.width / texture.width, rect.height / texture.height));
}

function applyTextTransform(text, transform) {
  if (transform === 'uppercase') return text.toUpperCase();
  if (transform === 'lowercase') return text.toLowerCase();
  if (transform === 'capitalize') return text.replace(/\b\w/g, (c) => c.toUpperCase());
  return text;
}

// Read the lines exactly as the browser wrapped them, by grouping each word
// by the vertical position of its rendered box.
function getRenderedLines(el, transform) {
  const lines = [];
  let lastTop = null;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const wordRe = /\S+/g;
    let m;
    while ((m = wordRe.exec(text))) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const r = range.getClientRects()[0];
      if (!r) continue;
      if (lastTop === null || Math.abs(r.top - lastTop) > r.height / 2) {
        lines.push(m[0]);
        lastTop = r.top;
      } else {
        lines[lines.length - 1] += ' ' + m[0];
      }
    }
  }
  if (!lines.length) return [applyTextTransform(el.textContent.trim(), transform)];
  return lines.map((l) => applyTextTransform(l, transform));
}

export default function PixiWaterImages({ containerRef, intensity = 1 }) {
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
    console.log('[PixiWaterImages] Device: ', isMobile ? 'MOBILE' : 'DESKTOP');
    console.log('[PixiWaterImages] Screen size:', window.innerWidth, 'x', window.innerHeight);
    console.log('[PixiWaterImages] Container element:', containerRef.current);
    
    // Get BOTH image AND text elements to render together in Pixi
    // EXCLUDE images and text with .no-water-effect class
    const imageElements = containerRef.current.querySelectorAll("img:not(.no-water-effect)");
    // Get text elements - Include .text-stable elements (they NEED water effect for stability!)
    // Only exclude elements in .no-cursor-distort sections
    const textElements = Array.from(containerRef.current.querySelectorAll(
      "h1, h2, h3, p"
    )).filter(el => {
      // Include .text-stable elements even if they have .no-water-effect class
      // (the class name is misleading - they DO need water effect for text stability!)
      if (el.closest('.text-stable')) return true;
      
      // Exclude only navigation/UI elements
      return !el.closest('.no-cursor-distort');
    });
    
    const excludedImages = containerRef.current.querySelectorAll("img.no-water-effect");
    
    console.log('[PixiWaterImages] Found images FOR water effect:', imageElements.length);
    console.log('[PixiWaterImages] Excluded images (no-water-effect):', excludedImages.length);
    console.log('[PixiWaterImages] Found text elements:', textElements.length);
    console.log('[PixiWaterImages] Container ID:', containerRef.current.id);
    console.log('[PixiWaterImages] ✓ Rendering text + images together in same canvas');
    console.log('[PixiWaterImages] ✓ Same water effect applied to both = NO relative movement on scroll');
    
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
    
    if (imageElements.length === 0 && textElements.length === 0) {
      console.warn('[PixiWaterImages] No images or text found to apply water effect');
      console.warn('[PixiWaterImages] Container HTML:', containerRef.current.innerHTML.substring(0, 500));
      return;
    }

    // Initialize PIXI application immediately (useLayoutEffect runs after DOM paint)
    let app;
    try {
      app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      });
      app.ticker.maxFPS = isMobile ? 40 : 60;
      pixiContainerRef.current.appendChild(app.view);
      app.view.style.position = "absolute";
      app.view.style.top = "0";
      app.view.style.left = "0";
      app.view.style.pointerEvents = "none";
      console.log('[PixiWaterImages] PIXI app created successfully');
    } catch (error) {
      console.error('[PixiWaterImages] Failed to create PIXI application:', error);
      return;
    }

    // Displacement sprite for water effect
    let displacementTexture, displacementSprite, displacementFilter;
    try {
      displacementTexture = PIXI.Texture.from("/water3.jpg");
      displacementSprite = new PIXI.Sprite(displacementTexture);
      
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
      console.log('[PixiWaterImages] Displacement sprite created');
    } catch (error) {
      console.error('[PixiWaterImages] Failed to create displacement sprite:', error);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      return;
    }
    
    // Create displacement filter for water effect - Applied uniformly to text AND images
    try {
      displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
      const baseScale = isMobile ? 5 : 6; // Increased mobile for more visible effect
      const sx = baseScale * intensity; // Apply intensity multiplier
      const sy = baseScale * intensity;
      displacementFilter.scale.set(sx, sy);
      displacementFilter.padding = 30; // Standard padding
      console.log('[PixiWaterImages] Displacement filter created with scale:', sx, sy, 'intensity:', intensity);
      console.log('[PixiWaterImages] Effect applied uniformly to BOTH text and images - no relative movement!');
    } catch (error) {
      console.error('[PixiWaterImages] Failed to create displacement filter:', error);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      return;
    }
    
    console.log('[PixiWaterImages] Found', imageElements.length, 'images and', textElements.length, 'text elements');
    console.log('[PixiWaterImages] Canvas size:', app.view.width, 'x', app.view.height);

    // Create PIXI sprites for images AND text elements
    const allSprites = [];
    
    // Wait for elements to be laid out and visible
    const initSprites = () => {
      if (destroyed) return;
      
      // Check if at least one element has valid dimensions
      let hasValidDimensions = false;
      imageElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          hasValidDimensions = true;
        }
      });
      
      if (!hasValidDimensions && imageElements.length > 0) {
        console.log('[PixiWaterImages] Elements not yet laid out, retrying...');
        requestAnimationFrame(initSprites);
        return;
      }
      
      console.log('[PixiWaterImages] Elements ready, creating Pixi objects...');
      
      // Create sprites for images
      imageElements.forEach((el) => {
        const src = el.src;
        if (!src) return;
        
        const rect = el.getBoundingClientRect();
        
        if (rect.width === 0 || rect.height === 0) {
          console.warn('[PixiWaterImages] Skipping image with 0 dimensions');
          return;
        }
        
        const sprite = PIXI.Sprite.from(src);
        fitSpriteInRect(sprite, rect);
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        sprite.filters = [displacementFilter];
        sprite.anchor.set(0.5);
        sprite.visible = true;
        
        // Size it once loaded
        if (!sprite.texture.baseTexture.valid) {
          sprite.texture.baseTexture.once("loaded", () => updateNow());
        }

        app.stage.addChild(sprite);
        allSprites.push({ sprite, element: el, type: 'image' });
        
        // Hide original image
        el.style.opacity = "0";
      });
      
      // Render text in Pixi on BOTH mobile and desktop for uniform water effect
      console.log('[PixiWaterImages] Rendering text in Pixi for uniform water effect');
      textElements.forEach((el) => {
        try {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          
          const computedStyle = window.getComputedStyle(el);
          const fontSize = parseFloat(computedStyle.fontSize);
          const fontWeight = computedStyle.fontWeight;
          const fontFamily = computedStyle.fontFamily || 'Arial';
          const color = computedStyle.color;
          
          // Convert RGB to hex for Pixi
          const rgb = color.match(/\d+/g);
          const hexColor = rgb ? parseInt(rgb[0]) * 65536 + parseInt(rgb[1]) * 256 + parseInt(rgb[2]) : 0xffffff;
          
          const textAlign = computedStyle.textAlign || 'center';
          
          // Use the browser's own line breaks so Pixi text never wraps differently
          // from the DOM (which caused headings to spill onto the text below)
          const lines = getRenderedLines(el, computedStyle.textTransform);
          const parsedLineHeight = parseFloat(computedStyle.lineHeight);
          const lineHeight = Number.isFinite(parsedLineHeight)
            ? parsedLineHeight
            : (lines.length ? rect.height / lines.length : fontSize * 1.2);

          const pixiText = new PIXI.Text(lines.join('\n'), {
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontWeight: fontWeight,
            fill: hexColor,
            align: textAlign,
            letterSpacing: parseFloat(computedStyle.letterSpacing) || 0,
            lineHeight: lineHeight,
            wordWrap: false,
            padding: 0, // no offset: text lines up exactly with the page text
          });
          
          // Position text based on alignment
          if (textAlign === 'center') {
            pixiText.anchor.set(0.5, 0);
            pixiText.x = rect.left + rect.width / 2;
            pixiText.y = rect.top;
          } else if (textAlign === 'right') {
            pixiText.anchor.set(1, 0);
            pixiText.x = rect.right;
            pixiText.y = rect.top;
          } else {
            pixiText.anchor.set(0, 0);
            pixiText.x = rect.left;
            pixiText.y = rect.top;
          }
          pixiText.filters = [displacementFilter]; // Same water effect as images!
          pixiText.visible = true;
          
          app.stage.addChild(pixiText);
          allSprites.push({ sprite: pixiText, element: el, type: 'text' });
          
          // Hide original text
          el.style.opacity = "0";
          
          console.log('[PixiWaterImages] Created text sprite:', el.textContent.substring(0, 30));
        } catch (error) {
          console.warn('[PixiWaterImages] Failed to create text sprite:', error);
          // Don't hide the original text if Pixi text fails
        }
      });
      
      const imageCount = allSprites.filter(s => s.type === 'image').length;
      const textCount = allSprites.filter(s => s.type === 'text').length;
      
      console.log('[PixiWaterImages] Total created:', allSprites.length, '(', imageCount, 'images +', textCount, 'text )');
      
      // Ensure we setup listeners even if only images rendered (no text)
      if (allSprites.length > 0 || imageElements.length > 0) {
        setupListeners();
        console.log('[PixiWaterImages] Water effect active!');
      } else {
        console.warn('[PixiWaterImages] No sprites created - water effect disabled');
      }
    };
    
    // Start the initialization process
    // Wait for web fonts first: text measured with a fallback font wraps wider than the real font and spills out of its box
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      if (destroyed) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(initSprites);
      });
    });
    
    // Define updateNow function for both images and text
    const updateNow = () => {
      if (destroyed || allSprites.length === 0) return;
      allSprites.forEach(({ sprite, element, type }) => {
        try {
          if (!sprite || sprite.destroyed) return;
          if (!element || !document.body.contains(element)) return;
          const rect = element.getBoundingClientRect();
          if (rect.width && rect.height) {
            if (type === 'image') {
              fitSpriteInRect(sprite, rect);
              sprite.x = rect.left + rect.width / 2;
              sprite.y = rect.top + rect.height / 2;
            } else {
              // For text, update position based on anchor (alignment)
              if (sprite.anchor && sprite.anchor.x === 0.5) {
                // Center aligned
                sprite.x = rect.left + rect.width / 2;
                sprite.y = rect.top;
              } else if (sprite.anchor && sprite.anchor.x === 1) {
                // Right aligned
                sprite.x = rect.right;
                sprite.y = rect.top;
              } else {
                // Left aligned
                sprite.x = rect.left;
                sprite.y = rect.top;
              }
            }
          }
          // visibility managed by IO
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
      // Visibility control using IntersectionObserver for both images and text
      const io = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const pair = allSprites.find((p) => p.element === target);
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

      // Observe all elements (images + text) for on-screen toggling
      allSprites.forEach(({ element }) => io.observe(element));

      // Carousels swap an <img> src in place: follow it, otherwise the canvas keeps showing the first image.
      // Resize only after load, since sizing against an unloaded 1px texture blows the sprite up.
      const srcObserver = new MutationObserver((mutations) => {
        mutations.forEach(({ target }) => {
          const pair = allSprites.find((p) => p.element === target);
          if (!pair || pair.sprite.destroyed) return;
          const texture = PIXI.Texture.from(target.src);
          pair.sprite.texture = texture;
          if (texture.baseTexture.valid) updatePositions();
          else texture.baseTexture.once("loaded", updatePositions);
          target.addEventListener("load", updatePositions, { once: true });
        });
      });
      allSprites.forEach(({ element, type }) => {
        if (type === "image") srcObserver.observe(element, { attributes: true, attributeFilter: ["src"] });
      });

      // Store cleanup functions
      cleanupFunctions.push(() => {
        srcObserver.disconnect();
        allSprites.forEach(({ element }) => io.unobserve(element));
        io.disconnect();
        window.removeEventListener("resize", updatePositions);
        window.removeEventListener("scroll", updatePositions);
      });
    };
    
    const cleanupFunctions = [];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = prefersReduced ? 0.03 : (isMobile ? 0.5 : 0.65);

    // Optimize: Only update displacement sprite, not all sprites
    const tick = () => {
      if (displacementSprite && !displacementSprite.destroyed) {
        displacementSprite.x += speed;
        displacementSprite.y += speed;
      }
    };
    app.ticker.add(tick);
    
    // Limit FPS for smooth performance without lag
    app.ticker.maxFPS = isMobile ? 40 : 60;
    
    console.log('[PixiWaterImages] Water animation speed:', speed, 'FPS:', app.ticker.maxFPS);
    console.log('[PixiWaterImages] Performance mode:', isMobile ? 'Mobile (40 FPS)' : 'Desktop (60 FPS)');

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
  }, [containerRef, intensity]);

  return (
    <div
      ref={pixiContainerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: 'normal' }}
    />
  );
}
