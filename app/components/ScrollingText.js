"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { createRoot } from "react-dom/client";
import PixiWaterText from "./PixiWaterText";

// ✅ Correct import style for Next.js + Vercel
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

const ScrollingText = forwardRef(
  ({ designTextRef, prTextRef, socialTextRef }, ref) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const scene = sceneRef.current;
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      camera.position.z = 300;
      cameraRef.current = camera;

      const renderer = new CSS3DRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.zIndex = "20";
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const elements = [
        { text: "DESIGN", href: "/design", ref: designTextRef },
        { text: "PR", href: "/PR", ref: prTextRef },
        { text: "SOCIAL", href: "/social-scroll", ref: socialTextRef },
      ];

      const radius = 600;
      const angleStep = (2 * Math.PI) / elements.length;
      const rotationSpeed = (2 * Math.PI) / 1000; // full rotation per 1000px scroll

      elements.forEach((element, i) => {
        const div = document.createElement("div");
        div.className =
          "text-7xl md:text-9xl lg:text-9xl text-white/90 font-bellota-light transition-opacity duration-300";
        div.style.pointerEvents = "auto";
        div.style.cursor = "pointer";
        div.style.zIndex = "20";

        // Wrapper <a>
        const a = document.createElement("a");
        a.href = element.href;
        a.style.display = "inline-block";
        div.appendChild(a);

        // Mount PixiWaterText inside link
        const mountPoint = document.createElement("div");
        a.appendChild(mountPoint);

        const root = createRoot(mountPoint);
        root.render(<PixiWaterText text={element.text} />);

        if (element.ref) {
          element.ref.current = div;
        }

        const object = new CSS3DObject(div);
        const angle = i * angleStep;

        object.position.set(
          radius * Math.sin(angle),
          0,
          radius * -Math.cos(angle)
        );
        object.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(object);
      });

      // Ensure there's enough scroll space
      const ensureScrollable = () => {
        if (document.body.scrollHeight <= window.innerHeight) {
          document.body.style.height = `${window.innerHeight + 4000}px`;
        }
      };
      ensureScrollable();

      const animate = () => {
        const scrollY = window.scrollY;
        scene.rotation.y = scrollY * rotationSpeed;
        renderer.render(scene, camera);

        animationFrameId.current = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        ensureScrollable();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        style={{ perspective: "1000px", zIndex: 20, willChange: "transform" }}
      />
    );
  }
);

ScrollingText.displayName = "ScrollingText";

export default ScrollingText;
