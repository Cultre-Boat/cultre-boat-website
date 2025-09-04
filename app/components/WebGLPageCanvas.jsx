// components/WebGLPageCanvas.jsx
"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

// Vertex shader
const vs = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader - this is the core of the effect.
// It directly distorts the screen pixels behind the canvas.
const fs = `
  uniform sampler2D uWaterTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollVelocity;
  uniform vec2 uResolution;

  varying vec2 vUv;
  
  // This is the key: we get the pixel coordinate of the current fragment
  // and use it to sample the screen's content.
  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.1;
    
    // Sample the normal map with time offsets for animated ripples
    vec2 ripple = texture2D(uWaterTexture, uv + vec2(time * 0.1, time * 0.1)).rg * 1.5 - 1.0;

    // Scroll and mouse intensity
    float scrollFactor = clamp(abs(uScrollVelocity) * 0.02, 0.0, 1.0);
    float mouseEffect = exp(-pow(distance(uv, uMouse) * 3.0, 1.0)) * 0.02;

    // Final displacement strength
    float strength = 0.01 + scrollFactor * 0.02 + mouseEffect;
    vec2 distortedUv = uv + ripple * strength;

    // The distortion effect is applied to the screen's background.
    // We cannot sample the DOM directly in WebGL. Instead, we render a
    // colored, semi-transparent layer that gives the ILLUSION of distortion.
    
    vec3 waterColor = vec3(0.2, 0.3, 1.0); // A light blue tint
    float displacementMagnitude = length(ripple * strength);

    // Create a subtle refraction effect by adjusting brightness based on displacement.
    vec3 finalColor = waterColor * displacementMagnitude * 10.0;

    // Use a low alpha value to ensure the DOM content is visible
    gl_FragColor = vec4(finalColor, 0.1);
  }
`;

export default function WebGLPageCanvas({
  waterNormalMap = "/water-neww.jpg",
  pixelRatioLimit = 2,
}) {
  const mountRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const stateRef = useRef({
    lastScroll: 0,
    lastTime: 0,
    scrollVel: 0,
    mouse: new THREE.Vector2(0.5, 0.5),
  });

  useEffect(() => {
    let mounted = true;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioLimit));
    renderer.setSize(W, H);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const loader = new TextureLoader();
    const waterTex = loader.load(waterNormalMap);
    waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;

    const shaderMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        tDiffuse: { value: null },
        uWaterTexture: { value: waterTex },
        uTime: { value: 0 },
        uMouse: { value: stateRef.current.mouse },
        uScrollVelocity: { value: 0 },
        uResolution: { value: new THREE.Vector2(W, H) },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    scene.add(quad);

    const animate = () => {
      if (!mounted) return;

      const t = clockRef.current.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = t;

      // Scroll velocity
      const now = performance.now();
      const currentScroll = window.scrollY || 0;
      const dt = Math.max(16, now - stateRef.current.lastTime);
      const v = (currentScroll - stateRef.current.lastScroll) / dt;
      stateRef.current.scrollVel = THREE.MathUtils.lerp(stateRef.current.scrollVel, v, 0.1);
      shaderMaterial.uniforms.uScrollVelocity.value = stateRef.current.scrollVel;

      renderer.render(scene, camera);

      stateRef.current.lastScroll = currentScroll;
      stateRef.current.lastTime = now;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const onPointer = (e) => {
      stateRef.current.mouse.x = e.clientX / window.innerWidth;
      stateRef.current.mouse.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointer);

    const onResize = () => {
      if (!mounted) return;
      const W2 = window.innerWidth;
      const H2 = window.innerHeight;
      renderer.setSize(W2, H2);
      shaderMaterial.uniforms.uResolution.value.set(W2, H2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      try {
        mountRef.current.removeChild(renderer.domElement);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
      renderer.dispose();
    };
  }, [waterNormalMap, pixelRatioLimit]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    />
  );
}