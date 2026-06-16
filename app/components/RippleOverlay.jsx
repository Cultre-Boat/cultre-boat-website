    "use client";

    import { useEffect, useRef, useState, useCallback } from "react";
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Image from "next/image"; // Ensure next/image is imported for optimized images

    gsap.registerPlugin(ScrollTrigger);

    // --- WebGLParticleEffect (Background Radial Light) - No functional changes ---
    const WebGLParticleEffect = ({ className = "", brightnessProgressRef }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const resolutionLocationRef = useRef(null);
    const timeLocationRef = useRef(null);
    const mouseLocationRef = useRef(null);
    const scrollBrightnessLocationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
        console.warn('WebGL not supported for background particle effect.');
        return;
        }

        glRef.current = gl;

        const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `;

        const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 resolution;
        uniform float time;
        uniform float u_scrollBrightness;

        float circleMask(vec2 uv, vec2 center, float radius, float blur) {
            float d = distance(uv, center);
            return smoothstep(radius, radius - blur, d);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            uv.x *= resolution.x / resolution.y; // Aspect ratio correction

            float bob = sin(time * 0.5) * 0.01;
            vec2 bulbCenter = vec2(0.5 * (resolution.x / resolution.y), 1.5 + bob); // Off-screen top

            float bulb = circleMask(uv, bulbCenter, 0.8, 0.7);
            bulb = pow(bulb, 1.5);

            vec3 bulbColor = vec3(1.0, 0.95, 0.85) * bulb * u_scrollBrightness;
            bulbColor = clamp(bulbColor, 0.0, 5.0);

            vec3 bgColor = vec3(0.02, 0.03, 0.06);

            vec3 col = mix(bgColor, bulbColor, bulb);

            float vign = smoothstep(1.2, 0.5, distance(uv, vec2(0.5 * (resolution.x / resolution.y), 0.5)));
            col *= vign;

            gl_FragColor = vec4(col, bulb * 0.9);
        }
        `;

        const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Particle shader compile error:', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Particle program link error:', gl.getProgramInfoLog(program));
        return;
        }
        programRef.current = program;

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        resolutionLocationRef.current = gl.getUniformLocation(program, 'resolution');
        timeLocationRef.current = gl.getUniformLocation(program, 'time');
        mouseLocationRef.current = gl.getUniformLocation(program, 'mouse'); // Still exists, but unused by this shader
        scrollBrightnessLocationRef.current = gl.getUniformLocation(program, 'u_scrollBrightness');

        return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (glRef.current) {
            glRef.current.deleteProgram(programRef.current);
            glRef.current.deleteShader(vertexShader);
            glRef.current.deleteShader(fragmentShader);
            glRef.current.deleteBuffer(buffer);
        }
        };
    }, []);

    useEffect(() => {
        const gl = glRef.current;
        const program = programRef.current;

        if (!gl || !program) return;

        const startTime = Date.now();
        let currentBrightness = 0.5;

        const render = () => {
        const currentTime = (Date.now() - startTime) / 1000;

        gl.useProgram(program);
        
        if (brightnessProgressRef && brightnessProgressRef.current !== undefined) {
            currentBrightness = brightnessProgressRef.current;
        }

        gl.uniform2f(resolutionLocationRef.current, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(timeLocationRef.current, currentTime);
        gl.uniform2f(mouseLocationRef.current, 0.5, 0.5); // Fixed for this background effect
        gl.uniform1f(scrollBrightnessLocationRef.current, currentBrightness);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'position'));
        gl.vertexAttribPointer(gl.getAttribLocation(program, 'position'), 2, gl.FLOAT, false, 0, 0);
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        };
    }, []);

    return (
        <canvas 
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none ${className}`} // Removed z-index here, controlled by parent
        style={{ mixBlendMode: 'screen' }}
        />
    );
    };

    {/* --- ForegroundFogEffect (Realistic Fog) - Corrected --- */}
    const ForegroundFogEffect = ({ className = "" }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
        console.warn('WebGL not supported for fog effect.');
        return;
        }

        const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `;

        const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 resolution;
        uniform float time;

        float hash(vec2 p) {
            // FIX: Changed vec1 to vec2 as vec1 is not a valid GLSL type
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0; 
            
            for(int i = 0; i < 6; i++) {
            value += amplitude * noise(p * frequency); 
            p *= 2.0;
            amplitude *= 0.5;
            frequency *= 2.0; 
            }
            return value;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            
            vec2 fogUV1 = uv * 2.5 + vec2(time * 0.03, time * 0.02); 
            vec2 fogUV2 = uv * 4.0 + vec2(-time * 0.025, time * 0.035);
            vec2 fogUV3 = uv * 1.8 + vec2(time * 0.015, -time * 0.02);
            
            float fog1 = fbm(fogUV1);
            float fog2 = fbm(fogUV2);
            float fog3 = fbm(fogUV3);
            
            float combinedFog = fog1 * 0.45 + fog2 * 0.3 + fog3 * 0.25;
            
            combinedFog = smoothstep(0.4, 0.65, combinedFog);
            
            float verticalMask = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
            verticalMask += smoothstep(0.0, 0.18, 1.0 - uv.y) * 0.6; 
            verticalMask += smoothstep(0.0, 0.22, uv.y) * 0.4;
            
            combinedFog *= verticalMask;
            
            float streaks = noise(vec2(uv.y * 18.0 + time * 0.5, time * 0.3));
            streaks = smoothstep(0.4, 0.85, streaks);
            streaks *= smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.6, uv.y);
            
            float totalFog = max(combinedFog, streaks * 0.25);
            
            float wisps = fbm(uv * 10.0 + time * 0.15) * 0.35;
            wisps = smoothstep(0.5, 0.9, wisps);
            totalFog += wisps * 0.25;
            
            totalFog = clamp(totalFog, 0.0, 1.0);
            
            vec3 fogColor = vec3(0.95, 0.96, 0.98);
            
            gl_FragColor = vec4(fogColor, totalFog * 0.9);
        }
        `;

        const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Fog shader compile error:', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Fog program link error:', gl.getProgramInfoLog(program));
        return;
        }

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');
        const timeLocation = gl.getUniformLocation(program, 'time');

        const startTime = Date.now();
        const render = () => {
        const currentTime = (Date.now() - startTime) / 1000;

        gl.useProgram(program);
        
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, currentTime);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (animationRef.current) {
            cancelAnimationFrame(animation.current);
        }
        };
    }, []);

    return (
        <canvas 
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none ${className}`} // Removed z-index here, controlled by parent
        />
    );
    };


    {/* --- NEW: RippleEffectCanvas (Global Water Ripple Effect) --- */}
    const RippleEffectCanvas = ({ className = "", mousePos }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const resolutionLocationRef = useRef(null);
    const timeLocationRef = useRef(null);
    const mouseLocationRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const lastRippleTimeRef = useRef(0);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const rippleActiveDuration = 0.5; // How long a ripple is "active" after movement

    // Use a ref for the mouse position to avoid re-rendering the GL context
    // This helps ensure the animation loop continues without interruption
    const mousePosRef = useRef(mousePos);
    useEffect(() => {
        mousePosRef.current = mousePos;
        // Trigger a ripple whenever the mouse moves significantly
        const distMoved = Math.sqrt(
        Math.pow(mousePos.x - lastMouseX.current, 2) +
        Math.pow(mousePos.y - lastMouseY.current, 2)
        );

        if (distMoved > 20) { // Only trigger if mouse moved a noticeable amount
        lastRippleTimeRef.current = Date.now() / 1000;
        lastMouseX.current = mousePos.x;
        lastMouseY.current = mousePos.y;
        }
    }, [mousePos]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
        console.warn('WebGL not supported for ripple effect. Please ensure your browser supports WebGL.');
        return;
        }

        glRef.current = gl;

        const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `;

        // Fragment Shader for Ripple Distortion
        // This shader creates a global ripple effect
        const fragmentShaderSource = `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform vec2 mouse; // Pixel coordinates of mouse
        uniform float u_rippleStartTime; // Time when the last significant ripple started
        uniform float u_rippleActiveDuration; // How long the ripple should fade

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            
            // Normalize mouse coordinates for shader (0-1, Y-inverted)
            vec2 normalizedMouse = mouse / resolution.xy;
            normalizedMouse.y = 1.0 - normalizedMouse.y; 

            float distToMouse = distance(uv, normalizedMouse);

            // Calculate current ripple age
            float rippleAge = time - u_rippleStartTime;
            
            // Only show ripple if it's active
            float rippleIntensity = 0.0;
            if (rippleAge > 0.0 && rippleAge < u_rippleActiveDuration) {
                // Fade in and out the ripple over its active duration
                float fade = smoothstep(0.0, u_rippleActiveDuration * 0.2, rippleAge) * smoothstep(u_rippleActiveDuration, u_rippleActiveDuration * 0.8, rippleAge);
                
                // Wave function based on distance and time
                float waveSpeed = 10.0; // How fast the rings move outwards
                float waveFrequency = 40.0; // Number of rings
                float wave = sin(distToMouse * waveFrequency - rippleAge * waveSpeed);
                
                // Falloff of the ripple intensity with distance
                float radiusFalloff = smoothstep(0.0, 0.3, distToMouse) * smoothstep(0.8, 0.4, distToMouse);
                
                rippleIntensity = wave * 0.15 * fade * radiusFalloff; // Adjust 0.15 for max distortion
            }

            // Base background color, subtly shifted by the ripple
            vec3 baseColor = vec3(0.05, 0.05, 0.08); // Dark blue/grey background

            // Add a subtle color shift or highlight based on the ripple
            vec3 finalColor = baseColor + rippleIntensity * vec3(0.1, 0.2, 0.3); // Blueish tint for ripple

            gl_FragColor = vec4(finalColor, 1.0); // Opaque ripple background
        }
        `;

        const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Ripple shader compile error:', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Ripple program link error:', gl.getProgramInfoLog(program));
        return;
        }
        programRef.current = program;

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        resolutionLocationRef.current = gl.getUniformLocation(program, 'resolution');
        timeLocationRef.current = gl.getUniformLocation(program, 'time');
        mouseLocationRef.current = gl.getUniformLocation(program, 'mouse');
        gl.getUniformLocation(program, 'u_rippleStartTime');
        gl.getUniformLocation(program, 'u_rippleActiveDuration');

        return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (glRef.current) {
            glRef.current.deleteProgram(programRef.current);
            glRef.current.deleteShader(vertexShader);
            glRef.current.deleteShader(fragmentShader);
            glRef.current.deleteBuffer(buffer);
        }
        };
    }, []);

    useEffect(() => {
        const gl = glRef.current;
        const program = programRef.current;

        if (!gl || !program) return;

        const render = () => {
        const currentTime = (Date.now() - startTimeRef.current) / 1000;

        gl.useProgram(program);
        
        gl.uniform2f(resolutionLocationRef.current, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(timeLocationRef.current, currentTime);
        gl.uniform2f(mouseLocationRef.current, mousePosRef.current.x, mousePosRef.current.y);
        gl.uniform1f(gl.getUniformLocation(program, 'u_rippleStartTime'), lastRippleTimeRef.current);
        gl.uniform1f(gl.getUniformLocation(program, 'u_rippleActiveDuration'), rippleActiveDuration);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'position'));
        gl.vertexAttribPointer(gl.getAttribLocation(program, 'position'), 2, gl.FLOAT, false, 0, 0);
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        };
    }, []); // Empty dependency array means this effect runs once to start render loop

    return (
        <canvas 
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none ${className}`} // Removed z-index here
        />
    );
    };


    {/* --- MagneticRippleLayout (Main Component with magnetic and scroll effects) --- */}
    export default function MagneticRippleLayout() {
    const containerRef = useRef(null);
    const leftColRef = useRef(null);
    const rightColRef = useRef(null);
    const textContainerRef = useRef(null); // Reference for the parent of text elements

    const imageRefs = useRef([]); // This will hold the direct DOM element for each image wrapper
    // Ensure it's always an empty array for cleanup, reset on initial render
    useEffect(() => {
        imageRefs.current = [];
    }, []); 

    const designTextRef = useRef(null);
    const prTextRef = useRef(null);
    const socialTextRef = useRef(null);

    const brightnessValue = useRef(0.5); // Initial dimmer state for the reflection

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const leftImages = {
        1: "/image1.jpg",
        2: "/image2.jpg",
        3: "/image3.jpg",
        4: "/image4.jpg",
        5: "/image1.jpg",
        6: "/image2.jpg",
        7: "/image3.jpg",
        8: "/image4.jpg",
        9: "/image1.jpg",
    };

    const rightImages = {
        1: "/image4.jpg",
        2: "/image2.jpg",
        3: "/image2.jpg",
        4: "/image4.jpg",
        5: "/image4.jpg",
        6: "/image2.jpg",
        7: "/image3.jpg",
        8: "/image4.jpg",
        9: "/image2.jpg",
    };

    // Callback to add image refs, ensuring unique elements
    const addImageRef = useCallback((el) => {
        if (el && !imageRefs.current.includes(el)) {
        imageRefs.current.push(el);
        }
    }, []);

    // Effect to capture global mouse position for the ripple effect
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);

        return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
        const isMobile = window.innerWidth < 768;
        const windowHeight = window.innerHeight;

        const maxScrollDistance = isMobile ? 1800 : 4000;

        // Set the scrollable height of the container
        gsap.set(containerRef.current, { height: maxScrollDistance + windowHeight });

        const initialLeftOffset = windowHeight * (isMobile ? 0.2 : 0.4);
        const initialRightOffset = windowHeight * (isMobile ? 0.1 : 0.2);

        // Initial positions for columns
        gsap.set(leftColRef.current, { y: initialLeftOffset });
        gsap.set(rightColRef.current, { y: -maxScrollDistance - initialRightOffset });

        // Scroll animations for columns
        gsap.to(leftColRef.current, {
            y: -maxScrollDistance + initialLeftOffset,
            ease: "none",
            scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${maxScrollDistance}`,
            scrub: 1,
            },
        });

        gsap.to(rightColRef.current, {
            y: 0 + initialRightOffset,
            ease: "none",
            scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${maxScrollDistance}`,
            scrub: 1,
            },
        });

        // Text scroll animation
        gsap.set(textContainerRef.current, { x: "150vw" }); // Start far right

        gsap.to(textContainerRef.current, {
            x: "-80vw", // End far left
            ease: "none",
            scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${maxScrollDistance}`,
            scrub: 1,
            },
        });

        // GSAP ScrollTrigger for spotlight brightness (background effect)
        gsap.to(brightnessValue, {
            current: 3.0, // Significantly brighter when scrolling
            ease: "power2.out",
            scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${maxScrollDistance}`,
            scrub: 0.5,
            onUpdate: (self) => {
                // If scroll is not active (i.e., at start or end), dim the light
                if (!self.isActive) {
                    gsap.to(brightnessValue, {
                        current: 0.5,
                        duration: 0.8,
                        ease: "power2.out",
                    });
                }
            },
            onLeaveBack: () => { // When scrolling back up and leaving the trigger area
                gsap.to(brightnessValue, {
                    current: 0.5,
                    duration: 0.8,
                    ease: "power2.out",
                });
            },
            },
        });

        {/* --- MAGNETIC EFFECT Implementation --- */}
        const magnetElements = [];
        // Add image elements (the actual <img> tag within the wrapper div)
        imageRefs.current.forEach(el => {
            const imgElement = el?.querySelector("img");
            if (imgElement) magnetElements.push(imgElement);
        });
        // Add text elements (the <a> tags)
        if (designTextRef.current) magnetElements.push(designTextRef.current);
        if (prTextRef.current) magnetElements.push(prTextRef.current);
        if (socialTextRef.current) magnetElements.push(socialTextRef.current);

        magnetElements.forEach((element) => {
            if (!element) return; // Skip if element is null or undefined

            let bounds; // To store element's bounding box relative to viewport

            // Function to update bounds, essential for accurate magnetic effect
            const updateBounds = () => {
            bounds = element.getBoundingClientRect();
            };

            // Update bounds on mount/resize, and also periodically if content shifts
            updateBounds(); 
            window.addEventListener('resize', updateBounds);
            // Also call updateBounds when scroll animation happens
            ScrollTrigger.addEventListener("refresh", updateBounds);

            const handleMagnetMouseMove = (e) => {
            if (!bounds) {
                updateBounds(); // Try to get bounds if not already available
                if (!bounds) return; // If still no bounds, exit
            }

            const elementCenterX = bounds.left + bounds.width / 2;
            const elementCenterY = bounds.top + bounds.height / 2;

            const distanceX = e.clientX - elementCenterX;
            const distanceY = e.clientY - elementCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            const magnetRadius = 100; // Radius within which magnetism applies (pixels)
            const magnetStrength = 0.25; // How strongly elements pull (0.0 to 1.0)

            let targetX = 0;
            let targetY = 0;

            if (distance < magnetRadius) {
                targetX = distanceX * magnetStrength;
                targetY = distanceY * magnetStrength;
            }

            gsap.to(element, {
                x: targetX,
                y: targetY,
                duration: 0.8, // Smooth animation duration
                ease: "power2.out",
                overwrite: "auto", // Prevents conflicting animations on the same property
                // We apply magnetic effect to the "transform" CSS property
                // This allows the scroll-based transform to also apply
            });
            };

            const handleMagnetMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 1.0, // Smooth return duration
                ease: "elastic.out(1, 0.5)", // Spring-back effect
            });
            };

            // Attach event listeners to the interactive wrapper (the div with cursor-pointer)
            const interactiveWrapper = element.closest('.cursor-pointer');
            if (interactiveWrapper) {
            interactiveWrapper.addEventListener("mousemove", handleMagnetMouseMove);
            interactiveWrapper.addEventListener("mouseleave", handleMagnetMouseLeave);
            }

            // Cleanup function for event listeners
            return () => {
                if (interactiveWrapper) {
                    interactiveWrapper.removeEventListener("mousemove", handleMagnetMouseMove);
                    interactiveWrapper.removeEventListener("mouseleave", handleMagnetMouseLeave);
                }
                window.removeEventListener('resize', updateBounds);
                ScrollTrigger.removeEventListener("refresh", updateBounds);
            };
        });

        {/* --- END MAGNETIC EFFECT --- */}


        {/* --- FOLD AWAY EFFECT FOR IMAGES --- */}
        imageRefs.current.forEach((imageWrapper) => {
            const imageElement = imageWrapper.querySelector("img");
            if (!imageElement) return;

            // Create a separate timeline for each image's fold effect
            gsap.to(imageElement, {
            rotationX: (i, target) => {
                // Determine if it's a left or right column image to infer scroll direction
                const isLeftColumn = target.closest('[ref="leftColRef"]'); // Check if it's in left column
                // For images in left column, they scroll down. For images in right column, they scroll up.
                // When leaving bottom, it's rotating "upwards" (positive rotationX for top origin)
                // When leaving top, it's rotating "downwards" (negative rotationX for bottom origin)
                
                // This will be controlled by the ScrollTrigger's progress
                return 0; // Initial value, actual animation controlled by onUpdate
            },
            scaleY: 1, // Initial scale, actual animation controlled by onUpdate
            opacity: 1, // Initial opacity, actual animation controlled by onUpdate
            z: 0, // Initial z-position, actual animation controlled by onUpdate
            ease: "none", // Controlled by scrub
            scrollTrigger: {
                trigger: imageWrapper,
                start: "top bottom", // When top of image hits bottom of viewport
                end: "bottom top", // When bottom of image leaves top of viewport
                scrub: true, // Link animation to scroll position
                onUpdate: (self) => {
                const bounds = imageWrapper.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const foldZoneHeight = 250; // Adjust this value for how deep the fold effect starts

                let foldProgress = 0;
                let direction = 0; // 1 for folding upwards (top origin), -1 for folding downwards (bottom origin)

                // Folding UPWARDS (bottom of image nearing top of viewport)
                // Image is moving up, its bottom edge goes past the top of the screen
                if (bounds.bottom <= viewportHeight && bounds.bottom > 0) {
                    // progress from when bottom enters viewport until it leaves top
                    // 0 at bottom of viewport, 1 at top of viewport
                    const distanceToTop = bounds.bottom; // distance from viewport top to image bottom
                    if (distanceToTop < foldZoneHeight) {
                        foldProgress = 1 - Math.max(0, Math.min(1, distanceToTop / foldZoneHeight));
                        direction = 1; // Folds towards top
                        gsap.set(imageElement, { transformOrigin: "center top", perspective: "800px" }); // Apply perspective here for 3D
                    }
                }
                // Folding DOWNWARDS (top of image nearing bottom of viewport)
                // Image is moving down, its top edge goes past the bottom of the screen
                else if (bounds.top >= 0 && bounds.top < viewportHeight) {
                    // progress from when top leaves bottom viewport until it reaches top of viewport
                    // 0 at bottom of viewport, 1 at top of viewport
                    const distanceToBottom = viewportHeight - bounds.top; // distance from viewport bottom to image top
                    if (distanceToBottom < foldZoneHeight) {
                        foldProgress = 1 - Math.max(0, Math.min(1, distanceToBottom / foldZoneHeight));
                        direction = -1; // Folds towards bottom
                        gsap.set(imageElement, { transformOrigin: "center bottom", perspective: "800px" }); // Apply perspective here for 3D
                    }
                }
                // If not in a fold zone, ensure it's reset
                else {
                    gsap.to(imageElement, { 
                    rotationX: 0, 
                    scaleY: 1, 
                    opacity: 1, 
                    z: 0,
                    duration: 0.3, 
                    overwrite: true,
                    transformOrigin: "center center",
                    perspective: "none"
                    });
                    return;
                }

                // Apply the bend and collapse
                gsap.to(imageElement, {
                    rotationX: (direction === 1 ? -90 : 90) * foldProgress, // Bends up/down
                    scaleY: 1 - (0.9 * foldProgress), // Collapses vertically (to 0.1 of original height)
                    opacity: 1 - (1.0 * foldProgress), // Fades out
                    ease: "power2.out",
                    duration: 0.5, // Duration for the animation within the scrub
                    overwrite: true,
                    z: -50 * foldProgress // Move back in Z to enhance 3D bend
                });
                },
                onLeave: () => {
                    // When element leaves the view completely, ensure it's reset to avoid weird states on re-entry
                    gsap.set(imageElement, { rotationX: 0, scaleY: 1, opacity: 1, z: 0, transformOrigin: "center center", perspective: "none" });
                },
                onEnterBack: () => {
                    // When element re-enters the view from the other side, reset
                    gsap.set(imageElement, { rotationX: 0, scaleY: 1, opacity: 1, z: 0, transformOrigin: "center center", perspective: "none" });
                }
            },
            });
        });
        {/* --- END FOLD AWAY EFFECT --- */}


        const handleResize = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
        }, containerRef); // GSAP context

        return () => ctx.revert(); // Cleanup GSAP animations on unmount
    }, []); // Empty dependency array, runs once on mount

    return (
        <>
        {/* WebGL Canvases are fixed and layered */}
        {/* The Ripple Effect is the primary background visual */}
        <RippleEffectCanvas mousePos={mousePosition} className="z-0" /> 
        {/* The Particle Effect is layered above the ripple */}
        <WebGLParticleEffect brightnessProgressRef={brightnessValue} className="z-10" /> 
        {/* The main content scrolls over the WebGL effects */}
        <div ref={containerRef} className="relative w-full overflow-hidden reverse-start-layout z-20" style={{ perspective: "1000px" }}> 
            <div
            ref={leftColRef}
            className="fixed top-0 w-[42%] md:w-[35%] flex flex-col gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4"
            style={{
                left: "50%",
                transform: "translateX(-100%)", // Will be overridden by GSAP
                marginLeft: "-2%",
            }}
            >
            {Object.entries(leftImages).map(([key, src]) => (
                <div
                key={`left-${key}`}
                ref={addImageRef}
                className="w-full aspect-[3/4] relative mb-10 md:mb-32 cursor-pointer overflow-hidden rounded-lg"
                >
                <Image
                    src={src}
                    alt={`Left Image ${key}`}
                    width={500} // Set appropriate width and height for Next.js Image component
                    height={667} // For aspect-[3/4]
                    className="w-full h-full object-cover will-change-transform" // will-change for performance
                    unoptimized // Use unoptimized for local dev if image quality is an issue, remove in production
                />
                </div>
            ))}
            </div>

            <div
            ref={rightColRef}
            className="fixed top-0 w-[42%] md:w-[35%] flex flex-col-reverse gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4"
            style={{
                left: "50%",
                transform: "translateX(4%)", // Will be overridden by GSAP
                marginRight: "-2%",
            }}
            >
            {Object.entries(rightImages).map(([key, src]) => (
                <div
                key={`right-${key}`}
                ref={addImageRef}
                className="w-full aspect-[3/4] relative mb-10 md:mb-32 cursor-pointer overflow-hidden rounded-lg"
                >
                <Image
                    src={src}
                    alt={`Right Image ${key}`}
                    width={500} // Set appropriate width and height
                    height={667}
                    className="w-full h-full object-cover mb-20 mt-20 will-change-transform" // will-change for performance
                    unoptimized // Use unoptimized for local dev if image quality is an issue, remove in production
                />
                </div>
            ))}
            </div>

            {/* Text content, also subject to magnetic effect */}
            <div
            ref={textContainerRef}
            className="fixed gap-10 top-1/2 transform -translate-y-1/2 flex md:gap-60 whitespace-nowrap z-20"
            >
            <h1 className="text-7xl md:text-9xl lg:text-9xl opacity-50 active:opacity-80 focus:opacity-80 transition-opacity hover:opacity-100 font-thin text-white/90 tracking-tighter cursor-pointer">
                <a ref={designTextRef} href="/design" className="inline-block will-change-transform">
                DESIGN
                </a>
            </h1>
            <h1 className="text-7xl md:text-9xl lg:text-9xl opacity-50 active:opacity-80 focus:opacity-80 transition-opacity hover:opacity-100 font-thin text-white/90 tracking-tighter cursor-pointer">
                <a ref={prTextRef} href="/PR" className="inline-block will-change-transform">
                PR
                </a>
            </h1>
            <h1 className="text-7xl md:text-9xl lg:text-9xl opacity-50 active:opacity-80 focus:opacity-80 transition-opacity hover:opacity-100 font-thin text-white/90 tracking-tighter cursor-pointer">
                <a ref={socialTextRef} href="/social-scroll" className="inline-block will-change-transform">
                SOCIAL
                </a>
            </h1>
            </div>
        </div>
        {/* Fog effect is highest z-index for atmospheric overlay */}
        <ForegroundFogEffect className="z-30" /> 
        </>
    );
    }