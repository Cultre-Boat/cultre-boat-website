"use client";

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import html2canvas from 'html2canvas';

const WaterEffect = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.zIndex = '20';
    renderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(renderer.domElement);

    async function getPageTexture(renderer) {
  const canvas = await html2canvas(document.body);
  const imgTexture = new THREE.CanvasTexture(canvas);
  imgTexture.wrapS = imgTexture.wrapT = THREE.ClampToEdgeWrapping;
  imgTexture.minFilter = THREE.LinearFilter;
  return imgTexture;
}
    // Water setup
    const waterGeometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2);
    const water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals: new THREE.TextureLoader().load('/water 0342.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      // sunColor: 0xffffff,
      waterColor: 0xffffff,
      distortionScale: 10.7,
      fog: scene.fog !== undefined,
      transparent: true,
      opacity: 0.1,
    });

    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // Camera positioning
    camera.position.set(0, 40, 0);
    camera.lookAt(0, 0, 0);

    // DOM distortion effect
    const applyDistortionToDOM = (time) => {
      // Target specific elements in ReverseStartLayout
      const elements = document.querySelectorAll(
        '.reverse-start-layout div, .reverse-start-layout img, .reverse-start-layout h1'
      );
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distortX = Math.sin((centerX / 100) + time) * 2.5;
        const distortY = Math.cos((centerY / 100) + time) * 2.5;
        const rotate = Math.sin((centerX + centerY) / 200 + time) * 0.5;

        // Apply distortion without overriding GSAP transforms
        el.style.setProperty('--distort-x', `${distortX}px`);
        el.style.setProperty('--distort-y', `${distortY}px`);
        el.style.setProperty('--distort-rotate', `${rotate}deg`);
      });
    };

    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      water.material.uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      applyDistortionToDOM(water.material.uniforms.time.value);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const newWaterGeometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2);
      water.geometry.dispose();
      water.geometry = newWaterGeometry;
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Reset custom properties
      const elements = document.querySelectorAll(
        '.reverse-start-layout div, .reverse-start-layout img, .reverse-start-layout h1'
      );
      elements.forEach((el) => {
        el.style.removeProperty('--distort-x');
        el.style.removeProperty('--distort-y');
        el.style.removeProperty('--distort-rotate');
      });
    };
  }, []);

  return <div ref={mountRef} />;
};

export default WaterEffect;