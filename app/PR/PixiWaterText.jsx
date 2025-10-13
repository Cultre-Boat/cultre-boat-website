"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const PixiWaterText = ({ containerRef }) => {
  const pixiRef = useRef(null);

  useEffect(() => {
    if (!pixiRef.current || !containerRef.current) return;

    // Ensure DOM is ready
    const textElements = containerRef.current.querySelectorAll(
      "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
    );
    if (textElements.length === 0) {
      console.warn("No text elements found for water effect");
      return;
    }

    // Hide original text
    textElements.forEach((el) => (el.style.opacity = "0"));

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    pixiRef.current.appendChild(app.view);
    app.view.style.position = "absolute";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.pointerEvents = "none";

    // Use PIXI.Loader for Pixi.js v6
    const loader = new PIXI.Loader();
    loader.add("displacementMap", "/pattern-clouds.jpg").load((loader, resources) => {
      if (!resources.displacementMap || !resources.displacementMap.texture) {
        console.error("Failed to load displacement texture");
        return;
      }

      const displacementSprite = new PIXI.Sprite(resources.displacementMap.texture);
      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
      const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
      displacementFilter.scale.set(10, 10);

      app.stage.addChild(displacementSprite);

      const textSprites = [];
      textElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        const sprite = new PIXI.Text(el.textContent, {
          fontFamily: style.fontFamily,
          fontSize: parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          fill: style.color,
          align: "left",
        });

        // Adjust for scroll position
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        sprite.x = rect.left + rect.width / 2 + scrollX;
        sprite.y = rect.top + rect.height / 2 + scrollY;
        sprite.anchor.set(0.5);
        sprite.filters = [displacementFilter];

        app.stage.addChild(sprite);
        textSprites.push({ sprite, element: el });
      });

      app.ticker.add(() => {
        displacementSprite.x += 2;
        displacementSprite.y += 2;
      });

      const updatePositions = () => {
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        textSprites.forEach(({ sprite, element }) => {
          const rect = element.getBoundingClientRect();
          sprite.x = rect.left + rect.width / 2 + scrollX;
          sprite.y = rect.top + rect.height / 2 + scrollY;
        });
        app.renderer.resize(window.innerWidth, window.innerHeight);
        displacementSprite.width = window.innerWidth;
        displacementSprite.height = window.innerHeight;
      };

      // Initial position update to ensure correct placement
      updatePositions();

      window.addEventListener("resize", updatePositions);
      window.addEventListener("scroll", updatePositions);

      // Cleanup
      return () => {
        window.removeEventListener("resize", updatePositions);
        window.removeEventListener("scroll", updatePositions);
        updatePositions(); // position text right away

        app.destroy(true, { children: true, texture: true, baseTexture: true });
        textElements.forEach((el) => (el.style.opacity = "1"));
      };
    });

    loader.onError.add((error, resource) => {
      console.error(`Error loading resource ${resource.url}:`, error);
    });
  }, [containerRef]);

  return <div ref={pixiRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[20]" />;
};

export default PixiWaterText;