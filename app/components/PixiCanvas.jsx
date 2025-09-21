"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function PixiCanvas({
  src,
  alt,
  displacementImage,
  className,
  autoPlaySpeed = [0, 6],
  priority, // just to match <Image />, not used
}) {
  const canvasWrapperRef = useRef(null);

  useEffect(() => {
    if (!src || !displacementImage) return;

    // Load main texture first
    const texture = PIXI.Texture.from(src);

    const onTextureLoaded = () => {
      const imgWidth = texture.width;
      const imgHeight = texture.height;

      // Create renderer with natural image size
      const renderer = new PIXI.Renderer({
        width: imgWidth,
        height: imgHeight,
        backgroundAlpha: 0,
      });

      const stage = new PIXI.Container();

      // Main image sprite
      const sprite = new PIXI.Sprite(texture);
      sprite.width = imgWidth;
      sprite.height = imgHeight;
      sprite.anchor.set(0);
      stage.addChild(sprite);

      // Displacement sprite
      const displacementSprite = PIXI.Sprite.from(displacementImage);
      displacementSprite.texture.baseTexture.wrapMode =
        PIXI.WRAP_MODES.REPEAT;
      displacementSprite.anchor.set(0.5);
      displacementSprite.x = imgWidth / 2;
      displacementSprite.y = imgHeight / 2;
      displacementSprite.scale.set(Math.max(imgWidth / 256, imgHeight / 256));
      stage.addChild(displacementSprite);

      const displacementFilter = new PIXI.filters.DisplacementFilter(
        displacementSprite
      );
      displacementFilter.scale.set(Math.min(imgWidth, imgHeight) * 0.05);
      stage.filters = [displacementFilter];

      // Animate displacement
      const ticker = new PIXI.Ticker();
      ticker.add((delta) => {
        displacementSprite.x += autoPlaySpeed[0] * delta;
        displacementSprite.y += autoPlaySpeed[1] * delta;
        renderer.render(stage);
      });

      // Attach canvas
      const wrapper = canvasWrapperRef.current;
      if (wrapper) {
        while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
        wrapper.appendChild(renderer.view);

        // Force renderer resize to natural size
        renderer.resize(imgWidth, imgHeight);

        // Responsive scaling handled by CSS
        renderer.view.style.width = "100%";
        renderer.view.style.height = "auto";
        renderer.view.style.display = "block";

        // Start ticker only after canvas is mounted
        requestAnimationFrame(() => ticker.start());
      }

      // Resize on window resize (for mobile rotation)
      const handleResize = () => {
        if (wrapper) {
          renderer.resize(imgWidth, imgHeight);
          renderer.view.style.width = "100%";
          renderer.view.style.height = "auto";
        }
      };
      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        ticker.stop();
        ticker.destroy();
        stage.destroy({ children: true, texture: true, baseTexture: true });
        renderer.destroy(true);
        window.removeEventListener("resize", handleResize);
      };
    };

    if (texture.baseTexture.valid) {
      // Already loaded
      onTextureLoaded();
    } else {
      texture.baseTexture.once("loaded", onTextureLoaded);
    }
  }, [src, displacementImage, autoPlaySpeed]);

  return (
    <div
      ref={canvasWrapperRef}
      className={className} // example: "w-full h-auto opacity-90"
      role="img"
      aria-label={alt}
    />
  );
}
