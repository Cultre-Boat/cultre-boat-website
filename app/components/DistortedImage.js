"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uImage;
  uniform sampler2D uDisplacement;
  uniform float uScrollVelocity;
  varying vec2 vUv;

  void main() {
    vec2 displacement = texture2D(uDisplacement, vUv).rg * 2.0 - 1.0;
    vec2 distortedUv = vUv + displacement * uScrollVelocity * 0.05;
    gl_FragColor = texture2D(uImage, distortedUv);
  }
`;

const DistortedImage = ({ imageUrl, displacementUrl, scrollVelocity }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const uImage = loader.load(imageUrl);
    const uDisplacement = loader.load(displacementUrl);
    uImage.wrapS = uImage.wrapT = THREE.MirroredRepeatWrapping;
    uDisplacement.wrapS = uDisplacement.wrapT = THREE.MirroredRepeatWrapping;

    const geometry = new THREE.PlaneGeometry(1.5, 1); // adjust as needed
    const uniforms = {
      uImage: { value: uImage },
      uDisplacement: { value: uDisplacement },
      uScrollVelocity: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      uniforms.uScrollVelocity.value = scrollVelocity;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [imageUrl, displacementUrl, scrollVelocity]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default DistortedImage;
