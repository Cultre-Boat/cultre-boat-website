'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function BrandShowcase() {
  const brands = [
    { name: "AMAYRA by Bagrecha Gems", slug: "/Brands/amayra-by-bagrecha-gems", image: "/placeholder-brand-image.jpg" },
    { name: "Amiraah", slug: "/Brands/amiraah", image: "/placeholder-brand-image.jpg" },
    { name: "Bhumika Sharma", slug: "/Brands/Bhumika-sharma", image: "/placeholder-brand-image.jpg" },
    { name: "Blister Hand", slug: "/Brands/blister-hand", image: "/placeholder-brand-image.jpg" },
    { name: "dhartii", slug: "/Brands/dhartii", image: "/placeholder-brand-image.jpg" },
    { name: "Dayal Opticals", slug: "/Brands/dayal-opticals", image: "/placeholder-brand-image.jpg" },
    { name: "Devans coffee", slug: "/Brands/devans-coffee", image: "/placeholder-brand-image.jpg" },
    { name: "gaon restaurants", slug: "/Brands/gaon-restaurants", image: "/placeholder-brand-image.jpg" },
    { name: "Gazal Gupta", slug: "/Brands/Ghazal-gupta", image: "/placeholder-brand-image.jpg" },
    { name: "Kalista Studio", slug: "/Brands/kalista-studio", image: "/placeholder-brand-image.jpg" },
    { name: "Kelby Huston", slug: "/Brands/kelby-huston", image: "/placeholder-brand-image.jpg" },
    { name: "kritika Dawar", slug: "/Brands/kritika-dawar", image: "/placeholder-brand-image.jpg" },
    { name: "LIZ PAUL", slug: "/Brands/liz-paul", image: "/placeholder-brand-image.jpg" },
    { name: "Luxury Ampersand Frolics Group", slug: "/Brands/luxury-ampersand-frolics-group", image: "/placeholder-brand-image.jpg" },
    { name: "nidhika shekhar", slug: "/Brands/nidhika-shekhar", image: "/placeholder-brand-image.jpg" },
    { name: "Pernia's Pop-Up Shop", slug: "/Brands/pernias-pop-up-shop", image: "/placeholder-brand-image.jpg" },
    { name: "Rasaiem Luxuury", slug: "/Brands/rasaiem-luxuury", image: "/placeholder-brand-image.jpg" },
    { name: "Shakuntlam Xclusif", slug: "/Brands/shakuntlam-xclusif", image: "/placeholder-brand-image.jpg" },
    { name: "the box boutique", slug: "/Brands/the-box-boutique", image: "/placeholder-brand-image.jpg" },
    { name: "the monk", slug: "/Brands/the-monk", image: "/placeholder-brand-image.jpg" },
    { name: "VASANSI JAIPUR", slug: "/Brands/vasansi-jaipur", image: "/placeholder-brand-image.jpg" },
    { name: "Zevar by geeta", slug: "/Brands/zevar-by-geeta", image: "/placeholder-brand-image.jpg" },
  ];

  const listRef = useRef(null);
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !pixiContainerRef.current) return;

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
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.padding = 30;
    if (window.innerWidth < 768) {
      displacementFilter.scale.set(10, 10); // Softer waves for mobile
    } else {
      displacementFilter.scale.set(15, 15); // Stronger waves for desktop
    }
    app.stage.addChild(displacementSprite);

    // Create PIXI sprites and text for each brand
    const elements = [];
    const updateElements = () => {
      // Clear previous sprites
      app.stage.children = [displacementSprite];

      const textElements = list.querySelectorAll('.brand-text');
      const imageElements = list.querySelectorAll('.brand-image');

      elements.length = 0;

      // Process images
      imageElements.forEach((el, index) => {
        const src = el.src;
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

        const text = new PIXI.Text(textContent, {
          fontFamily: 'BellotaText-Light, sans-serif',
          fontSize: window.innerWidth < 768 ? 32 : 96,
          fill: 0xffffff,
          align: 'center',
          letterSpacing: 0.02 * (window.innerWidth < 768 ? 32 : 96),
          lineHeight: 1.2 * (window.innerWidth < 768 ? 32 : 96),
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

    // Scroll handling for list
    list.scrollTop = 0;
    const handleScroll = () => {
      updatePositions();
    };
    list.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      const textElements = list.querySelectorAll('.brand-text');
      const imageElements = list.querySelectorAll('.brand-image');
      textElements.forEach((el) => (el.style.opacity = '1'));
      imageElements.forEach((el) => (el.style.opacity = '1'));
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      list.removeEventListener('scroll', handleScroll);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current) pixiContainerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* PIXI canvas container */}
      <div ref={pixiContainerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />

      {/* Brands List */}
      <div
        ref={listRef}
        className="font-bellota-light relative z-20 flex flex-col items-center uppercase justify-start gap-8 py-28 h-full overflow-y-auto no-scrollbar"
      >
        {brands.map((brand, index) => (
          <div key={`${brand.slug}-${index}`} className="flex flex-col items-center gap-4">
            {/* Image */}
            <img
              src={brand.image}
              alt={brand.name}
              className="brand-image w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg"
            />
            {/* Text wrapped in Link */}
            <Link
              href={brand.slug}
              className="brand-text text-white opacity-30 text-2xl md:text-7xl font-stretch-95% text-center hover:opacity-80 active:opacity-80 focus:opacity-80 transition-opacity duration-300"
              style={{
                fontFamily: 'BellotaText-Light, sans-serif',
                letterSpacing: '0.02em',
                lineHeight: '1.2',
              }}
            >
              {brand.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Remove scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}