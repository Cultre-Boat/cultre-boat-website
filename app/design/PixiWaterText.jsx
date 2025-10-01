"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "@pixi/filter-displacement";
import { debounce } from "lodash";

const PixiWaterText = ({ containerRef }) => {
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    if (!pixiContainerRef.current || !containerRef.current) return;

    // Select text elements
    const textElements = containerRef.current.querySelectorAll(
      "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
    );
    if (textElements.length === 0) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
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
    const displacementSprite = PIXI.Sprite.from("/pattern-clouds.jpg");
    displacementSprite.texture.baseTexture.on("error", () => {
      console.error("Failed to load /pattern-clouds.jpg, using fallback");
      displacementSprite.texture = PIXI.Texture.from(
        "https://i.imgur.com/3PTiU4U.jpg"
      );
    });
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.alpha = 0;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    const displacementFilter = new DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(10, 10);

    app.stage.addChild(displacementSprite);

    const textSprites = [];

    // Create sprites after DOM is ready
    const createSprites = () => {
      textElements.forEach((el, index) => {
        const text = el.textContent;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        console.log(
          `Creating sprite ${index}: "${text.slice(0, 20)}..." at x: ${rect.left + rect.width / 2}, y: ${
            rect.top + window.scrollY + rect.height / 2
          }`
        );

        const textSprite = new PIXI.Text(text, {
          fontFamily: style.fontFamily,
          fontSize: parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
          fill: style.color,
          align: "left",
        });

        textSprite.x = rect.left + rect.width / 2;
        textSprite.y = rect.top + window.scrollY + rect.height / 2; // Add scroll offset
        textSprite.anchor.set(0.5);
        textSprite.filters = [displacementFilter];

        app.stage.addChild(textSprite);
        textSprites.push({ sprite: textSprite, element: el });
      });

      updatePositions(); // Update positions immediately after creation
    };

    // Update sprite positions
    const updatePositions = () => {
      textSprites.forEach(({ sprite, element }) => {
        const rect = element.getBoundingClientRect();
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + window.scrollY + rect.height / 2; // Add scroll offset
        sprite.visible = rect.bottom >= 0 && rect.top <= window.innerHeight; // Show if partially in viewport
        console.log(
          `Updating sprite: "${element.textContent.slice(0, 20)}...", rect.top: ${rect.top}, scrollY: ${window.scrollY}, sprite.y: ${sprite.y}`
        );
      });
      app.renderer.resize(window.innerWidth, window.innerHeight);
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
    };

    // Wait for DOM to be ready
    requestAnimationFrame(createSprites);

    // Animate displacement
    app.ticker.add(() => {
      displacementSprite.x += 3;
      displacementSprite.y += 3;
    });

    // Debounce resize and scroll events
    const debouncedUpdatePositions = debounce(updatePositions, 10);
    window.addEventListener("resize", debouncedUpdatePositions);
    window.addEventListener("scroll", debouncedUpdatePositions);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedUpdatePositions);
      window.removeEventListener("scroll", debouncedUpdatePositions);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current) pixiContainerRef.current.innerHTML = "";
    };
  }, [containerRef]);

  return (
    <div
      ref={pixiContainerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2]"
    />
  );
};

export default PixiWaterText;