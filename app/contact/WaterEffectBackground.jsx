"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function WaterEffectBackground() {
  const pixiRef = useRef(null);

  useEffect(() => {
    if (!pixiRef.current) return;

    const width = pixiRef.current.offsetWidth || 1200;
    const height = pixiRef.current.offsetHeight || 600;
    const app = new PIXI.Application({
      width,
      height,
      transparent: true,
      backgroundAlpha: 0,
      resizeTo: pixiRef.current,
    });

    pixiRef.current.appendChild(app.view);

    // Underlying background color
    const bgSprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
    bgSprite.width = width;
    bgSprite.height = height;
    bgSprite.tint = 0x1e90ff; // Light blue
    bgSprite.alpha = 0.15;     // Subtle

    // Displacement setup
    const displacementSprite = PIXI.Sprite.from("/pattern-clouds.jpg");
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.width = width;
    displacementSprite.height = height;
    displacementSprite.alpha = 0.9;

    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

    app.stage.addChild(displacementSprite);
    app.stage.addChild(bgSprite);

    bgSprite.filters = [displacementFilter];

    // Animate displacement
    app.ticker.add(() => {
      displacementSprite.x += 2;
      displacementSprite.y += 1;
    });

    // Cleanup Pixi on unmount
    return () => {
      app.destroy(true, { children: true });
      pixiRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={pixiRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      style={{ pointerEvents: "none", top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}
