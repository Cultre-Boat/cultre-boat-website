import { useRef, useEffect } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./waveImageShader";

export default function WaterGallery({ images, scrollVelocity }) {
  const mountRef = useRef(null);

  useEffect(() => {
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100vw";
    renderer.domElement.style.height = "100vh";
    renderer.domElement.style.zIndex = "10";
    renderer.domElement.style.pointerEvents = "none";
    mountRef.current.appendChild(renderer.domElement);

    // Load all images as textures
    const loader = new THREE.TextureLoader();
    const planes = [];
    const spacing = 1.2; // vertical spacing between images

    images.forEach((src, i) => {
      loader.load(src, (texture) => {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: 0 },
            uScrollVelocity: { value: 0 },
            uYOffset: { value: i * spacing }
          },
          vertexShader,
          fragmentShader,
          transparent: true,
        });
        const geometry = new THREE.PlaneGeometry(0.8, 1); // Adjust size as needed
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.5 - i * spacing; // Stack vertically
        scene.add(mesh);
        planes.push({ mesh, material });
      });
    });

    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      planes.forEach(({ material }, i) => {
        material.uniforms.uTime.value += 0.01;
        material.uniforms.uScrollVelocity.value = scrollVelocity;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      planes.forEach(({ mesh, material }) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        material.dispose();
      });
    };
  }, [images, scrollVelocity]);

  return <div ref={mountRef} />;
}