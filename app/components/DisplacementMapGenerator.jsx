// components/DisplacementMapGenerator.jsx
import React, { useEffect, useRef } from 'react';

const DisplacementMapGenerator = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 512;
    const height = 512;
    
    canvas.width = width;
    canvas.height = height;
    
    // Create water-like displacement map
    const createDisplacementMap = () => {
      // Fill with a mid-gray
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, width, height);
      
      // Draw random grayscale noise
      for (let x = 0; x < width; x += 4) {
        for (let y = 0; y < height; y += 4) {
          const value = 128 + Math.random() * 128;
          ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
      
      // Apply blur for smoother effect
      ctx.filter = 'blur(8px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
      
      // Add some wave patterns
      for (let i = 0; i < 5; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const radius = 50 + Math.random() * 100;
        
        const gradient = ctx.createRadialGradient(
          startX, startY, 0,
          startX, startY, radius
        );
        
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Save displacement map
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'displacement-map.png';
      a.textContent = 'Download Displacement Map';
      a.style.display = 'block';
      a.style.marginTop = '10px';
      
      // Add link to page
      const container = canvas.parentNode;
      container.appendChild(a);
    };
    
    createDisplacementMap();
  }, []);
  
  return (
    <div>
      <h2>Displacement Map Generator</h2>
      <p>Use this tool to generate a displacement map for your water effect.</p>
      <canvas 
        ref={canvasRef} 
        style={{ border: '1px solid #ccc', maxWidth: '100%' }}
      />
    </div>
  );
};

export default DisplacementMapGenerator;