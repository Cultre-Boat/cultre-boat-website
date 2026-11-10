"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import { createRoot } from "react-dom/client"; // ✅ import moved to top
import PixiWaterText from "./PixiWaterText";   // ✅ import moved to top

const ScrollingText = forwardRef(
  ({ designTextRef, prTextRef, socialTextRef }, ref) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
      // Captured now: React 19 Strict Mode detaches refs before running cleanup in dev,
      // so reading containerRef.current there would give null and leave the old renderer behind.
      const container = containerRef.current;
      if (!container) return;

      const isMobile = window.innerWidth <= 768; // Define mobile breakpoint
      // A fresh scene per mount. Re-using one across mounts (React Strict Mode mounts twice
      // in dev) left the first set of words in it, duplicated and broken.
      const scene = new THREE.Scene();
      const roots = [];
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      camera.position.z = isMobile ? 350 : 300; // Closer camera on mobile to make text smaller
      cameraRef.current = camera;

      const renderer = new CSS3DRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.zIndex = "20";
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const elements = [
        { text: "DESIGN", href: "/design", ref: designTextRef },
        { text: "PR", href: "/PR", ref: prTextRef },
        { text: "SOCIAL", href: "/social-scroll", ref: socialTextRef },
      ];

const radius = isMobile ? 300 : 600; // Reduced radius on mobile for closer word spacing
      const objects = [];
      const angleStep = (2 * Math.PI) / elements.length; // Angle between elements
      const rotationSpeed = (2 * Math.PI) / 1000; // Full rotation per 1000px scroll

      // Create only one set of elements
      elements.forEach((element, i) => {
        const div = document.createElement("div");
        div.className = `text-${isMobile ? "4xl" : "7xl"} md:text-9xl lg:text-9xl text-white/90 transition-opacity duration-300`;
        div.style.borderRadius = "10px";
        div.style.pointerEvents = "auto";
        div.style.cursor = "pointer";
        div.style.zIndex = "20";

        // Wrapper <a> for link
        const a = document.createElement("a");
        a.href = element.href;
        a.style.display = "inline-block";
        div.appendChild(a);

        // Mount PixiWaterText into this link
        const mountPoint = document.createElement("div");
        a.appendChild(mountPoint);

        const root = createRoot(mountPoint);
        root.render(<PixiWaterText text={element.text} />);
        roots.push(root);

        // Assign ref
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
        objects.push(object);
      });

      // Fallback height so the home page can scroll. Remember we set it so it can be
      // removed on unmount; otherwise <body> keeps this height on every other page.
      let setBodyHeight = false;
      const ensureScrollable = () => {
        if (document.body.scrollHeight <= window.innerHeight) {
          document.body.style.height = `${window.innerHeight + 4000}px`;
          setBodyHeight = true;
        }
      };
      ensureScrollable();

      const animate = () => {
        const scrollY = window.scrollY;
        scene.rotation.y = scrollY * rotationSpeed;
        
        // Hide text that's not facing the camera (on mobile only)
        if (isMobile) {
          objects.forEach((object) => {
            // Get the object's world position
            const worldPos = new THREE.Vector3();
            object.getWorldPosition(worldPos);
            
            // Calculate angle between object and camera
            const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            const objDir = worldPos.clone().normalize();
            const dot = cameraDir.dot(objDir);
            
            // Show only if facing camera (dot > 0.3 means roughly facing forward)
            if (dot > 0.3) {
              object.element.style.display = 'block';
              object.element.style.opacity = '0.9';
              
              // CURVED PATH EFFECT: Bigger on sides, smaller at center
              const normalizedDot = (dot - 0.3) / 0.7; // Map 0.3-1.0 to 0-1
              const scaleFactor = 1.2 - normalizedDot * 0.6; // 1.2 at sides → 0.8 at center
              
              // Use THREE.js scale (not CSS transform to avoid conflicts)
              object.scale.set(scaleFactor, scaleFactor, 1);
            } else {
              object.element.style.opacity = '0';
              object.element.style.display = 'none';
              object.scale.set(1, 1, 1); // Reset scale
            }
          });
        }
        
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
        if (setBodyHeight) {
          document.body.style.height = "";
        }
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        objects.forEach((object) => {
          scene.remove(object);
          object.element.remove();
        });
        // Unmount after the current render finishes (React warns on synchronous unmount here).
        setTimeout(() => roots.forEach((root) => root.unmount()));
        renderer.domElement.remove();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none "
        style={{ perspective: "1000px", zIndex: 20, willChange: "transform" }}
      />
    );
  }
);

ScrollingText.displayName = "ScrollingText";

export default ScrollingText;
