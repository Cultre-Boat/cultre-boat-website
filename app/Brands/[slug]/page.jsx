'use client';
import React, {useRef, useEffect} from 'react';
import Image from 'next/image';
import { IndustriesData } from "../Data.js";
import * as PIXI from 'pixi.js';
import { DisplacementFilter } from '@pixi/filter-displacement';

export default function BrandShowcase({ params: paramsPromise }) {
  // Unwrap the params Promise using React.use()
  const params = React.use(paramsPromise);
  const { slug } = params;

  const brand = IndustriesData[slug];

  if (!brand) {
    return <div className="text-center text-white mt-20">Brand not found</div>;
  }

  const metrics = brand.metrics || {
    influencers: "40+ Influencer Collaboration",
    growth: "37% Growth in Brand Retention",
    celebrities: "10+ Celebrity Placements"
  };

  const additionalImages = brand.additionalImages || [
    brand.images[0],
    brand.images[1],
    brand.images[2]
  ];

  const containerRef = useRef(null);
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pixiContainerRef.current) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    pixiContainerRef.current.appendChild(app.view);
    app.view.style.position = 'absolute';
    app.view.style.top = '0';
    app.view.style.left = '0';
    app.view.style.pointerEvents = 'none';

    // Displacement sprite
    const displacementSprite = PIXI.Sprite.from(
      'https://raw.githubusercontent.com/Pierrinho/elephant/master/pattern-clouds.jpg'
    );
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.scale.set(0.4);
    displacementSprite.alpha = 0;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    const displacementFilter = new DisplacementFilter(displacementSprite);
    displacementFilter.padding = 30;
    if (window.innerWidth < 768) {
      displacementFilter.scale.set(10, 10); // Softer waves for mobile
    } else {
      displacementFilter.scale.set(15, 15); // Stronger waves for desktop
    }
    app.stage.addChild(displacementSprite);

    // Create PIXI sprites and text
    const elements = [];
    const updateElements = () => {
      // Clear previous sprites except displacementSprite
      app.stage.children = [displacementSprite];

      // Target text elements (h1, p, h2, h3)
      const textElements = container.querySelectorAll('h1, p, h2, h3');
      const imageElements = container.querySelectorAll('img, .next-image');

      elements.length = 0;

      // Process images
      imageElements.forEach((el, index) => {
        const src = el.src || el.dataset.src; // Handle Next.js Image (dataset.src for lazy-loaded images)
        if (!src) return;

        const rect = el.getBoundingClientRect();
        const sprite = PIXI.Sprite.from(src);
        sprite.width = rect.width;
        sprite.height = rect.height;
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        sprite.anchor.set(0.5);
        sprite.filters = [displacementFilter];
        sprite.visible = rect.top < window.innerHeight && rect.bottom > 0;

        app.stage.addChild(sprite);
        elements.push({ sprite, element: el, type: 'image' });
        el.style.opacity = '0';
      });

      // Process text
      textElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const textContent = el.textContent;
        const computedStyle = window.getComputedStyle(el);

        const fontSize = parseFloat(computedStyle.fontSize);
        const fontFamily = computedStyle.fontFamily;
        const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2;
        const letterSpacing = parseFloat(computedStyle.letterSpacing) || 0;

        const text = new PIXI.Text(textContent, {
          fontFamily: fontFamily,
          fontSize: fontSize,
          fill: computedStyle.color === 'rgb(255, 255, 255)' ? 0xffffff : 0xaaaaaa, // Handle white and gray-400
          align: 'left',
          letterSpacing: letterSpacing,
          lineHeight: lineHeight,
        });
        text.x = rect.left + rect.width / 2;
        text.y = rect.top + rect.height / 2;
        text.anchor.set(0.5);
        text.filters = [displacementFilter];
        text.visible = rect.top < window.innerHeight && rect.bottom > 0;

        app.stage.addChild(text);
        elements.push({ sprite: text, element: el, type: 'text' });
        el.style.opacity = '0';
      });
    };

    // Animation loop
    const isSmallScreen = window.innerWidth < 768;
    const speed = isSmallScreen ? 0.2 : 0.3;
    app.ticker.add(() => {
      displacementSprite.x += speed;
      displacementSprite.y += speed;
    });

    // Update positions on scroll and resize
    const updatePositions = () => {
      elements.forEach(({ sprite, element, type }) => {
        const rect = element.getBoundingClientRect();
        sprite.width = type === 'image' ? rect.width : sprite.width;
        sprite.height = type === 'image' ? rect.height : sprite.height;
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        sprite.visible = rect.top < window.innerHeight && rect.bottom > 0;
      });
      app.renderer.resize(window.innerWidth, window.innerHeight);
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
    };

    // Initial update
    updateElements();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    // Cleanup
    return () => {
      const textElements = container.querySelectorAll('h1, p, h2, h3');
      const imageElements = container.querySelectorAll('img, .next-image');
      textElements.forEach((el) => (el.style.opacity = '1'));
      imageElements.forEach((el) => (el.style.opacity = '1'));
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current) pixiContainerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="mt-20 text-white min-h-screen p-4 sm:p-10" ref={containerRef}>
      {/* PIXI canvas container */}
      <div ref={pixiContainerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      <div className="mb-10 sm:mb-20 z-20 relative">
        {/* Main Heading and Description */}
        <h1 className="text-3xl sm:text-5xl font-bold">{brand.name}</h1>
        <p className="text-base sm:text-lg mt-2 text-gray-400">{brand.description}</p>

        {/* Grid Layout for Image and Bullet Points */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 mt-6 sm:mt-8">
          {/* Main Image */}
          <div className="col-span-1 sm:col-span-7">
            <img
              src={brand.images[0]}
              alt={brand.name}
              className="w-full"
            />
          </div>

          {/* Bullet Points */}
          <div className="col-span-1 sm:col-span-5 flex flex-col justify-start sm:justify-center mt-4 sm:mt-0">
            {brand.points.map((point, index) => (
              <p key={index} className="text-base sm:text-lg mt-2 sm:mt-0">{point}</p>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 mt-8 sm:mt-10">
          <div className="col-span-1 sm:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-semibold">{brand.overview.title}</h2>
            {brand.overview.points.map((point, index) => (
              <p key={index} className="text-base sm:text-lg text-gray-400 mt-2">{point}</p>
            ))}
          </div>

          {/* Additional Images */}
          <div className="col-span-1 sm:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-0">
            {brand.images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-full lg:h-full"
              />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between text-white p-4 sm:p-8 md:p-16 gap-6 sm:gap-8 md:gap-16 mt-8 sm:mt-16">
          <div className="relative flex items-start justify-center w-full">
            {/* Main central image - taller image */}
            <div className="relative w-full h-60 sm:h-96 md:h-[650px] z-10">
              <Image
                src={additionalImages[0] || brand.images[0]}
                alt={`${brand.name} Main Image`}
                layout="fill"
                className="next-image object-contain rounded-lg"
                objectFit="cover"
                data-src={additionalImages[0] || brand.images[0]} // For PIXI to access src
              />
            </div>
          </div>

          {/* Right side content */}
          <div className="relative w-full md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">APPROACH</h3>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-4">
              {brand.metrics?.content || "40+ Influencer Collaboration"}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-4">
              {brand.metrics?.influencers || "40+ Influencer Collaboration"}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-4">
              {brand.metrics?.growth || "37% Growth in Brand Retention"}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-4">
              {brand.metrics?.celebrities || "10+ Celebrity Placements"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}