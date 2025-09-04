"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export default function ReverseStartLayout() {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const textRef = useRef(null);
  const waterCanvasesRef = useRef([]);

  const leftImages = {
    1: "/image1.jpg",
    2: "/image2.jpg",
    3: "/image3.jpg",
    4: "/image4.jpg",
    5: "/image1.jpg",
    6: "/image2.jpg",
    7: "/image3.jpg",
    8: "/image4.jpg",
    9: "/image1.jpg",
  };

  const rightImages = {
    1: "/image4.jpg",
    2: "/image2.jpg",
    3: "/image2.jpg",
    4: "/image4.jpg",
    5: "/image4.jpg",
    6: "/image2.jpg",
    7: "/image3.jpg",
    8: "/image4.jpg",
    9: "/image2.jpg",
  };

  // Enhanced water effect setup for individual images
  const setupWaterEffect = (canvasElement, imageSrc, index) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasElement,
      antialias: true,
      alpha: true
    });
    
    // Set canvas size to match container
    const updateCanvasSize = () => {
      const rect = canvasElement.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    updateCanvasSize();

    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (texture) => {  
      // Add a small delay to ensure layout is ready
      setTimeout(() => {
        const canvasElement = renderer.domElement;
        const rect = canvasElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Fallback aspect ratio if layout is not ready
        const aspect = width > 0 && height > 0 ? width / height : 3 / 4;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(width, height) }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform vec2 uResolution;
            varying vec2 vUv;

            // Noise function for more natural water movement
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            float smoothNoise(vec2 p) {
                vec2 inter = smoothstep(0.0, 1.0, fract(p));
                float s = mix(noise(floor(p)), noise(floor(p) + vec2(1.0, 0.0)), inter.x);
                float n = mix(noise(floor(p) + vec2(0.0, 1.0)), noise(floor(p) + vec2(1.0, 1.0)), inter.x);
                return mix(s, n, inter.y);
            }

            float fbm(vec2 p) {
                float total = 0.0;
                float frequency = 0.01;
                float amplitude = 0.6;
                float maxValue = 0.0;
                
                for(int i = 0; i < 4; i++) {
                    total += smoothNoise(p * frequency) * amplitude;
                    maxValue += amplitude;
                    amplitude *= 0.5;
                    frequency *= 2.0;
                }
                
                return total / maxValue;
            }

            void main() {
                vec2 uv = vUv;
                
                // Create multiple wave layers for more realistic water effect
                float time = uTime * 0.8;
                
                // Primary wave motion
                float wave1 = sin(uv.x * 20.0 + time * 3.0) * 0.008;
                float wave2 = sin(uv.y * 15.0 + time * 2.0) * 0.006;
                
                // Secondary ripple effects
                float ripple1 = sin(uv.x * 40.0 + uv.y * 30.0 + time * 4.0) * 0.004;
                float ripple2 = sin(uv.x * 60.0 - uv.y * 20.0 + time * 5.0) * 0.003;
                
                // Noise-based distortion for natural water movement
                vec2 noiseInput = uv * 5.0 + time * 0.1;
                float noiseDistortion = fbm(noiseInput) * 0.01;
                
                // Circular ripples (like drops in water)
                float dist = distance(uv, uMouse);
                float ripples = sin(dist * 80.0 - time * 8.0) * exp(-dist * 8.0) * 0.006;
                
                // Combine all distortions
                vec2 distortion = vec2(
                    wave1 + ripple1 + noiseDistortion + ripples,
                    wave2 + ripple2 + noiseDistortion * 0.5 + ripples
                );
                
                // Apply refraction effect
                vec2 refractedUv = uv + distortion;
                
                // Sample the texture with distorted coordinates
                vec4 color = texture2D(uTexture, refractedUv);
                
                // Add subtle caustics effect
                float caustics = sin(uv.x * 50.0 + time * 2.0) * sin(uv.y * 50.0 + time * 2.5);
                caustics = smoothstep(0.0, 1.0, caustics * 0.5 + 0.5);
                
                // Enhance the water effect with slight color shifts
                color.rgb += caustics * 0.02;
                
                // Add subtle depth effect
                float depth = 1.0 - length(distortion) * 20.0;
                color.rgb *= depth;
                
                // Add subtle blue tint for underwater feeling
                color.rgb = mix(color.rgb, color.rgb * vec3(0.9, 0.95, 1.0), 0.1);
                
                gl_FragColor = color;
            }
          `
        });

        // Use safe aspect ratio here
        const geometry = new THREE.PlaneGeometry(2, 2 / aspect);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Mouse interaction for ripple effects
        const handleMouseMove = (event) => {
          const rect = canvasElement.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = 1.0 - (event.clientY - rect.top) / rect.height;
          material.uniforms.uMouse.value.set(x, y);
        };

        canvasElement.addEventListener('mousemove', handleMouseMove);

        function animate() {
          requestAnimationFrame(animate);
          material.uniforms.uTime.value += 0.016; // ~60fps timing
          renderer.render(scene, camera);
        }
        animate();

        // Cleanup function
        return () => {
          canvasElement.removeEventListener('mousemove', handleMouseMove);
        };
      }, 0);
    });

    // Handle resize
    const handleResize = () => {
      updateCanvasSize();
      // Update shader resolution uniform
      const rect = canvasElement.getBoundingClientRect();
      const material = scene.children[0]?.material;
      if (material && material.uniforms.uResolution) {
        material.uniforms.uResolution.value.set(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const windowHeight = window.innerHeight;

      // Adjust scroll distance for mobile
      const maxScrollDistance = isMobile ? 1800 : 4000;

      // Set container height
      gsap.set(containerRef.current, { height: maxScrollDistance + windowHeight });

      // Adjust initial offsets
      const initialLeftOffset = windowHeight * (isMobile ? 0.2 : 0.4);
      const initialRightOffset = windowHeight * (isMobile ? 0.1 : 0.2);

      // Set initial positions
      gsap.set(leftColRef.current, { y: initialLeftOffset });
      gsap.set(rightColRef.current, { y: -maxScrollDistance - initialRightOffset });

      // Left column moves up
      gsap.to(leftColRef.current, {
        y: -maxScrollDistance + initialLeftOffset,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: 1,
        },
      });

      // Right column moves down
      gsap.to(rightColRef.current, {
        y: 0 + initialRightOffset,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: 1,
        },
      });

      // Text moves from far left to far right
      gsap.set(textRef.current, {
        x: "80vw",
      });

      gsap.to(textRef.current, {
        x: "-80vw",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: 1,
        },
      });

      // Setup water effects for all canvases
      const cleanupFunctions = [];
      waterCanvasesRef.current.forEach((canvas, index) => {
        if (canvas) {
          const isLeft = index < Object.keys(leftImages).length;
          const imageKey = isLeft ? 
            Object.keys(leftImages)[index] : 
            Object.keys(rightImages)[index - Object.keys(leftImages).length];
          const imageSrc = isLeft ? leftImages[imageKey] : rightImages[imageKey];
          
          const cleanup = setupWaterEffect(canvas, imageSrc, index);
          cleanupFunctions.push(cleanup);
        }
      });

      // Text hover distortion (keeping this effect for text)
      const applyTextDistortion = (time) => {
        const h1Elements = document.querySelectorAll(
          '.reverse-start-layout h1:hover'
        );
        h1Elements.forEach((h1) => {
          const rect = h1.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const distortAmplitude = isMobile ? 3 : 6;
          const distortFrequency = 0.01;
          const distortX = Math.sin((centerX / 50) + time * distortFrequency) * distortAmplitude;
          const distortY = Math.cos((centerY / 50) + time * distortFrequency) * distortAmplitude;
          const skew = Math.sin((centerX + centerY) / 100 + time * distortFrequency) * 1;

          h1.style.setProperty('--distort-x', `${distortX}px`);
          h1.style.setProperty('--distort-y', `${distortY}px`);
          h1.style.setProperty('--distort-skew', `${skew}deg`);
          h1.style.transform = `translate(var(--distort-x), var(--distort-y)) skew(var(--distort-skew))`;
        });

        const allH1Elements = document.querySelectorAll('.reverse-start-layout h1:not(:hover)');
        allH1Elements.forEach((h1) => {
          h1.style.removeProperty('--distort-x');
          h1.style.removeProperty('--distort-y');
          h1.style.removeProperty('--distort-skew');
          h1.style.removeProperty('transform');
        });
      };

      // Animation loop for text distortion
      let frameId;
      const animateEffects = (time) => {
        frameId = requestAnimationFrame(animateEffects);
        applyTextDistortion(time / 1000);
      };
      animateEffects(0);

      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(frameId);
        cleanupFunctions.forEach(cleanup => cleanup && cleanup());
        
        // Clean up h1 properties
        const h1Elements = document.querySelectorAll('.reverse-start-layout h1');
        h1Elements.forEach((h1) => {
          h1.style.removeProperty('--distort-x');
          h1.style.removeProperty('--distort-y');
          h1.style.removeProperty('--distort-skew');
          h1.style.removeProperty('transform');
        });
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden reverse-start-layout">
      {/* Left Column */}
      <div
        ref={leftColRef}
        className="fixed top-0 w-[42%] md:w-[35%] flex flex-col gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4"
        style={{
          left: "50%",
          transform: "translateX(-100%)",
          marginLeft: "-2%",
        }}
      >
        {Object.entries(leftImages).map(([key, src], index) => (
          <div
            key={`left-${key}`}
            className="w-full aspect-[3/4] relative mb-10 md:mb-32"
          >
            <canvas
              ref={el => waterCanvasesRef.current[index] = el}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div
        ref={rightColRef}
        className="fixed top-0 w-[42%] md:w-[35%] flex flex-col-reverse gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4"
        style={{
          left: "50%",
          transform: "translateX(4%)",
          marginRight: "-2%",
        }}
      >
        {Object.entries(rightImages).map(([key, src], index) => (
          <div
            key={`right-${key}`}
            className="w-full aspect-[3/4] relative mb-10 md:mb-32"
          >
            <canvas
              ref={el => waterCanvasesRef.current[Object.keys(leftImages).length + index] = el}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
          </div>
        ))}
      </div>

      {/* Center Text */}
      <div
        ref={textRef}
        className="fixed gap-10 top-1/2 transform -translate-y-1/2 flex md:gap-60 whitespace-nowrap"
      >
        <h1 className="text-7xl md:text-9xl lg:text-9xl opacity-50 active:opacity-80 focus:opacity-80 transition-opacity hover:opacity-100 font-thin text-white/90 tracking-tighter">
          <a href="/design">DESIGN</a>
        </h1>
        <h1 className="text-7xl md:text-9xl lg:text-9xl opacity-50 active:opacity-80 focus:opacity-80 transition-opacity hover:opacity-100 font-thin text-white/90 tracking-tighter">
          <a href="/PR">PR</a>
        </h1>
        <h1 className="text-7xl md:text-9xl lg:text-9xl opacity-50 active:opacity-80 focus:opacity-80 transition-opacity hover:opacity-100 font-thin text-white/90 tracking-tighter">
          <a href="/social-scroll">SOCIAL</a>
        </h1>
      </div>
    </div>
  );
}