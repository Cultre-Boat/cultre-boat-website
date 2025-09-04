"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Vertex Shader for a simple plane that covers the screen
const vertexShader = `
  void main() {
    // gl_Position is the final position of the vertex in clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader for the water effect
const fragmentShader = `
  uniform float u_time;
  uniform sampler2D u_noiseTexture; // Your noise.png image
  uniform vec2 u_resolution;      // Canvas resolution

  void main() {
    // Normalized screen coordinates (0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // --- Create a dynamic offset based on time and noise texture ---

    // 1. Sample the noise texture.
    // We offset the sampling UVs by time to make the noise move.
    // Adjust 0.005 and 0.003 for speed and direction of the underlying noise flow.
    vec2 noise_uv = uv + vec2(u_time * 0.005, u_time * 0.003);
    vec4 noise_color = texture2D(u_noiseTexture, noise_uv);

    // Use the red and green channels of the noise texture for X and Y displacement.
    // Subtract 0.5 and multiply by 2.0 to remap noise from [0,1] to [-1,1].
    vec2 displacement_direction = (noise_color.rg - 0.5) * 2.0;

    // 2. Add an explicit wavy pattern using sine/cosine functions
    // This creates the primary large-scale undulations
    float wave_strength = 0.2; // 🔥 INCREASED: Controls the intensity of the waves (0.0 to 0.2 typically)
    float wave_frequency = 10.0; // Controls how many waves are visible across the screen (slight adjustment)
    float wave_speed = 0.8;    // 🔥 INCREASED: Controls the speed of these waves

    displacement_direction.x += sin(uv.y * wave_frequency + u_time * wave_speed) * wave_strength;
    displacement_direction.y += cos(uv.x * wave_frequency * 0.8 + u_time * wave_speed * 0.8) * wave_strength * 0.8;

    // Combine displacement from noise and waves, and scale it down for a subtle effect
    // Multiply by a factor (e.g., 0.05) to control the overall distortion strength.
    vec2 final_displacement = displacement_direction * 0.1; // 🔥 INCREASED: Adjust this value (e.g., 0.01 to 0.1)

    // 3. Apply displacement to the UVs to create the "wavy" effect
    vec2 distorted_uv = uv + final_displacement;

    // Re-sampling noise.png with distorted UVs to get the final wavy look.
    vec4 final_color = texture2D(u_noiseTexture, distorted_uv);

    // --- Optional: Enhance water appearance ---
    // You can subtly adjust brightness or add color tint here
    // For a darker, moodier water, you might multiply by a color or reduce brightness.
    // Let's add a slight tint to make sure it's visible even without strong noise
    final_color.rgb *= vec3(0.7, 0.8, 0.9); // Example: slight blue-gray tint
    final_color.rgb += 0.05; // Slightly brighten it
    final_color.a = 0.9; // 🔥 Ensure some transparency if needed, or 1.0 for opaque

    gl_FragColor = final_color;
  }
`;

const WebGLWaterEffect = ({ imageUrl }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const meshRef = useRef(null); // Keep a ref to the mesh for disposal
  const animationFrameId = useRef(null);

  useEffect(() => {
    // 1. Scene Setup
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Orthographic Camera for 2D-like full-screen effects
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.z = 1;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Allow transparency if needed
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 🔥 DEBUGGING: Set a distinct background color for the renderer
    renderer.setClearColor(0x333333, 1); // Dark gray, opaque. Change this to something bright like 0xff0000 (red) for clear visibility if no effect.

    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Create Shader Material initially (without texture)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_noiseTexture: { value: null }, // Will be set after texture loads
        u_resolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
    });
    materialRef.current = material;

    // Create geometry and mesh immediately
    const geometry = new THREE.PlaneGeometry(2, 2); // Plane covering the screen
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh; // Store reference to the mesh

    // 3. Load Texture
    const textureLoader = new THREE.TextureLoader();
    const noiseTexture = textureLoader.load(imageUrl,"/noise.png",
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // Assign the loaded texture to the uniform
        if (materialRef.current) {
          materialRef.current.uniforms.u_noiseTexture.value = texture;
          console.log('Noise texture loaded successfully!');
        }
      },
      undefined, // onProgress callback
      (error) => {
        console.error('An error occurred loading the noise texture:', error);
        // Fallback: If texture fails, perhaps show a flat color or a generated noise pattern
        if (materialRef.current) {
          // You could set a dummy texture here, or remove the texture from the shader
          // For now, it will just use null, resulting in black or transparent depending on shader
        }
      }
    );

    // 4. Animation Loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (materialRef.current) {
        materialRef.current.uniforms.u_time.value += 0.01; // Adjust speed here
      }
      renderer.render(scene, camera);
    };
    animate();

    // 5. Handle Resize
    const handleResize = () => {
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      if (rendererRef.current && cameraRef.current && materialRef.current) {
          rendererRef.current.setSize(newWidth, newHeight);
          // For orthographic camera, update based on aspect ratio if bounds are changing
          // cameraRef.current.left = -newWidth / newHeight;
          // cameraRef.current.right = newWidth / newHeight;
          // cameraRef.current.top = 1;
          // cameraRef.current.bottom = -1;
          cameraRef.current.updateProjectionMatrix();
          materialRef.current.uniforms.u_resolution.value.set(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // 6. Cleanup
    return () => {
      console.log('Cleaning up WebGLWaterEffect...');
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (currentMount && rendererRef.current && rendererRef.current.domElement) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        // materialRef.current is disposed above, so no need for meshRef.current.material.dispose();
      }
      if (noiseTexture) {
        noiseTexture.dispose();
      }
      console.log('WebGLWaterEffect cleaned up.');
    };
  }, [imageUrl]); // Rerun if imageUrl changes

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full -z-10 bg-black" // Added bg-black for initial visibility test
      style={{ pointerEvents: 'none' }} // Ensure it doesn't block interactions
    />
  );
};

export default WebGLWaterEffect;