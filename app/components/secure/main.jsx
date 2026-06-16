"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera, TextureLoader, Texture } from "three";
import { EffectComposer, ShaderPass } from "@react-three/postprocessing";
// import { EffectComposer, ShaderPass } from "three/examples/jsm/postprocessing/EffectComposer";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// Custom fragment shader for water displacement effect
const displacementShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 bottomRightCorner;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 dir = uv - bottomRightCorner;
    float distance = length(dir);
    float frequency = 20.0; // Controls wave density
    float speed = 2.0;     // Controls wave speed
    float amplitude = 0.02; // Controls distortion strength
    float displacement = sin(distance * frequency - time * speed) * amplitude;
    vec2 gradient = normalize(dir) * cos(distance * frequency - time * speed) * amplitude * frequency;
    vec2 distortedUV = uv + gradient;
    distortedUV = clamp(distortedUV, 0.0, 1.0); // Prevent sampling outside texture
    vec4 color = texture2D(tDiffuse, distortedUV);
    gl_FragColor = color;
  }
`;

// Camera component to set up orthographic camera
function CameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.left = -window.innerWidth / 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = -window.innerHeight / 2;
    camera.near = 0.1;
    camera.far = 1000;
    camera.position.z = 1;
    camera.updateProjectionMatrix();
  }, [camera]);
  
  return null;
}

// Effect composer component with displacement shader
function Effects() {
  const displacementPassRef = useRef();
  
  // Update shader time uniform for continuous waves
  useFrame(({ clock }) => {
    if (displacementPassRef.current) {
      displacementPassRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  return (
    <EffectComposer>
      <ShaderPass
        ref={displacementPassRef}
        args={[
          {
            fragmentShader: displacementShader,
            uniforms: {
              tDiffuse: { value: null }, // Automatically set by EffectComposer
              time: { value: 0 },
              resolution: { value: [window.innerWidth, window.innerHeight] },
              bottomRightCorner: { value: [1, 0] }, // Bottom right in UV coordinates
            },
          },
        ]}
      />
    </EffectComposer>
  );
}

// Scene content component to render images and text as WebGL planes
function SceneContent({ leftImages, rightImages, text, leftGroupRef, rightGroupRef, textRef }) {
  const { size } = useThree();
  const imageWidth = size.width * 0.35; // Matches original 35% width
  const imageHeight = imageWidth * (4 / 3); // Maintains 3/4 aspect ratio
  const gap = 20; // Spacing between images
  const leftColumnX = -size.width / 4; // Positioned left of center
  const rightColumnX = size.width / 4; // Positioned right of center

  // Load image textures
  const leftTextures = useMemo(() => 
    leftImages.map(url => new TextureLoader().load(url)),
  [leftImages]);
  
  const rightTextures = useMemo(() => 
    rightImages.map(url => new TextureLoader().load(url)),
  [rightImages]);

  // Create text texture using canvas
  const textTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 200px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, 0, 200);
    const texture = new Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [text]);

  // Create left column planes
  const leftPlanes = useMemo(() => leftTextures.map((texture, index) => {
    const geometry = new PlaneGeometry(imageWidth, imageHeight);
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);
    mesh.position.y = -index * (imageHeight + gap); // Stack upwards
    return mesh;
  }), [leftTextures, imageWidth, imageHeight, gap]);

  // Create right column planes (stacked in reverse order)
  const rightPlanes = useMemo(() => rightTextures.map((texture, index) => {
    const geometry = new PlaneGeometry(imageWidth, imageHeight);
    const material = new MeshBasicMaterial({ map: texture });
    const mesh = new Mesh(geometry, material);
    mesh.position.y = index * (imageHeight + gap); // Stack downwards
    return mesh;
  }), [rightTextures, imageWidth, imageHeight, gap]);

  // Create text plane
  const textMesh = useMemo(() => {
    const textGeometry = new PlaneGeometry(2048, 256);
    const textMaterial = new MeshBasicMaterial({ map: textTexture, transparent: true });
    return new Mesh(textGeometry, textMaterial);
  }, [textTexture]);

  // Add planes to groups
  useEffect(() => {
    // Clear previous children if any
    while (leftGroupRef.current.children.length > 0) {
      leftGroupRef.current.remove(leftGroupRef.current.children[0]);
    }
    while (rightGroupRef.current.children.length > 0) {
      rightGroupRef.current.remove(rightGroupRef.current.children[0]);
    }
    
    // Add new planes
    leftPlanes.forEach(plane => leftGroupRef.current.add(plane));
    rightPlanes.forEach(plane => rightGroupRef.current.add(plane));
    
    // Set text position
    textMesh.position.set(0, 0, 0);
    textRef.current.add(textMesh);
  }, [leftPlanes, rightPlanes, textMesh]);

  return (
    <>
      <group ref={leftGroupRef} position={[leftColumnX, 0, 0]} />
      <group ref={rightGroupRef} position={[rightColumnX, 0, 0]} />
      <group ref={textRef} />
      <CameraSetup /> {/* Include camera setup inside the Canvas */}
    </>
  );
}

// We need to import these from Three.js since we're using them inside the component
function PlaneGeometry(width, height) {
  return new THREE.PlaneGeometry(width, height);
}

function MeshBasicMaterial(props) {
  return new THREE.MeshBasicMaterial(props);
}

function Mesh(geometry, material) {
  return new THREE.Mesh(geometry, material);
}

// Main component
export default function ReverseStartLayout() {
  const containerRef = useRef();
  const leftGroupRef = useRef(new THREE.Group());
  const rightGroupRef = useRef(new THREE.Group());
  const textRef = useRef(new THREE.Group());

  // Image arrays (converted from objects to arrays for simplicity)
  const leftImages = [
    "/image1.jpg",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image1.jpg",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image1.jpg",
  ];

  const rightImages = [
    "/image4.jpg",
    "/image2.jpg",
    "/image2.jpg",
    "/image4.jpg",
    "/image4.jpg",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image2.jpg",
  ];

  // Set up GSAP animations
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const windowHeight = window.innerHeight;
    const maxScrollDistance = isMobile ? 3000 : 6000;
    const initialLeftOffset = windowHeight * (isMobile ? 3 : 5);
    const initialRightOffset = windowHeight * (isMobile ? 0.5 : 0.2);
    const initialLeftY = initialLeftOffset;
    const initialRightY = -maxScrollDistance - initialRightOffset;
    const initialTextX = window.innerWidth * 2.5; // Matches original 250vw
    const finalTextX = -window.innerWidth * 0.5;  // Matches original -50vw

    // Set container height
    gsap.set(containerRef.current, { height: maxScrollDistance + windowHeight });

    // Animation with ScrollTrigger
    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${maxScrollDistance}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Left column moves up
          leftGroupRef.current.position.y = initialLeftY - progress * maxScrollDistance;
          // Right column moves down
          rightGroupRef.current.position.y = initialRightY + progress * (maxScrollDistance + initialRightOffset);
          // Text moves from right to left
          textRef.current.position.x = initialTextX + progress * (finalTextX - initialTextX);
        },
      },
    });

    // Handle resize
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <Canvas>
        <SceneContent
          leftImages={leftImages}
          rightImages={rightImages}
          text="DESIGN PR SOCIAL"
          leftGroupRef={leftGroupRef}
          rightGroupRef={rightGroupRef}
          textRef={textRef}
        />
        <Effects /> {/* Moved effects to its own component */}
      </Canvas>
    </div>
  );
}