"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "@pixi/filter-displacement";

const PixiWaterText = ({ containerRef }) => {
  const pixiRef = useRef(null);

  useEffect(() => {
    if (!pixiRef.current || !containerRef.current) return;

    const textElements = containerRef.current.querySelectorAll(
      "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
    );
    if (textElements.length === 0) return;

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

    // Displacement Filter
    const displacementSprite = PIXI.Sprite.from("/pattern-clouds.jpg");
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    const displacementFilter = new DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(10, 10);

    app.stage.addChild(displacementSprite);

    // Create PIXI text for each DOM element
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

      // Center of original text
      sprite.x = rect.left + rect.width / 2;
      sprite.y = rect.top + rect.height / 2;
      sprite.anchor.set(0.5);
      sprite.filters = [displacementFilter];

      app.stage.addChild(sprite);
      textSprites.push({ sprite, element: el });
    });

    // Animate displacement
    app.ticker.add(() => {
      displacementSprite.x += 2;
      displacementSprite.y += 2;
    });

    const updatePositions = () => {
      textSprites.forEach(({ sprite, element }) => {
        const rect = element.getBoundingClientRect();
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
      });
      app.renderer.resize(window.innerWidth, window.innerHeight);
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
    };

    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);

    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      textElements.forEach((el) => (el.style.opacity = "1"));
    };
  }, [containerRef]);

  return <div ref={pixiRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[20]" />;
};

export default PixiWaterText;
