"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as THREE from "three";

// The shaders remain the same
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uDisplacement;
  uniform float uTime;
  uniform vec2 uSpeed;

  void main() {
    vec2 displacedUv = vUv;
    vec4 displacement = texture2D(uDisplacement, fract(vUv + uTime * uSpeed));
    
    // Adjust the displacement strength for a more subtle effect
    displacedUv.x += (displacement.r - 0.5) * 0.05;
    displacedUv.y += (displacement.g - 0.5) * 0.05;
    
    gl_FragColor = texture2D(uTexture, displacedUv);
  }
`;

// This component now correctly scales the image plane
function ImagePlane({ src, displacementImage, autoPlaySpeed }) {
  const ref = useRef();
  // useThree gives us access to the viewport properties
  const { viewport } = useThree();
  const [texture, displacement] = useLoader(TextureLoader, [src, displacementImage]);

  displacement.wrapS = displacement.wrapT = THREE.RepeatWrapping;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDisplacement: { value: displacement },
      uTime: { value: 0 },
      uSpeed: { value: new THREE.Vector2(autoPlaySpeed[0] / 1000, autoPlaySpeed[1] / 1000) },
    }),
    [texture, displacement, autoPlaySpeed]
  );

  useFrame((state) => {
    if (ref.current.material.uniforms.uTime) {
      ref.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  // This is the key part: we calculate the scale based on the viewport and image aspect ratio
  const planeScale = useMemo(() => {
    if (!texture) return [1, 1, 1];
    
    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = viewport.width / viewport.height;
    
    let scaleX, scaleY;

    // This logic ensures the image covers the viewport area without distortion,
    // similar to `background-size: cover`.
    if (viewportAspect > imageAspect) {
      // Viewport is wider than the image
      scaleX = viewport.width;
      scaleY = viewport.width / imageAspect;
    } else {
      // Viewport is taller than the image
      scaleY = viewport.height;
      scaleX = viewport.height * imageAspect;
    }
    
    return [scaleX, scaleY, 1];
  }, [texture, viewport]);


  return (
    <mesh ref={ref} scale={planeScale}>
      {/* The geometry is now a simple 1x1 plane that we scale */}
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// The outer component remains largely the same
function WebGLCanvas({
  src,
  alt,
  displacementImage,
  className,
  width,
  height,
  autoPlaySpeed = [0, 6],
}) {
  return (
    <div
      className={className}
      // This style tag is still important! It tells the browser to reserve space
      // for this element, preventing content from jumping around.
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      <Canvas camera={{ fov: 45, position: [0, 0, 1] }}>
        <React.Suspense fallback={null}>
          <ImagePlane
            src={src}
            displacementImage={displacementImage}
            autoPlaySpeed={autoPlaySpeed}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

export default React.memo(WebGLCanvas);