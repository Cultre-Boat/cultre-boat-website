"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;

    uniform mat3 u_textureMatrix; // New uniform for texture scaling/translation

    varying vec2 v_texCoord;

    void main() {
        gl_Position = a_position;
        v_texCoord = (u_textureMatrix * vec3(a_texCoord, 1)).xy; // Apply texture matrix
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_image;
    uniform sampler2D u_waterTexture;
    uniform float u_time;
    uniform float u_distortionIntensity;
    uniform float u_animationSpeed;

    varying vec2 v_texCoord;

    void main() {
        // Sample water texture with time-based animation
        vec4 waterColor = texture2D(u_waterTexture, v_texCoord * 0.5 + u_time * u_animationSpeed);

        // Calculate displacement from water texture channels
        float displacementX = (waterColor.r - 0.5) * u_distortionIntensity;
        float displacementY = (waterColor.g - 0.5) * u_distortionIntensity;

        // Apply displacement to texture coordinates
        vec2 distortedUv = v_texCoord + vec2(displacementX, displacementY);

        // Sample the main image with distorted UVs
        vec4 color = texture2D(u_image, distortedUv);

        gl_FragColor = color;
    }
`;

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function setPositions(gl) {
    const positions = [
        -1, -1,
         1, -1,
        -1,  1,

        -1,  1,
         1, -1,
         1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

function setTextureCoordinates(gl) {
    const texCoords = [
        0, 1, // Corresponds to bottom-left of texture
        1, 1, // Corresponds to bottom-right of texture
        0, 0, // Corresponds to top-left of texture

        0, 0, // Top-left
        1, 1, // Bottom-right
        1, 0, // Top-right
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
}

function createAndBindTexture(gl, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
}

// Helper to create a 3x3 identity matrix
function identityMatrix() {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
}

// Helper to create a 3x3 scaling matrix
function scaleMatrix(sx, sy) {
    return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
    ];
}

// Helper to multiply two 3x3 matrices (m1 * m2)
function multiplyMatrices(m1, m2) {
    const result = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let sum = 0;
            for (let k = 0; k < 3; k++) {
                sum += m1[i * 3 + k] * m2[k * 3 + j];
            }
            result[i * 3 + j] = sum;
        }
    }
    return result;
}

const WaterEffectCanvas = ({
    imageUrl,
    waterTextureUrl,
    width = 400,
    height = 600,
    initialDistortionIntensity = 0.05,
    initialAnimationSpeed = 0.00005,
    borderEffectScale = 1.05, // New prop: how much to scale the image for border effect (e.g., 1.05 means 5% larger)
    onClick,
}) => {
    const canvasRef = useRef(null);
    const glRef = useRef(null);
    const programRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const startTimeRef = useRef(performance.now());
    const texturesLoadedRef = useRef(0);
    const totalTexturesToLoad = 2;

    const [currentDistortionIntensity, setCurrentDistortionIntensity] = useState(initialDistortionIntensity);
    const [currentAnimationSpeed, setCurrentAnimationSpeed] = useState(initialAnimationSpeed);

    const uniformLocations = useRef({
        time: null,
        distortionIntensity: null,
        animationSpeed: null,
        resolution: null,
        textureMatrix: null, // New uniform location
    });

    // Memoize the texture matrix calculation
    const textureMatrix = useCallback(() => {
        const gl = glRef.current;
        if (!gl) return identityMatrix();

        // Calculate scale to make image cover more area within the canvas
        // This will effectively "crop" the image slightly but allow distortion around the edges
        const sx = 1.0 / borderEffectScale;
        const sy = 1.0 / borderEffectScale;

        // The texture coordinates (0,0) to (1,1) map to the entire texture.
        // We want to scale these coordinates so that only a portion of the texture
        // covers the -1 to 1 NDC space, making the image effectively larger.
        // Also center the scaled texture.
        let matrix = identityMatrix();
        matrix = multiplyMatrices(matrix, scaleMatrix(sx, sy));

        // Translate to center (texture coords are 0-1, so 0.5 is center)
        const translateX = (1 - sx) / 2;
        const translateY = (1 - sy) / 2;
        matrix = multiplyMatrices(matrix, [
            1, 0, 0,
            0, 1, 0,
            translateX, translateY, 1,
        ]);


        // WebGL matrices are column-major, so we need to transpose for uniformMatrix3fv
        // (Our matrix functions return row-major, so we transpose when sending to GPU)
        return [
            matrix[0], matrix[3], matrix[6],
            matrix[1], matrix[4], matrix[7],
            matrix[2], matrix[5], matrix[8],
        ];

    }, [borderEffectScale]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');
        
        if (!gl) {
            console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }
        glRef.current = gl;

        canvas.width = width;
        canvas.height = height;

        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);
        programRef.current = program;

        uniformLocations.current.time = gl.getUniformLocation(program, 'u_time');
        uniformLocations.current.distortionIntensity = gl.getUniformLocation(program, 'u_distortionIntensity');
        uniformLocations.current.animationSpeed = gl.getUniformLocation(program, 'u_animationSpeed');
        uniformLocations.current.resolution = gl.getUniformLocation(program, 'u_resolution');
        uniformLocations.current.textureMatrix = gl.getUniformLocation(program, 'u_textureMatrix'); // Get new uniform location

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
        const imageLocation = gl.getUniformLocation(program, 'u_image');
        const waterTextureLocation = gl.getUniformLocation(program, 'u_waterTexture');

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setPositions(gl);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        setTextureCoordinates(gl);
        gl.enableVertexAttribArray(texCoordAttributeLocation);
        gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        let mainImageTexture = null;
        let waterDisplacementTexture = null;

        const loadAndCreateTexture = (url, textureUnit, isMainImage = false) => {
            const img = new Image();
            img.src = url;
            img.crossOrigin = "anonymous";
            img.onload = () => {
                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                const texture = createAndBindTexture(gl, img);
                if (isMainImage) {
                    mainImageTexture = texture;
                    gl.uniform1i(imageLocation, textureUnit);
                } else {
                    waterDisplacementTexture = texture;
                    gl.uniform1i(waterTextureLocation, textureUnit);
                }
                texturesLoadedRef.current++;
                if (texturesLoadedRef.current === totalTexturesToLoad) {
                    startAnimation();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${url}. Ensure it's in public/ and crossOrigin is set.`);
            };
        };

        loadAndCreateTexture(imageUrl, 0, true);
        loadAndCreateTexture(waterTextureUrl, 1, false);

        const startAnimation = () => {
            const drawScene = () => {
                const gl = glRef.current;
                
                const program = programRef.current;
                if (!gl || !program) return;

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clear(gl.COLOR_BUFFER_BIT);

                gl.uniform2f(uniformLocations.current.resolution, gl.canvas.width, gl.canvas.height);
                gl.uniform1f(uniformLocations.current.time, performance.now() - startTimeRef.current);
                gl.uniform1f(uniformLocations.current.distortionIntensity, currentDistortionIntensity);
                gl.uniform1f(uniformLocations.current.animationSpeed, currentAnimationSpeed);
                gl.uniformMatrix3fv(uniformLocations.current.textureMatrix, false, textureMatrix()); // Pass the calculated texture matrix

                gl.drawArrays(gl.TRIANGLES, 0, 6);

                animationFrameIdRef.current = requestAnimationFrame(drawScene);
            };
            drawScene();
        };

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (gl) {
                gl.deleteProgram(program);
                gl.deleteShader(vertexShader);
                gl.deleteShader(fragmentShader);
                if (mainImageTexture) gl.deleteTexture(mainImageTexture);
                if (waterDisplacementTexture) gl.deleteTexture(waterDisplacementTexture);
                gl.deleteBuffer(positionBuffer);
                gl.deleteBuffer(texCoordBuffer);
            }
            gsap.killTweensOf(setCurrentDistortionIntensity);
            gsap.killTweensOf(setCurrentAnimationSpeed);
        };
    }, [imageUrl, waterTextureUrl, width, height, currentDistortionIntensity, currentAnimationSpeed, borderEffectScale, textureMatrix]); // Add new dependencies


    const handleClick = useCallback(() => {
        if (onClick) {
            onClick();
        }

        gsap.killTweensOf(setCurrentDistortionIntensity);
        gsap.killTweensOf(setCurrentAnimationSpeed);

        gsap.to(
            { value: currentDistortionIntensity },
            {
                value: initialDistortionIntensity * 3,
                duration: 0.2,
                onUpdate: function () {
                    setCurrentDistortionIntensity(this.targets()[0].value);
                },
                onComplete: () => {
                    gsap.to(
                        { value: currentDistortionIntensity },
                        {
                            value: initialDistortionIntensity,
                            duration: 1,
                            ease: "power1.out",
                            onUpdate: function () {
                                setCurrentDistortionIntensity(this.targets()[0].value);
                            },
                        }
                    );
                },
            }
        );

        gsap.to(
            { value: currentAnimationSpeed },
            {
                value: initialAnimationSpeed * 5,
                duration: 0.2,
                onUpdate: function () {
                    setCurrentAnimationSpeed(this.targets()[0].value);
                },
                onComplete: () => {
                    gsap.to(
                        { value: currentAnimationSpeed },
                        {
                            value: initialAnimationSpeed,
                            duration: 1,
                            ease: "power1.out",
                            onUpdate: function () {
                                setCurrentAnimationSpeed(this.targets()[0].value);
                            },
                        }
                    );
                },
            }
        );

    }, [initialDistortionIntensity, initialAnimationSpeed, onClick, currentDistortionIntensity, currentAnimationSpeed]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
            onClick={handleClick}
        />
    );
};

export default WaterEffectCanvas;