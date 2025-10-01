"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from '@pixi/filter-displacement';
export default function WaterText({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      width: 600,
      height: 200,
      transparent: true,
      backgroundColor: 0x000000,
      backgroundAlpha: 0, 
    });
    containerRef.current.appendChild(app.view);

    // Text
    const textObj = new PIXI.Text(text, {
      fontSize: 40,
      fill: 0xffffff,
      align: "center",
    });
    textObj.anchor.set(0.5);
    textObj.x = app.renderer.width / 2;
    textObj.y = app.renderer.height / 2;

    // Displacement sprite (noise texture for water effect)
    const displacementSprite = PIXI.Sprite.from(
     "/pattern-clouds.jpg"
    );
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.alpha = 0;
    const displacementFilter = new DisplacementFilter(
      displacementSprite
    );

    app.stage.addChild(displacementSprite);
    app.stage.addChild(textObj);

    textObj.filters = [displacementFilter];

    // Animate displacement
    app.ticker.add(() => {
      displacementSprite.x += 3;
      displacementSprite.y += 3;
    });

    return () => {
      app.destroy(true, { children: true });
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [text]);

  return <div ref={containerRef} className="pointer-events-none" />;
}
