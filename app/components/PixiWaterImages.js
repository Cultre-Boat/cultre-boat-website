"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixiWaterImages({ containerRef }) {
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    if (!pixiContainerRef.current || !containerRef.current) return;

    // Get image elements within containerRef, excluding no-water-effect
    const imageElements = containerRef.current.querySelectorAll(
      "img:not(.no-water-effect)"
    );
    if (imageElements.length === 0) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    pixiContainerRef.current.appendChild(app.view);
    app.view.style.position = "absolute";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.pointerEvents = "none";

    // Displacement sprite
    const displacementSprite = PIXI.Sprite.from(
      "https://raw.githubusercontent.com/Pierrinho/elephant/master/pattern-clouds.jpg"
    );
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.4); // Match PixiImage scale
    displacementSprite.alpha = 0;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

    if (window.innerWidth < 768) {
      displacementFilter.scale.set(10, 10); // phone: softer waves
    } else {
      displacementFilter.scale.set(15, 15); // desktop: stronger waves
    }
    displacementFilter.padding = 30; // Add padding to ensure the effect extends to edges

    app.stage.addChild(displacementSprite);

    // Create PIXI sprites for each DOM image element
    const imageSprites = [];
    imageElements.forEach((el) => {
      const src = el.src;
      const rect = el.getBoundingClientRect();

      const sprite = PIXI.Sprite.from(src);
      sprite.width = rect.width;
      sprite.height = rect.height;
      sprite.x = rect.left;
      sprite.y = rect.top;
      sprite.filters = [displacementFilter];

      // Ensure sprite texture is loaded and apply anchor to center for better edge distortion
      sprite.anchor.set(0.5);
      sprite.x += rect.width / 2;
      sprite.y += rect.height / 2;

      app.stage.addChild(sprite);
      imageSprites.push({ sprite, element: el });

      // Hide original image
      el.style.opacity = "0";
    });

    const isSmallScreen = window.innerWidth < 768; // breakpoint for mobile
    const speed = isSmallScreen ? 0.4 : 0.3; // slower on small screens

    app.ticker.add(() => {
      displacementSprite.x += speed;
      displacementSprite.y += speed;
    });

    // Update positions and sizes on resize and scroll
    const updatePositions = () => {
      imageSprites.forEach(({ sprite, element }) => {
        const rect = element.getBoundingClientRect();
        sprite.width = rect.width;
        sprite.height = rect.height;
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        sprite.visible = rect.top < window.innerHeight && rect.bottom > 0;
      });
      app.renderer.resize(window.innerWidth, window.innerHeight);
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
    };

    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);
    updatePositions(); // Initial update

    // Cleanup
    return () => {
      imageElements.forEach((el) => {
        el.style.opacity = "1";
      });
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
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
