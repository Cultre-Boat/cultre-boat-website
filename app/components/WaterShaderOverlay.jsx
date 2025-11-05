"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WaterShaderOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Water distortion shader
    const waterShader = {
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Simple noise function
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv;
          
          // Create highly visible wave patterns
          float wave1 = sin(uv.x * 20.0 + uTime * 1.5) * 0.04;
          float wave2 = sin(uv.y * 18.0 + uTime * 1.2) * 0.04;
          float wave3 = sin((uv.x + uv.y) * 15.0 + uTime * 1.8) * 0.03;
          
          // Strong noise for organic water movement
          float n = noise(uv * 8.0 + uTime * 0.3) * 0.05;
          
          // Combine waves for distortion
          vec2 distortion = vec2(wave1 + wave3 + n, wave2 + wave3 + n);
          
          // Create strong light refraction effect (caustics) - underwater light patterns
          float caustics = sin(uv.x * 40.0 + uTime * 2.0) * sin(uv.y * 35.0 + uTime * 1.5) * 0.3;
          caustics += sin(uv.x * 50.0 - uTime * 1.8) * cos(uv.y * 45.0 + uTime * 2.2) * 0.25;
          caustics += noise((uv + distortion) * 12.0 + uTime * 0.4) * 0.4;
          
          // Water shimmer/sparkle effect
          float shimmer = noise(uv * 15.0 + uTime * 0.5) * 0.35;
          shimmer += sin(uv.x * 60.0 + uTime * 3.0) * 0.15;
          
          // Blue-white water tint with stronger color
          vec3 waterColor = vec3(0.5, 0.75, 1.0);
          vec3 lightColor = vec3(1.0, 1.0, 0.95); // Warm light
          vec3 finalColor = mix(waterColor, lightColor, caustics + shimmer);
          
          // Much higher alpha for visibility
          float alpha = 0.25 + abs(caustics) * 0.5 + shimmer * 0.3;
          gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.7));
        }
      `,
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(waterShader);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    let animationId;
    let time = 0;
    const animate = () => {
      time += 0.01;
      material.uniforms.uTime.value = time;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[2] pointer-events-none"
      style={{ mixBlendMode: 'soft-light', opacity: 0.9 }}
    />
  );
}

