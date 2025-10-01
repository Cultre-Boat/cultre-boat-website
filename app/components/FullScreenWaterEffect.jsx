"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "@pixi/filter-displacement";

export default function FullScreenScreenWaterEffect() {
  const canvasRef = useRef(null);
const initialized = useRef(false);
  useEffect(() => {
    if (!canvasRef.current || initialized.current) return;
  initialized.current = true;

    // Initialize PIXI application
    let app;

if (canvasRef.current) {
  app = new PIXI.Application({
    view: canvasRef.current,
    resizeTo: window,
    backgroundColor: 0x000000,
    backgroundAlpha: 0,
    resolution: Math.max(1, window.devicePixelRatio || 1), // ensure > 0
    autoDensity: true,
  });
}

    // Create a container for the displacement effect
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Add a smoke texture as the background image
    const smokeTextureUrl = "/fig.jpg"; // Replace with your smoke texture
    const fallbackSmokeTexture = "https://i.imgur.com/5jXz7Yv.png"; // Fallback smoke texture
    const smokeSprite = PIXI.Sprite.from(smokeTextureUrl);

    smokeSprite.texture.baseTexture.on("error", () => {
      smokeSprite.texture = PIXI.Texture.from(fallbackSmokeTexture);
    });

    smokeSprite.width = window.innerWidth * 2; // Double width for seamless looping
    smokeSprite.height = window.innerHeight * 2; // Double height for seamless looping
    smokeSprite.alpha = 0.4; // Semi-transparent for subtle smoke effect
    smokeSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT; // Seamless tiling
    container.addChild(smokeSprite);

    // Load displacement map for waving effect
    const displacementMapUrl = "/pattern-clouds.jpg"; // Cloud-like pattern for smoke
    const fallbackDisplacementMap = "https://i.imgur.com/3PTiU4U.jpg";
    const displacementSprite = PIXI.Sprite.from(displacementMapUrl);

    displacementSprite.texture.baseTexture.on("error", () => {
      displacementSprite.texture = PIXI.Texture.from(fallbackDisplacementMap);
    });

    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.8); // Larger scale for more pronounced waves
    displacementSprite.alpha = 0; // Invisible displacement map
    displacementSprite.width = window.innerWidth * 2; // Cover larger area for seamless effect
    displacementSprite.height = window.innerHeight * 2;

    const displacementFilter = new DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(80, 80); // Stronger distortion for smoke-like waves

    app.stage.addChild(displacementSprite);
    container.filters = [displacementFilter];

    smokeSprite.texture.baseTexture.on("error", () => {
  console.error("Failed to load smoke texture, using fallback");
  smokeSprite.texture = PIXI.Texture.from(fallbackSmokeTexture);
});

displacementSprite.texture.baseTexture.on("error", () => {
  console.error("Failed to load displacement map, using fallback");
  displacementSprite.texture = PIXI.Texture.from(fallbackDisplacementMap);
});

    // Animate displacement map and smoke sprite for continuous flow
    app.ticker.add(() => {
      // Move displacement map for waving effect
      displacementSprite.x += 2; // Faster movement for dynamic smoke
      displacementSprite.y += 1.5;

      // Move smoke sprite to create flow across screen
      smokeSprite.x -= 1; // Move left to simulate smoke drifting
      smokeSprite.y -= 0.5;

      // Reset positions for seamless looping
      if (displacementSprite.x > window.innerWidth) displacementSprite.x -= window.innerWidth;
      if (displacementSprite.y > window.innerHeight) displacementSprite.y -= window.innerHeight;
      if (smokeSprite.x < -window.innerWidth) smokeSprite.x += window.innerWidth;
      if (smokeSprite.y < -window.innerHeight) smokeSprite.y += window.innerHeight;
    });

    // Handle resize
    const handleResize = () => {
      smokeSprite.width = window.innerWidth * 2;
      smokeSprite.height = window.innerHeight * 2;
      displacementSprite.width = window.innerWidth * 2;
      displacementSprite.height = window.innerHeight * 2;
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
  window.removeEventListener("resize", handleResize);
  app?.destroy(true, { children: true, texture: true, baseTexture: true });
  initialized.current = false;
};
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none"
    />
  );
}