"use client";

import { useEffect, useRef } from "react";

export default function WaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      const scale = window.devicePixelRatio || 1;
      canvas.width = 30 * scale;
      canvas.height = 40 * scale;
      canvas.style.width = "30px";
      canvas.style.height = "40px";
      ctx.scale(scale, scale);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let t = 0;

    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const amplitude = 7;
      const peaks = 1;
      const yOffset = 25;

      const startX = 0;
      const endX = 30;

      const middleStart = endX * 0.05;
      const middleEnd = endX * 0.95;
      const middleWidth = middleEnd - middleStart;

      ctx.beginPath();
      ctx.moveTo(startX, yOffset);

      ctx.lineTo(middleStart, yOffset);

      for (let x = middleStart; x <= middleEnd; x++) {
        const waveProgress = ((x - middleStart) / middleWidth) * Math.PI * peaks * 2;
        const y = yOffset + Math.sin(waveProgress - t) * amplitude;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(endX, yOffset);

      ctx.strokeStyle = "rgba(245, 248, 248, 1)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      t += 0.2;
      console.log("Drawing wave at time:", t);
      requestAnimationFrame(drawWave);
    }
    
    drawWave();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "30px",
        width: "50px",
        height: "50px",
        zIndex: 9999999,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
