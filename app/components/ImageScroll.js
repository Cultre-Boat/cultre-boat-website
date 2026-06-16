"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";

gsap.registerPlugin(ScrollTrigger);

export default function ImageScroll({ containerRef, leftImages, rightImages, onMaxScrollCalculated }) {
    const leftContainerRef = useRef(null);
    const rightContainerRef = useRef(null);
    const [dimensions, setDimensions] = useState({
        imageWidth: 0,
        imageHeight: 0,
        gap: 0,
        sideMargin: 0,
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const { ref: inViewRef, inView } = useInView({ threshold: 0.1 });

    // Preload critical images
    useEffect(() => {
        const preloadImages = async () => {
            const limitedLeftImages = leftImages.slice(0, 4); // Limit to 4 images
            const limitedRightImages = rightImages.slice(0, 4); // Limit to 4 images
            const imagePromises = [...limitedLeftImages, ...limitedRightImages].map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = resolve;
                    img.onerror = () => {
                        console.error(`Failed to preload image: ${src}`);
                        resolve(); // Continue despite errors
                    };
                });
            });
            await Promise.all(imagePromises);
            setIsLoaded(true);
        };
        preloadImages();
    }, [leftImages, rightImages]);

    // Debounced dimension update
    const updateDimensions = useCallback(() => {
        const isMobile = window.innerWidth <= 768;
        const imageWidth = Math.min(window.innerWidth * (isMobile ? 0.4 : 0.3), 300); // Cap width for performance
        const imageHeight = imageWidth * (4 / 3);
        const gap = window.innerHeight * (isMobile ? 0.2 : 0.15); // Larger gap for fewer images
        const sideMargin = window.innerWidth * (isMobile ? 0.01 : 0.02); // Smaller side margins
        setDimensions({ imageWidth, imageHeight, gap, sideMargin });
    }, []);

    // Handle resize
    useEffect(() => {
        updateDimensions(); // Initial dimensions
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateDimensions, 150); // Increase debounce
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [updateDimensions]);

    useEffect(() => {
        if (!containerRef.current || !leftContainerRef.current || !rightContainerRef.current || dimensions.imageWidth === 0 || !isLoaded) return;

        // Positioning containers
        const positionContainers = () => {
            const screenWidth = window.innerWidth;
            leftContainerRef.current.style.left = `${screenWidth * 0.5 - dimensions.imageWidth - dimensions.sideMargin}px`;
            rightContainerRef.current.style.left = `${screenWidth * 0.5 + dimensions.sideMargin}px`;
        };
        positionContainers();

        // Calculate max scroll
        const limitedLeftImages = leftImages.slice(0, 4); // Limit to 4 images
        const limitedRightImages = rightImages.slice(0, 4); // Limit to 4 images
        const leftColHeight = limitedLeftImages.length * (dimensions.imageHeight + dimensions.gap) - dimensions.gap;
        const rightColHeight = limitedRightImages.length * (dimensions.imageHeight + dimensions.gap) - dimensions.gap;
        const maxScroll = Math.max(leftColHeight, rightColHeight) - window.innerHeight;
        if (onMaxScrollCalculated) {
            onMaxScrollCalculated(maxScroll);
        }

        // GSAP animations
        ScrollTrigger.config({ limitCallbacks: true, fastScrollEnd: true }); // Optimize ScrollTrigger
        gsap.set(leftContainerRef.current, { y: 0 });
        gsap.set(rightContainerRef.current, { y: -rightColHeight + window.innerHeight });
        gsap.to(leftContainerRef.current, {
            y: -leftColHeight + window.innerHeight,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `${maxScroll * 1.5}px`,
                scrub: 1, // Reduce scrub for smoother scrolling
                invalidateOnRefresh: true,
            },
        });
        gsap.to(rightContainerRef.current, {
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `${maxScroll * 1.5}px`,
                scrub: 1, // Reduce scrub
                invalidateOnRefresh: true,
            },
        });

        // Animate SVG filter (only when in view)
        let animationFrameId;
        if (inView) {
            const filter = document.querySelector('#wateryFilter feTurbulence');
            let freqX = 0.01;
            let freqY = 0.01;
            let lastTime = 0;
            const animateFilter = (time) => {
                if (time - lastTime >= 32) { // Throttle to ~30 FPS
                    freqX += 0.00005;
                    freqY += 0.00005;
                    filter.setAttribute('baseFrequency', `${freqX} ${freqY}`);
                    lastTime = time;
                }
                animationFrameId = requestAnimationFrame(animateFilter);
            };
            animationFrameId = requestAnimationFrame(animateFilter);
        }

        // Resize listener for positioning
        const handlePositionResize = () => {
            positionContainers();
        };
        window.addEventListener('resize', handlePositionResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handlePositionResize);
            if (containerRef.current) {
                gsap.getTweensOf(containerRef.current).forEach(tween => tween.kill());
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [containerRef, leftImages, rightImages, onMaxScrollCalculated, dimensions.imageWidth, dimensions.imageHeight, dimensions.gap, dimensions.sideMargin, isLoaded, inView]);

    return (
        <div ref={inViewRef}>
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="wateryFilter">
                    <feTurbulence type="turbulence" baseFrequency="0.01 0.01" numOctaves="2" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
            </svg>
            <div className="fixed top-0 left-0 w-full h-full z-[-1]">
                {!isLoaded && (
                    <div className="flex items-center justify-center w-full h-full bg-black text-white">
                        Loading images...
                    </div>
                )}
                {isLoaded && (
                    <>
                        <div
                            ref={leftContainerRef}
                            className="absolute flex flex-col"
                            style={{ gap: `${dimensions.gap}px` }}
                        >
                            {leftImages.slice(0, 4).map((src, i) => (
                                <img
                                    key={`left-${i}`}
                                    src={src}
                                    alt={`Left image ${i}`}
                                    style={{
                                        width: `${dimensions.imageWidth}px`,
                                        height: `${dimensions.imageHeight}px`,
                                        filter: inView ? 'url(#wateryFilter)' : 'none', // Disable filter off-screen
                                        objectFit: 'cover',
                                    }}
                                    onError={() => console.error(`Failed to load left image: ${src}`)}
                                    loading="lazy"
                                />
                            ))}
                        </div>
                        <div
                            ref={rightContainerRef}
                            className="absolute flex flex-col"
                            style={{ gap: `${dimensions.gap}px` }}
                        >
                            {rightImages.slice(0, 4).map((src, i) => (
                                <img
                                    key={`right-${i}`}
                                    src={src}
                                    alt={`Right image ${i}`}
                                    style={{
                                        width: `${dimensions.imageWidth}px`,
                                        height: `${dimensions.imageHeight}px`,
                                        filter: inView ? 'url(#wateryFilter)' : 'none', // Disable filter off-screen
                                        objectFit: 'cover',
                                    }}
                                    onError={() => console.error(`Failed to load right image: ${src}`)}
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}