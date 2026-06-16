// components/CurvedText3D.js
import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei'; // We'll use Plane for individual text textures
import { CanvasTexture, MeshStandardMaterial, FrontSide } from 'three';

// Define your text content
const TEXT_CONTENT = [
  { id: 'design', text: 'DESIGN' },
  { id: 'pr', text: 'PR' },
  { id: 'social', text: 'SOCIAL' },
  { id: 'creative', text: 'CREATIVE' },
  { id: 'branding', text: 'BRANDING' },
  { id: 'digital', text: 'DIGITAL' },
  { id: 'strategy', text: 'STRATEGY' },
  { id: 'marketing', text: 'MARKETING' },
  // Add more words to create a continuous "belt" that can rotate
  { id: 'innovation', text: 'INNOVATION' },
  { id: 'experience', text: 'EXPERIENCE' },
];

// Configuration for text appearance and curve
const TEXT_SETTINGS = {
  fontSize: 120, // Base font size for canvas rendering
  resolutionMultiplier: 2, // For texture quality (e.g., 2 for 2x resolution)
  textScaleFactor: 0.015, // Multiplier for the 3D plane size
  curveRadius: 5, // Radius of the virtual cylinder/hemisphere
  curveArcDegrees: 180, // How many degrees of the curve the text belt spans (e.g., 180 for a half-circle)
  scrollRotationDegrees: 720, // Total degrees of rotation for the text group over full scroll (e.g., 360 or 720)
  horizontalTravelUnits: 16, // Total horizontal distance the text group travels in 3D units
  startOffsetX: 8, // Starting X offset for the text group
};

function CurvedTextScene({ scrollProgress }) {
  const textGroupRef = useRef();

  // Create canvas textures for each text line
  const textMeshes = useMemo(() => {
    return TEXT_CONTENT.map((item) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const { fontSize, resolutionMultiplier } = TEXT_SETTINGS;
      const font = `bold ${fontSize}px Arial`;

      context.font = font;
      const textWidth = context.measureText(item.text).width;
      const textHeight = fontSize * 1.2; // Add some padding for line height

      canvas.width = (textWidth + 20) * resolutionMultiplier;
      canvas.height = textHeight * resolutionMultiplier;

      // Reset font after canvas resize
      context.font = font;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = 'white';
      context.fillText(item.text, canvas.width / 2, canvas.height / 2);

      const texture = new CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.anisotropy = 16; // Improve texture filtering

      return {
        id: item.id,
        text: item.text,
        texture: texture,
        material: new MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.1, // Helps with transparent text edges
          side: FrontSide, // Crucial: only render the front of each text plane
        }),
        width: textWidth * TEXT_SETTINGS.textScaleFactor,
        height: textHeight * TEXT_SETTINGS.textScaleFactor,
      };
    });
  }, []);

  useFrame(() => {
    if (textGroupRef.current) {
      // Calculate rotation and horizontal position based on scrollProgress
      const rotationAngle = (scrollProgress * TEXT_SETTINGS.scrollRotationDegrees * Math.PI) / 180;
      const horizontalPosition = TEXT_SETTINGS.startOffsetX - (scrollProgress * TEXT_SETTINGS.horizontalTravelUnits);

      textGroupRef.current.position.x = horizontalPosition;
      textGroupRef.current.rotation.y = rotationAngle;
    }
  });

  // Calculate positions of individual text planes along the curve
  const textPlanePositions = useMemo(() => {
    const positions = [];
    const numItems = TEXT_CONTENT.length;
    const angleStep = (2 * Math.PI) / numItems; // Full circle distribution for continuous loop

    for (let i = 0; i < numItems; i++) {
      const angle = i * angleStep;
      const x = TEXT_SETTINGS.curveRadius * Math.sin(angle);
      const z = -TEXT_SETTINGS.curveRadius * Math.cos(angle); // Z-axis for depth
      positions.push({ x, z, angle });
    }
    return positions;
  }, []);

  return (
    <group ref={textGroupRef}>
      {textMeshes.map((meshData, index) => {
        const { x, z, angle } = textPlanePositions[index];
        return (
          <Plane
            key={meshData.id}
            args={[meshData.width, meshData.height]}
            position={[x, 0, z]}
            rotation={[0, angle, 0]} // Each plane rotates to face the origin of the curve
          >
            <primitive object={meshData.material} attach="material" />
          </Plane>
        );
      })}

      {/* Conceptual Hemisphere / Masking Object:
        This is where the true "masking" happens. For a perfect AQuest-like effect,
        you'd need to ensure text fragments behind this surface are not rendered.
        This usually involves:
        1. A true HemisphereGeometry.
        2. A custom GLSL shader on your text materials that performs the depth test
           or discards pixels based on their world position relative to the hemisphere's surface.
        
        For simplicity here, we're using:
        - `side: FrontSide` on text materials to hide backfaces of individual planes.
        - The camera's perspective combined with the `curveRadius` and `position.z` 
          will naturally "hide" elements that go too far back.
        - The `Cylinder` below is a visual aid or a simple occluder if its opacity is > 0.
      */}
      <mesh>
        {/* Placeholder for a HemisphereGeometry or a custom masking object */}
        {/* You could render a half-sphere here and then apply stencil/depth testing logic */}
        {/* For now, text FrontSide and camera clipping will provide basic occlusion */}
        <cylinderGeometry args={[TEXT_SETTINGS.curveRadius, TEXT_SETTINGS.curveRadius, 10, 64, 1, false, 0, Math.PI]} /> {/* A half cylinder for visual reference */}
        <meshBasicMaterial transparent opacity={0} /> {/* Make it invisible */}
      </mesh>
    </group>
  );
}

export default function CurvedText3D({ scrollProgress }) {
  // Use a ref for the Canvas itself to manipulate its style if needed
  const canvasRef = useRef();

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, 8], fov: 75 }} // Adjust camera position and field of view
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: 5,
        pointerEvents: 'none', // Allow clicks to pass through to elements beneath
      }}
      gl={{ alpha: true }} // Enable alpha for transparency
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0); // Set clear color to transparent black
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CurvedTextScene scrollProgress={scrollProgress} />
    </Canvas>
  );
}