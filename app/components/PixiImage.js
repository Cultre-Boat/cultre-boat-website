"use client";
import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { DisplacementFilter } from '@pixi/filter-displacement';
import DisplacementFilter from "@pixi/filter-displacement";


gsap.registerPlugin(ScrollTrigger);

export default function PixiImage({ containerRef, leftImages, rightImages, onMaxScrollCalculated }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const app = new PIXI.Application({
            view: canvasRef.current,
            resizeTo: window,
            backgroundColor: 0x000000,
            backgroundAlpha: 1,
        });

        const leftContainer = new PIXI.Container();
        const rightContainer = new PIXI.Container();
        app.stage.addChild(leftContainer, rightContainer);

        const imageWidth = window.innerWidth * 0.35;
        const imageHeight = imageWidth * (4 / 3);
        const gap = window.innerHeight * 0.1;

        // --- IMAGE CREATION (Synchronous) ---
        // Using PIXI.Sprite.from is more compatible with older PixiJS versions.
        leftImages.forEach((src, i) => {
            const sprite = PIXI.Sprite.from(src);
            sprite.width = imageWidth;
            sprite.height = imageHeight;
            sprite.y = i * (imageHeight + gap);
            leftContainer.addChild(sprite);
        });

        rightImages.forEach((src, i) => {
            const sprite = PIXI.Sprite.from(src);
            sprite.width = imageWidth;
            sprite.height = imageHeight;
            sprite.y = i * (imageHeight + gap);
            rightContainer.addChild(sprite);
        });

        // --- POSITIONING & SCROLL CALCULATION ---
        const positionContainers = () => {
            const screenWidth = window.innerWidth;
            leftContainer.x = screenWidth * 0.5 - imageWidth - screenWidth * 0.02;
            rightContainer.x = screenWidth * 0.5 + screenWidth * 0.02;
        };
        positionContainers();

        // Calculate the maximum scroll distance after containers are populated
        const leftColHeight = leftContainer.height;
        const rightColHeight = rightContainer.height;
        const maxScroll = Math.max(leftColHeight, rightColHeight) - window.innerHeight;

        // Pass the calculated value back to the parent component
        if (onMaxScrollCalculated) {
            onMaxScrollCalculated(maxScroll);
        }

        // --- GSAP ANIMATION SETUP ---
        // Set initial positions for the scroll animation
        gsap.set(leftContainer, { y: 0 });
        gsap.set(rightContainer, { y: -rightColHeight + window.innerHeight });

        // Create the scroll-based animation for the Pixi containers
        gsap.to(leftContainer, {
            y: (-leftColHeight + window.innerHeight),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `${maxScroll * 1.5}px`,
                scrub: 2,
            },
        });

        gsap.to(rightContainer, {
            y: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: () => `${maxScroll * 1.5}px`,
                scrub: 2,
            },
        });
        console.log(PIXI.filters);
        // --- WATER DISTORTION EFFECT ---
        const displacementSprite = PIXI.Sprite.from(
            "https://raw.githubusercontent.com/Pierrinho/elephant/master/pattern-clouds.jpg"
            // "/water 0342.jpg"
        );
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        const displacementFilter = new DisplacementFilter(displacementSprite);
        displacementSprite.scale.set(0.4);
        app.stage.addChild(displacementSprite);
        app.stage.filters = [displacementFilter];

        app.ticker.add(() => {
            displacementSprite.x += 0.5;
            displacementSprite.y += 0.5;
        });


        // --- CLEANUP ---
        window.addEventListener('resize', positionContainers);

        return () => {
            window.removeEventListener('resize', positionContainers);
            app.destroy(true, { children: true, texture: true, baseTexture: true });
            ScrollTrigger.getTweensOf(containerRef.current).forEach(tween => tween.kill());
        };
    }, [containerRef, leftImages, rightImages, onMaxScrollCalculated]);

    
    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-[0]"
        />
    );
}