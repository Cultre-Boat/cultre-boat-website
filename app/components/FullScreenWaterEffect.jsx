// "use client";

// import { useEffect, useRef } from "react";
// import * as PIXI from "pixi.js";

// export default function FullScreenScreenWaterEffect() {
//   const canvasRef = useRef(null);
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (!canvasRef.current || initialized.current || typeof window === 'undefined') return;
//     initialized.current = true;

//     let app;
//     if (canvasRef.current) {
//       app = new PIXI.Application({
//         view: canvasRef.current,
//         resizeTo: window,
//         backgroundColor: 0x1a1a1a,
//         backgroundAlpha: 0,
//         resolution: Math.max(1, window.devicePixelRatio || 1),
//         autoDensity: true,
//       });
//     }

//     if (typeof window !== 'undefined') {
//       app.renderer.resize(window.innerWidth, window.innerHeight);
//     }

//     const container = new PIXI.Container();
//     app.stage.addChild(container);

//     const smokeTextureUrl = "/water14copy2.png";
//     const fallbackSmokeTexture = "https://i.imgur.com/5jXz7Yv.png";
//     const smokeSprite = PIXI.Sprite.from(smokeTextureUrl);

//     smokeSprite.texture.baseTexture.on("error", () => {
//       console.error("Smoke texture failed to load, using fallback");
//       smokeSprite.texture = PIXI.Texture.from(fallbackSmokeTexture);
//     });

//     smokeSprite.width = window.innerWidth * 2;
//     smokeSprite.height = window.innerHeight * 2;
//     smokeSprite.alpha = 0.4;
//     smokeSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
//     container.addChild(smokeSprite);

//     const colorMatrix = new PIXI.filters.ColorMatrixFilter();
//     smokeSprite.filters = [colorMatrix];
//     colorMatrix.contrast(0.5, false);

//     const displacementMapUrl = "/water3.jpg";
//     const fallbackDisplacementMap = "https://i.imgur.com/3PTiU4U.jpg";
//     const displacementSprite = PIXI.Sprite.from(displacementMapUrl);

//     displacementSprite.texture.baseTexture.on("error", () => {
//       console.error("Displacement map failed to load, using fallback");
//       displacementSprite.texture = PIXI.Texture.from(fallbackDisplacementMap);
//     });

//     displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
//     displacementSprite.scale.set(0.3);
//     displacementSprite.alpha = 0;
//     displacementSprite.width = window.innerWidth * 2;
//     displacementSprite.height = window.innerHeight * 2;

//     const displacementColorMatrix = new PIXI.filters.ColorMatrixFilter();
//     displacementSprite.filters = [displacementColorMatrix];
//     displacementColorMatrix.contrast(1.2, false);

//     const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
//     displacementFilter.scale.set(40, 40);

//     app.stage.addChild(displacementSprite);
//     container.filters = [displacementFilter];

//     app.ticker.add(() => {
//       displacementSprite.x += 2;
//       displacementSprite.y += 1.5;
//       smokeSprite.x -= 1;
//       smokeSprite.y -= 0.5;
//       if (displacementSprite.x > window.innerWidth) displacementSprite.x -= window.innerWidth;
//       if (displacementSprite.y > window.innerHeight) displacementSprite.y -= window.innerHeight;
//       if (smokeSprite.x < -window.innerWidth) smokeSprite.x += window.innerWidth;
//       if (smokeSprite.y < -window.innerHeight) smokeSprite.y += window.innerHeight;
//     });

//     const handleResize = () => {
//       if (typeof window !== 'undefined') {
//         smokeSprite.width = window.innerWidth * 2;
//         smokeSprite.height = window.innerHeight * 2;
//         displacementSprite.width = window.innerWidth * 2;
//         displacementSprite.height = window.innerHeight * 2;
//         app.renderer.resize(window.innerWidth, window.innerHeight);
//       }
//     };
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       app?.destroy(true, { children: true, texture: true, baseTexture: true });
//       initialized.current = false;
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none"
//     />
//   );
// }


"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function FullScreenScreenWaterEffect() {
  const canvasRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || initialized.current || typeof window === 'undefined') return;
    initialized.current = true;

    let app;
    if (canvasRef.current) {
      app = new PIXI.Application({
        view: canvasRef.current,
        resizeTo: window,
        backgroundColor: 0x1a1a1a,
        backgroundAlpha: 0,
        resolution: Math.max(1, window.devicePixelRatio || 1),
        autoDensity: true,
      });
    }

    if (typeof window !== 'undefined') {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    const container = new PIXI.Container();
    app.stage.addChild(container);

    // --- All smokeSprite and smokeTexture code has been removed ---

    const displacementMapUrl = "/water7.png";
    const fallbackDisplacementMap = "https://i.imgur.com/3PTiU4U.jpg";
    const displacementSprite = PIXI.Sprite.from(displacementMapUrl);

    displacementSprite.texture.baseTexture.on("error", () => {
      console.error("Displacement map failed to load, using fallback");
      displacementSprite.texture = PIXI.Texture.from(fallbackDisplacementMap);
    });

    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.3);
    displacementSprite.alpha = 0; // This sprite is invisible and only used as a filter map
    displacementSprite.width = window.innerWidth * 2;
    displacementSprite.height = window.innerHeight * 2;

    const displacementColorMatrix = new PIXI.filters.ColorMatrixFilter();
    displacementSprite.filters = [displacementColorMatrix];
    displacementColorMatrix.contrast(1.2, false);

    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(40, 40);

    app.stage.addChild(displacementSprite);
    
    // Note: The filter is now being applied to an empty container.
    container.filters = [displacementFilter];

    app.ticker.add(() => {
      displacementSprite.x += 2;
      displacementSprite.y += 1.5;
      // smokeSprite animation logic removed
      if (displacementSprite.x > window.innerWidth) displacementSprite.x -= window.innerWidth;
      if (displacementSprite.y > window.innerHeight) displacementSprite.y -= window.innerHeight;
    });

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        // smokeSprite resize logic removed
        displacementSprite.width = window.innerWidth * 2;
        displacementSprite.height = window.innerHeight * 2;
        app.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      app?.destroy(true, { children: true, texture: true, baseTexture: true });
      initialized.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[0] pointer-events-none opacity-30"
    />
  );
}