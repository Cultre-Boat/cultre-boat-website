"use client";

import React, { useEffect, useRef } from 'react';

// This component creates an interactive underwater scene using PIXI.js.
// All logic is self-contained and it will not interfere with other components.
const UnderwaterEffect = () => {
    const canvasRef = useRef(null);
    const pixiAppRef = useRef(null); // Use a ref to hold the PIXI app instance

    useEffect(() => {
        // A helper function to dynamically load a script
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Script load error for ${src}`));
                document.body.appendChild(script);
            });
        };

        // Main function to initialize the PIXI scene
        const initPixi = async () => {
            try {
                // Load PIXI.js and GSAP libraries from a CDN
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.3/pixi.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js');

                if (!canvasRef.current) return;
                
                // Create a new PIXI Application
                const app = new PIXI.Application({
                    view: canvasRef.current,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    transparent: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });
                
                pixiAppRef.current = app; // Store the app instance

                // Asset URLs
                const assets = {
                    displacementMap: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/displacementmap2.png?v=1",
                    background: "https://cdn.pixabay.com/photo/2016/11/29/07/35/adventure-1868110_1280.jpg",
                    fish: "https://www.pngmart.com/files/11/Clownfish-PNG-File.png"
                };

                // Use the PIXI loader to load assets
                app.loader
                    .add("displacementMap", assets.displacementMap)
                    .add("background", assets.background)
                    .add("fish", assets.fish)
                    .load(onAssetsLoaded);

                function onAssetsLoaded(loader, resources) {
                    // Create sprites
                    const container = new PIXI.Container();
                    const backgroundSprite = new PIXI.Sprite(resources.background.texture);
                    const fishSprite = new PIXI.Sprite(resources.fish.texture);
                    const displacementSprite = new PIXI.Sprite(resources.displacementMap.texture);

                    // Scale background to fit the screen
                    backgroundSprite.width = app.screen.width;
                    backgroundSprite.height = app.screen.height;

                    // Configure fish sprite
                    fishSprite.anchor.set(0.5);
                    fishSprite.scale.set(0.2);
                    fishSprite.position.set(app.screen.width / 2, app.screen.height / 2);
                    fishSprite.interactive = true;
                    fishSprite.buttonMode = true;

                    // Add drag-and-drop functionality to the fish
                    fishSprite
                        .on("pointerdown", onDragStart)
                        .on("pointerup", onDragEnd)
                        .on("pointerupoutside", onDragEnd)
                        .on("pointermove", onDragMove);

                    // Configure displacement filter for the ripple effect
                    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
                    displacementFilter.scale.x = 50;
                    displacementFilter.scale.y = 50;
                    
                    // Add sprites and filter to the stage
                    container.addChild(backgroundSprite);
                    container.addChild(fishSprite);
                    container.addChild(displacementSprite); // Add to container to be part of the filter
                    app.stage.addChild(container);

                    app.stage.filters = [displacementFilter];

                    // Animate the displacement map to create the water effect
                    gsap.to(displacementSprite, {
                        duration: 5,
                        x: 512,
                        y: 512,
                        ease: "none",
                        repeat: -1,
                    });

                    // Drag handlers
                    let dragging = false;
                    let dragData = null;

                    function onDragStart(event) {
                        this.alpha = 0.8;
                        dragData = event.data;
                        dragging = true;
                    }

                    function onDragMove() {
                        if (dragging) {
                            const newPosition = dragData.getLocalPosition(this.parent);
                            this.position.x = newPosition.x;
                            this.position.y = newPosition.y;
                        }
                    }

                    function onDragEnd() {
                        this.alpha = 1;
                        dragging = false;
                        dragData = null;
                    }
                }
                
                // Handle window resize
                const handleResize = () => {
                    app.renderer.resize(window.innerWidth, window.innerHeight);
                    // You might want to reposition elements here if needed
                };
                window.addEventListener('resize', handleResize);

            } catch (error) {
                console.error("Failed to initialize PIXI scene:", error);
            }
        };

        initPixi();

        // Cleanup function to run when the component unmounts
        return () => {
            // Destroy the PIXI application to free up resources
            if (pixiAppRef.current) {
                pixiAppRef.current.destroy(true, { 
                    children: true, 
                    texture: true, 
                    baseTexture: true 
                });
                pixiAppRef.current = null;
            }
            // Remove resize listener
            window.removeEventListener('resize', () => {});
        };
    }, []); // The empty dependency array ensures this runs only once on mount

    return (
        <>
            {/* Styles to make the canvas a fixed background element */}
            <style>{`
                #pixi-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1; /* Place it behind other content */
                }
            `}</style>
            <canvas id="pixi-canvas" ref={canvasRef} />
        </>
    );
};

export default UnderwaterEffect;