"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import html2canvas from "html2canvas";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uPageTexture;
  uniform sampler2D uWaterNormals;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Sample water normal map with some movement
    vec2 ripple = texture2D(uWaterNormals, vUv * 5.0 + vec2(uTime * 0.1, uTime * 0.1)).rg;
    ripple = ripple * 2.0 - 1.0; // remap from [0,1] to [-1,1]

    // Distort UV coords for the page texture
    vec2 distortedUv = vUv + ripple * 0.03;

    // Sample the page texture with distorted coords
    vec4 color = texture2D(uPageTexture, distortedUv);

    gl_FragColor = color;
  }
`;

export default function WaterDistortionOverlay() {
  const mountRef = useRef(null);
  const [renderer, setRenderer] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [material, setMaterial] = useState(null);
  const [pageTexture, setPageTexture] = useState(null);

  // Capture the page into a texture
  const capturePageTexture = async (rendererInstance) => {
    const canvas = await html2canvas(document.body, {
      logging: false,
      useCORS: true,
      backgroundColor: null,
      scale: window.devicePixelRatio,
    });
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup renderer
    const rendererInstance = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererInstance.setSize(window.innerWidth, window.innerHeight);
    rendererInstance.setPixelRatio(window.devicePixelRatio);
    rendererInstance.domElement.style.position = "fixed";
    rendererInstance.domElement.style.top = 0;
    rendererInstance.domElement.style.left = 0;
    rendererInstance.domElement.style.width = "100vw";
    rendererInstance.domElement.style.height = "100vh";
    rendererInstance.domElement.style.pointerEvents = "none";
    rendererInstance.domElement.style.zIndex = 9999; // on top
    mountRef.current.appendChild(rendererInstance.domElement);

    // Setup camera and scene
    const cameraInstance = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sceneInstance = new THREE.Scene();

    // Create plane geometry fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Load water normal map texture
    const waterNormals = new THREE.TextureLoader().load("/water 0342.jpg");
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    // Shader material
    const materialInstance = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPageTexture: { value: null },
        uWaterNormals: { value: waterNormals },
        uTime: { value: 0 },
      },
    });

    const mesh = new THREE.Mesh(geometry, materialInstance);
    sceneInstance.add(mesh);

    // Save instances in state for animation
    setRenderer(rendererInstance);
    setCamera(cameraInstance);
    setScene(sceneInstance);
    setMaterial(materialInstance);

    // Initial page texture capture
    capturePageTexture(rendererInstance).then((tex) => {
      materialInstance.uniforms.uPageTexture.value = tex;
      setPageTexture(tex);
    });

    // Cleanup on unmount
    return () => {
      rendererInstance.dispose();
      mountRef.current.removeChild(rendererInstance.domElement);
    };
  }, []);

  // Animate and update page texture every 3 seconds
  useEffect(() => {
    if (!renderer || !scene || !camera || !material) return;

    let frameId;
    let lastCaptureTime = 0;
    const captureInterval = 3000; // ms

    const animate = (time) => {
      frameId = requestAnimationFrame(animate);

      material.uniforms.uTime.value = time * 0.001;

      // Update page texture every 3 seconds to reflect changes
      if (time - lastCaptureTime > captureInterval) {
        lastCaptureTime = time;
        capturePageTexture(renderer).then((tex) => {
          // Dispose old texture to avoid memory leak
          if (material.uniforms.uPageTexture.value) {
            material.uniforms.uPageTexture.value.dispose();
          }
          material.uniforms.uPageTexture.value = tex;
          setPageTexture(tex);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => cancelAnimationFrame(frameId);
  }, [renderer, scene, camera, material]);

  return <div ref={mountRef} />;
}
