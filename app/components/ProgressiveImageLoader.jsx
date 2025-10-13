"use client";

import { useState, useEffect, useRef } from "react";

const ProgressiveImageLoader = ({ images, onImagesLoaded, children }) => {
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadedCountRef = useRef(0);
  const totalImages = images.length;

  useEffect(() => {
    if (!images || images.length === 0) return;

    const loadImage = (src, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCountRef.current++;
          const progress = (loadedCountRef.current / totalImages) * 100;
          setLoadingProgress(progress);
          
          setLoadedImages(prev => {
            const newLoaded = [...prev];
            newLoaded[index] = { src, loaded: true };
            
            // Call onImagesLoaded when all images are loaded
            if (loadedCountRef.current === totalImages) {
              setTimeout(() => onImagesLoaded?.(newLoaded.filter(img => img?.loaded).map(img => img.src)), 100);
            }
            
            return newLoaded;
          });
          resolve(src);
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${src}`);
          loadedCountRef.current++;
          const progress = (loadedCountRef.current / totalImages) * 100;
          setLoadingProgress(progress);
          resolve(null); // Continue loading other images
        };
        img.src = src;
      });
    };

    // Load images with priority (first few images load immediately, others with delay)
    const priorityImages = images.slice(0, 4);
    const remainingImages = images.slice(4);

    // Load priority images immediately
    Promise.all(priorityImages.map((src, index) => loadImage(src, index)))
      .then(() => {
        // Load remaining images with a small delay to prevent blocking
        setTimeout(() => {
          remainingImages.forEach((src, index) => {
            setTimeout(() => loadImage(src, index + 4), index * 50); // Stagger loading
          });
        }, 200);
      });

    return () => {
      loadedCountRef.current = 0;
      setLoadedImages([]);
      setLoadingProgress(0);
    };
  }, [images, onImagesLoaded, totalImages]);

  return children({ loadedImages, loadingProgress });
};

export default ProgressiveImageLoader;

