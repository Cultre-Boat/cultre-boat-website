'use client';
import { useEffect, useRef, useState } from 'react';

const useSpotlightEffect = (config = {}) => {
  const {
    spotlightSize = 300,        // Adjust base size
    spotlightIntensity = 1.5,
    fadeSpeed = 0.1,            // Slower fade for trail effect
    glowColor = '255, 255, 255',
    pulseSpeed = 2000,
    maxSpotlights = 20,         // Max number of active spotlights
    spotlightLifespan = 1000,   // How long a spotlight lasts (ms)
    mouseMoveThreshold = 10,    // Min distance mouse must move to create new spotlight
  } = config;

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  // Change spotlightPos to an array of spotlight objects
  const spotlights = useRef([]);
  const lastMousePos = useRef({ x: 0, y: 0 }); // To track significant mouse movement
  const animationFrame = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return; // Add null checks here for safety

    ctxRef.current = ctx;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const handleMouseMove = (e) => {
      const currentMouseX = e.clientX;
      const currentMouseY = e.clientY;

      // Calculate distance moved
      const dx = currentMouseX - lastMousePos.current.x;
      const dy = currentMouseY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only add a new spotlight if mouse moved past a threshold
      if (distance > mouseMoveThreshold) {
        if (spotlights.current.length >= maxSpotlights) {
          spotlights.current.shift(); // Remove oldest spotlight if max is reached
        }
        spotlights.current.push({
          x: currentMouseX,
          y: currentMouseY,
          targetX: currentMouseX,
          targetY: currentMouseY,
          creationTime: Date.now(),
        });
        lastMousePos.current = { x: currentMouseX, y: currentMouseY };
      }
    };

    // No specific handleMouseLeave needed if spotlights fade out on their own

    const render = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now();

      // Filter out expired spotlights and update positions for remaining
      spotlights.current = spotlights.current.filter(spotlight => {
        const age = currentTime - spotlight.creationTime;
        return age < spotlightLifespan;
      });

      // Render each spotlight
      spotlights.current.forEach(spotlight => {
        spotlight.x = lerp(spotlight.x, spotlight.targetX, fadeSpeed);
        spotlight.y = lerp(spotlight.y, spotlight.targetY, fadeSpeed);

        const age = currentTime - spotlight.creationTime;
        // Calculate alpha based on age, fading out towards the end of lifespan
        const fadeAlpha = 1 - (age / spotlightLifespan); // 1 (new) -> 0 (old)

        const pulseScale = 1 + 0.1 * Math.sin((currentTime / pulseSpeed) * Math.PI * 2);
        const currentSpotlightSize = spotlightSize * pulseScale;

        // Main spotlight (destination-out)
        const gradient = ctx.createRadialGradient(
          spotlight.x,
          spotlight.y,
          0,
          spotlight.x,
          spotlight.y,
          currentSpotlightSize
        );
        // Intensity also fades out
        gradient.addColorStop(0, `rgba(${glowColor}, ${spotlightIntensity * fadeAlpha})`);
        gradient.addColorStop(0.5, `rgba(${glowColor}, ${spotlightIntensity * 0.5 * fadeAlpha})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          spotlight.x,
          spotlight.y,
          currentSpotlightSize,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Glow effect (source-over)
        ctx.globalCompositeOperation = 'source-over';
        const glowGradient = ctx.createRadialGradient(
          spotlight.x,
          spotlight.y,
          0,
          spotlight.x,
          spotlight.y,
          currentSpotlightSize * 1.2
        );
        // Glow also fades out
        glowGradient.addColorStop(0, `rgba(${glowColor}, ${0.2 * fadeAlpha})`);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(
          spotlight.x,
          spotlight.y,
          currentSpotlightSize * 1.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      animationFrame.current = requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    // document.removeEventListener('mouseleave', handleMouseLeave); // Not strictly needed for multi-spotlight fade
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      // document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [spotlightSize, spotlightIntensity, fadeSpeed, glowColor, pulseSpeed, maxSpotlights, spotlightLifespan, mouseMoveThreshold]);

  return canvasRef;
};

export default useSpotlightEffect;