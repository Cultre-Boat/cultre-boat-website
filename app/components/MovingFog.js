// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// export default function MovingFog() {
//   const containerRef = useRef(null);
//   const fogLayers = useRef([]);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Create multiple fog layers for depth
//       const createFogLayer = (index) => {
//         const fogElement = document.createElement("div");
//         fogElement.className = `fog-layer fog-layer-${index}`;

//         // Different sizes and opacities for layered effect
//         const sizes = ["120%", "140%", "160%", "180%"];
//         const opacities = [0.85, 0.72, 0.48, 0.25];
//         const speeds = [20, 25, 30, 35];

//         fogElement.style.cssText = `
//           position: absolute;
//           width: ${sizes[index % sizes.length]};
//           height: ${sizes[index % sizes.length]};
//           background: radial-gradient(ellipse at center, rgba(100, 100, 120, ${opacities[index % opacities.length]}) 0%, rgba(80, 80, 100, ${opacities[index % opacities.length] * 0.7}) 30%, transparent 70%);
//           border-radius: 50%;
//           filter: blur(${40 + index * 10}px);
//           pointer-events: none;
//           will-change: transform;
//         `;

//         containerRef.current.appendChild(fogElement);
//         fogLayers.current.push(fogElement);

//         // Position fog initially off-screen (bottom-right)
//         gsap.set(fogElement, {
//           x: window.innerWidth + 200,
//           y: window.innerHeight + 200,
//           scale: 0.5 + index * 0.2,
//           rotation: Math.random() * 360
//         });

//         // Animate fog movement from bottom-right to top-left
//         gsap.to(fogElement, {
//           x: -400 - index * 100,
//           y: -400 - index * 100,
//           duration: speeds[index % speeds.length],
//           ease: "none",
//           repeat: -1,
//           repeatDelay: 0,
//           rotation: "+=180"
//         });

//         // Subtle scale animation for breathing effect
//         gsap.to(fogElement, {
//           scale: (0.7 + index * 0.2),
//           duration: 8 + index * 2,
//           ease: "sine.inOut",
//           repeat: -1,
//           yoyo: true,
//           delay: index * 1.5
//         });
//       };

//       // Create 6 fog layers for rich effect
//       for (let i = 0; i < 6; i++) {
//         createFogLayer(i);
//       }

//       // Handle resize
//       const handleResize = () => {
//         fogLayers.current.forEach((fog, index) => {
//           gsap.set(fog, {
//             x: window.innerWidth + 200,
//             y: window.innerHeight + 200
//           });
//         });
//       };

//       window.addEventListener("resize", handleResize);

//       return () => {
//         window.removeEventListener("resize", handleResize);
//       };

//     }, containerRef);

//     return () => {
//       ctx.revert();
//       // Clean up fog elements
//       fogLayers.current.forEach(fog => {
//         if (fog.parentNode) {
//           fog.parentNode.removeChild(fog);
//         }
//       });
//       fogLayers.current = [];
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 w-full h-full pointer-events-none z-0"
//       style={{
//         background: "#000",
//         overflow: "hidden"
//       }}
//     />
//   );
// }

import React from "react";
const MovingFog = () => {
  return (
    <>
      <style>{`
                .fogwrapper {
                    height: 100vh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: 0;
                    overflow: hidden;
                    z-index: -1;
                    background: #000;
                    -webkit-filter: blur(1px) brightness(1);
                    filter: blur(1px) brightness(1);
                    pointer-events: none;
                }

                #foglayer_01, #foglayer_02, #foglayer_03 {
                    height: 100%;
                    position: absolute;
                    width: 200%;
                }

                #foglayer_01 .image01, #foglayer_01 .image02,
                #foglayer_02 .image01, #foglayer_02 .image02,
                #foglayer_03 .image01, #foglayer_03 .image02 {
                    float: left;
                    height: 100%;
                    width: 50%;
                }

                /* Animation Assignments */
                #foglayer_01 {
                    -webkit-animation: foglayer_01_opacity 10s linear infinite, foglayer_moveme 30s linear infinite;
                    -moz-animation: foglayer_01_opacity 10s linear infinite, foglayer_moveme 30s linear infinite;
                    animation: foglayer_01_opacity 10s linear infinite, foglayer_moveme 30s linear infinite;
                }
                #foglayer_02 {
                    -webkit-animation: foglayer_02_opacity 21s linear infinite, foglayer_moveme 26s linear infinite;
                    -moz-animation: foglayer_02_opacity 21s linear infinite, foglayer_moveme 26s linear infinite;
                    animation: foglayer_02_opacity 21s linear infinite, foglayer_moveme 26s linear infinite;
                }
                #foglayer_03 {
                    -webkit-animation: foglayer_03_opacity 21s linear infinite, foglayer_moveme 26s linear infinite;
                    -moz-animation: foglayer_03_opacity 21s linear infinite, foglayer_moveme 26s linear infinite;
                    animation: foglayer_03_opacity 21s linear infinite, foglayer_moveme 26s linear infinite;
                }

                /* ---------- Background Images ---------- */
                #foglayer_01 .image01, #foglayer_01 .image02 {
                    background: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog1.png") center center/cover no-repeat transparent;
                }
                #foglayer_02 .image01, #foglayer_02 .image02,
                #foglayer_03 .image01, #foglayer_03 .image02 {
                    background: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png") center center/cover no-repeat transparent;
                }

                /* ---------- Keyframe Animations ---------- */
                
                /* CHANGED: Decreased opacity values for a lighter fog */
                @keyframes foglayer_01_opacity { 0% { opacity: .2; } 22% { opacity: .4; } 40% { opacity: .6; } 58% { opacity: .5; } 80% { opacity: .3; } 100% { opacity: .1; } }

                /* CHANGED: Decreased opacity values for a lighter fog */
                @keyframes foglayer_02_opacity { 0% { opacity: .8; } 25% { opacity: .6; } 50% { opacity: .4; } 80% { opacity: .2; } 100% { opacity: .1; } }
                
                /* CHANGED: Decreased opacity values for a lighter fog */
                @keyframes foglayer_03_opacity { 0% { opacity: .7; } 27% { opacity: .5; } 52% { opacity: .3; } 68% { opacity: .3; } 100% { opacity: .5; } }

                /* Keyframes for Movement */
                @keyframes foglayer_moveme { 0% { left: 0; } 100% { left: -100%; } }

                /* (Vendor-prefixed keyframes are omitted for brevity but should be included for full browser support) */
            `}</style>

      <div className="fogwrapper">
        <div id="foglayer_01" className="fog">
          <div className="image01"></div>
          <div className="image02"></div>
        </div>
        <div id="foglayer_02" className="fog">
          <div className="image01"></div>
          <div className="image02"></div>
        </div>
        <div id="foglayer_03" className="fog">
          <div className="image01"></div>
          <div className="image02"></div>
        </div>
      </div>
    </>
  );
};

export default MovingFog;
