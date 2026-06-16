"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uScrollVelocity;
  varying vec2 vUv;

  void main() {
    float speed = clamp(uScrollVelocity * 0.3, 0.0, 1.0);
    float wave = sin(vUv.y * 15.0 + uTime * 1.5) * 0.01 * speed;
    vec2 uv = vUv + vec2(wave, 0.0);
    gl_FragColor = texture2D(uTexture, uv);
  }
`;

export default function LiquidImagesOverlay({
  selector = "[data-liquid-img]",
  scrollVelocity,
}) {
  const mountRef = useRef(null);
  const planesRef = useRef([]);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      0,
      window.innerWidth,
      window.innerHeight,
      0,
      -1000,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,        // cheaper
      powerPreference: "low-power",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.cssText =
      "position:fixed;top:0;left:0;z-index:50;pointer-events:none;";
    mountRef.current.appendChild(renderer.domElement);

    // Build planes ONCE
    const imgs = Array.from(document.querySelectorAll(selector));
    imgs.forEach((img) => {
      img.style.opacity = "0";
      const rect = img.getBoundingClientRect();
      const texture = new THREE.TextureLoader().load(img.src);
      texture.minFilter = THREE.LinearFilter;
      const geom = new THREE.PlaneGeometry(rect.width, rect.height);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
          uScrollVelocity: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.userData.domImg = img;
      scene.add(mesh);
      planesRef.current.push({ mesh, mat, img });
    });

    let frameId;
    const animate = () => {
      const vel = Math.min(scrollVelocity, 1); // clamp
      planesRef.current.forEach(({ mesh, mat }) => {
        mat.uniforms.uTime.value += 0.008;
        mat.uniforms.uScrollVelocity.value = vel;
        const r = mesh.userData.domImg.getBoundingClientRect();
        mesh.position.x = r.left + r.width / 2;
        mesh.position.y = window.innerHeight - (r.top + r.height / 2);
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.right = window.innerWidth;
      camera.top = window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      planesRef.current.forEach(({ mesh }) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, [selector, scrollVelocity]);

  return <div ref={mountRef} />;
}