"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const VFXCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Transparent background
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Effect composer for post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Water-like shader
    const waterShader = {
      uniforms: {
        tDiffuse: { value: null }, // Input from previous pass
        time: { value: 0 },
        intensity: { value: 0.3 }, // Matches your desired intensity
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float intensity;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          // Simple water ripple effect
          float ripple = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time) * intensity;
          uv += vec2(ripple, ripple) * 0.02;
          gl_FragColor = texture2D(tDiffuse, uv);
        }
      `,
    };

    const waterPass = new ShaderPass(waterShader);
    composer.addPass(waterPass);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.05;
      waterPass.uniforms.time.value = time;
      composer.render();
      requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      composer.passes.forEach((pass) => pass.dispose());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
};

export default VFXCanvas;