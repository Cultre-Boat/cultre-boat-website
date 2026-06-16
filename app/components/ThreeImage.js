"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap"; // Assuming gsap is available for potential animations/transitions

// Your GLSL shaders as strings (slightly modified fragment shader)
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform vec2 resolution;
    uniform float time;
    uniform sampler2D currentImage; // Changed from canvasSource
    uniform sampler2D nextImage;    // For blending if needed
    uniform float blendFactor;      // For blending between images

    void main() {
        vec2 sp = gl_FragCoord.xy / resolution.xy - vec2(0.5, 0.5);

        // Sample the current image texture
        vec4 imageColor = texture2D(currentImage, vUv);

        // Apply the water distortion effect
        vec2 p = (0.8 * 0.8 * sp) * 12.0 - vec2(0.0);
        vec2 i = p;
        float c = 1.0;
        float inten = 1.1;

        for(int n = 0; n < 18; n++){
            float t = time * (1.0 - (3.0 / float(n + 7)));
            i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
            c += 11.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
        }

        c /= float(20);
        c = 1.8 - sqrt(c);

        // The distortion is applied to the image color components
        // You might want to experiment with how 'c' affects the final color
        vec3 distortedColor = vec3(imageColor.r * c, imageColor.g * c, imageColor.b * c);

        // If blending is implemented, uncomment and use nextImage and blendFactor
        // vec4 nextImageColor = texture2D(nextImage, vUv);
        // distortedColor = mix(distortedColor, vec3(nextImageColor.r * c, nextImageColor.g * c, nextImageColor.b * c), blendFactor);

        gl_FragColor = vec4(distortedColor, 1.0) * vec4(0.0, 0.5, 0.9, 1.0); // Keep original tint
    }
`;

export default function ThreeImage({ containerRef, leftImages, rightImages, onMaxScrollCalculated }) {
    const canvasRef = useRef();
    const uniformsRef = useRef();
    const rendererRef = useRef();
    const sceneRef = useRef();
    const cameraRef = useRef();
    const loadedTextures = useRef({}); // To store loaded THREE.Texture objects

    // This state will track the currently active image index
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Helper to load all image textures
    const loadAllTextures = async (imagePaths) => {
        const textureLoader = new THREE.TextureLoader();
        const textures = {};
        for (const path of imagePaths) {
            if (!loadedTextures.current[path]) { // Load only if not already loaded
                try {
                    const texture = await textureLoader.loadAsync(path);
                    textures[path] = texture;
                    // For better performance, set wrapping and filtering once
                    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                } catch (error) {
                    console.error("Failed to load texture:", path, error);
                }
            }
        }
        loadedTextures.current = { ...loadedTextures.current, ...textures };
    };

    useEffect(() => {
        let animationFrameId;
        let scrollTriggerInstance;

        const canvas = canvasRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // --- Three.js Setup (similar to before) ---
        const camera = new THREE.Camera();
        camera.position.z = 1;

        const scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(2, 2);

        // Initial uniform values
        const uniforms = {
            currentImage: { type: 't', value: null }, // Will be set after loading
            nextImage: { type: 't', value: null },     // For future blending
            blendFactor: { type: 'f', value: 0.0 },    // For future blending
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2(width, height) }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // alpha: true for transparent background
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio); // For sharper rendering on HiDPI screens

        uniformsRef.current = uniforms;
        rendererRef.current = renderer;
        sceneRef.current = scene;
        cameraRef.current = camera;
        // --- End Three.js Setup ---

        // Load all images
        const allImagePaths = [...leftImages, ...rightImages];
        loadAllTextures(allImagePaths).then(() => {
            // Set the initial image after loading
            if (allImagePaths.length > 0 && loadedTextures.current[allImagePaths[0]]) {
                uniformsRef.current.currentImage.value = loadedTextures.current[allImagePaths[0]];
            } else {
                console.warn("No images loaded or first image path is invalid.");
            }
        });

        // Loop for animation
        function loop() {
            uniformsRef.current.time.value += 0.05;
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            animationFrameId = requestAnimationFrame(loop);
        }

        loop();

        // --- Scroll-based image switching ---
        if (containerRef.current) {
            // Calculate a total scroll length based on the number of images
            // You'll want to fine-tune this value. Each image could represent a "section"
            // For example, 500px per image.
            const scrollLengthPerImage = window.innerHeight; // Or a fixed value like 800
            const totalScrollLength = (leftImages.length + rightImages.length) * scrollLengthPerImage;
            onMaxScrollCalculated(totalScrollLength); // Inform the parent component

            scrollTriggerInstance = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: `+=${totalScrollLength}`, // End based on calculated length
                scrub: 1.5,
                onUpdate: (self) => {
                    const progress = self.progress; // 0 to 1
                    const totalImages = leftImages.length + rightImages.length;
                    const imageIndex = Math.min(
                        Math.floor(progress * totalImages),
                        totalImages - 1
                    );

                    if (imageIndex !== activeImageIndex) {
                        setActiveImageIndex(imageIndex); // Update state to trigger re-render if necessary
                        const currentImagePath = allImagePaths[imageIndex];
                        if (loadedTextures.current[currentImagePath]) {
                            uniformsRef.current.currentImage.value = loadedTextures.current[currentImagePath];
                        }
                    }
                },
            });
        }
        // --- End Scroll-based image switching ---

        return () => {
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            scene.dispose();
            geometry.dispose();
            material.dispose();
            // Dispose of all loaded textures
            Object.values(loadedTextures.current).forEach(texture => texture.dispose());
            if (scrollTriggerInstance) scrollTriggerInstance.kill();
        };
    }, [leftImages, rightImages, containerRef, activeImageIndex, onMaxScrollCalculated]); // Dependencies

    return (
        <div className="fixed inset-0 z-0">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
    );
}