"use client";
import Link from "next/link";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { DisplacementFilter } from "@pixi/filter-displacement";

export default function BrandShowcase() {
  const brands = [
    {
      name: "AMAYRA by Bagrecha Gems",
      slug: "/Brands/amayra-by-bagrecha-gems",
    },
    { name: "Amiraah", slug: "/Brands/amiraah" },
    { name: "Blister Hand", slug: "/Brands/blister-hand" },
    { name: "BUTA", slug: "/Brands/buta" },
    { name: "Dayal Opticals", slug: "/Brands/dayal-opticals" },
    { name: "Devans coffee", slug: "/Brands/devans-coffee" },
    { name: "dhartii", slug: "/Brands/dhartii" },
    { name: "DIVIYA KAPOOR", slug: "/Brands/diviya-kapoor" },
    { name: "EBISU", slug: "/Brands/ebisu" },
    { name: "EVEREST BASE CAMP", slug: "/Brands/everest-base-camp" },
    { name: "gaon restaurants", slug: "/Brands/gaon-restaurants" },
    { name: "GAZAL GUPTA", slug: "/Brands/gazal-gupta" },
    { name: "GUR ORGANICS", slug: "/Brands/gur-organics" },
    { name: "INTIKI", slug: "/Brands/intiki" },
    { name: "Kalista Studio", slug: "/Brands/kalista-studio" },
    { name: "Kelby Huston", slug: "/Brands/kelby-huston" },
    { name: "kritika Dawar", slug: "/Brands/kritika-dawar" },
    { name: "LIZ PAUL", slug: "/Brands/liz-paul" },
    {
      name: "Luxury Ampersand Frolics Group",
      slug: "/Brands/luxury-ampersand-frolics-group",
    },
    { name: "MASALA SYNERGY", slug: "/Brands/masala-synergy" },
    { name: "nidhika shekhar", slug: "/Brands/nidhika-shekhar" },
    { name: "ODDCAT", slug: "/Brands/oddcat" },
    { name: "Pernia's Pop-Up Shop", slug: "/Brands/pernias-pop-up-shop" },
    { name: "PICTURE TIME", slug: "/Brands/picture-time" },
    { name: "Rasaiem Luxuury", slug: "/Brands/rasaiem-luxuury" },
    { name: "SEWTABLE CLOTHING", slug: "/Brands/sewtable-clothing" },
    { name: "SHAADI KA LADOO", slug: "/Brands/shaadi-ka-ladoo" },
    { name: "Shakuntlam Xclusif", slug: "/Brands/shakuntlam-xclusif" },
    { name: "SUPRIA MUNJAL", slug: "/Brands/supria-munjal" },
    { name: "TANIA ISRANI", slug: "/Brands/tania-israni" },
    { name: "TARINI VIJ", slug: "/Brands/tarini-vij" },
    { name: "the box boutique", slug: "/Brands/the-box-boutique" },
    { name: "the monk", slug: "/Brands/the-monk" },
    { name: "VASANSI JAIPUR", slug: "/Brands/vasansi-jaipur" },
    { name: "WABY SABY", slug: "/Brands/waby-saby" },
    { name: "Zevar by geeta", slug: "/Brands/zevar-by-geeta" },
  ];

  const listRef = useRef(null);
  const canvasRef = useRef(null);
  const pixiAppRef = useRef(null);
  const textObjectsRef = useRef([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isPixiReady, setIsPixiReady] = useState(false); // New state to track PixiJS readiness
  const maxScrollRef = useRef(0);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === "undefined") return;

    // Set mounted state
    setIsMounted(true);

    // Delay initialization to ensure DOM is ready
    const initializePixi = () => {
      if (!canvasRef.current) {
        console.warn("Canvas ref not available, retrying...");
        setTimeout(initializePixi, 100);
        return;
      }

      const width = window.innerWidth > 0 ? window.innerWidth : 800;
      const height = window.innerHeight > 0 ? window.innerHeight : 600;

      try {
        // Check WebGL support
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          console.error("WebGL is not supported in this browser.");
          return;
        }

        // Initialize PixiJS
        PIXI.utils.skipHello();
        const app = new PIXI.Application({
          view: canvasRef.current,
          width,
          height,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });
        pixiAppRef.current = app;

        // Preload texture using PIXI.Loader
        const loader = new PIXI.Loader();
        loader.add("displacement", "/pattern-clouds.jpg");

        loader.load((loader, resources) => {
          console.log("Displacement texture loaded successfully");
          const displacementSprite = new PIXI.Sprite(resources.displacement.texture);
          displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
          displacementSprite.width = width;
          displacementSprite.height = height;
          displacementSprite.alpha = 0;
          app.stage.addChild(displacementSprite);

          // Create text objects
          const textObjects = brands.map((brand, index) => {
            const text = new PIXI.Text(brand.name.toUpperCase(), {
              fontFamily: "BellotaText-Light, sans-serif",
              fontSize: width < 768 ? 28 : 72,
              fill: 0xffffff,
              align: "center",
              letterSpacing: 0.02,
            });
            text.anchor.set(0.5);
            text.position.set(width / 2, 128 + index * 80);
            const displacementFilter = new DisplacementFilter(displacementSprite);
            displacementFilter.scale.set(width < 768 ? 5 : 15);
            text.filters = [displacementFilter];
            app.stage.addChild(text);
            return text;
          });
          textObjectsRef.current = textObjects;

          // Animate displacement sprite
          gsap.to(displacementSprite, {
            x: "+=100",
            y: "+=100",
            duration: 12,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });

          // Mark PixiJS as ready
          setIsPixiReady(true);

          // Force render
          app.renderer.render(app.stage);
        });

        // Handle texture loading error
        loader.onError.add((error) => {
          console.error("Failed to load displacement texture:", error);
          // Create text objects without displacement filter
          const textObjects = brands.map((brand, index) => {
            const text = new PIXI.Text(brand.name.toUpperCase(), {
              fontFamily: "BellotaText-Light, sans-serif",
              fontSize: width < 768 ? 28 : 72,
              fill: 0xffffff,
              align: "center",
              letterSpacing: 0.02,
            });
            text.anchor.set(0.5);
            text.position.set(width / 2, 128 + index * 80);
            app.stage.addChild(text);
            return text;
          });
          textObjectsRef.current = textObjects;

          // Mark PixiJS as ready even on error
          setIsPixiReady(true);

          // Force render
          app.renderer.render(app.stage);
        });

        // Handle resize
        const handleResize = () => {
          const newWidth = window.innerWidth > 0 ? window.innerWidth : 800;
          const newHeight = window.innerHeight > 0 ? window.innerHeight : 600;
          app.renderer.resize(newWidth, newHeight);
          if (textObjectsRef.current.length > 0 && textObjectsRef.current[0].filters && textObjectsRef.current[0].filters[0]) {
            const displacementSprite = textObjectsRef.current[0].filters[0].sprite;
            if (displacementSprite && displacementSprite.texture.baseTexture.valid) {
              displacementSprite.width = newWidth;
              displacementSprite.height = newHeight;
            }
          }
          textObjectsRef.current.forEach((text, index) => {
            if (text) {
              text.style.fontSize = newWidth < 768 ? 28 : 72;
              text.position.x = newWidth / 2;
              text.position.y = 128 + index * 80 - scrollY;
              if (text.filters && text.filters[0]) {
                text.filters[0].scale.set(newWidth < 768 ? 5 : 15);
              }
            }
          });

          const list = listRef.current;
          if (list && list.lastElementChild) {
            const containerHeight = newHeight;
            const lastItemHeight = list.lastElementChild.offsetHeight;
            const lastItemTop = 128 + (brands.length - 1) * 80;
            maxScrollRef.current = lastItemTop - containerHeight / 2 + lastItemHeight / 2;
            list.style.paddingBottom = `${containerHeight / 2 - lastItemHeight / 2}px`;
            list.style.paddingTop = `${containerHeight / 2 - lastItemHeight / 2}px`;
          }
        };

        // Initialize list positioning
        const list = listRef.current;
        if (list && list.lastElementChild) {
          const containerHeight = height;
          const lastItemHeight = list.lastElementChild.offsetHeight;
          const lastItemTop = 128 + (brands.length - 1) * 80;
          maxScrollRef.current = lastItemTop - containerHeight / 2 + lastItemHeight / 2;
          list.style.paddingBottom = `${containerHeight / 2 - lastItemHeight / 2}px`;
          list.style.paddingTop = `${containerHeight / 2 - lastItemHeight / 2}px`;
          list.scrollTop = 0;
        }

        const handleScroll = () => {
          const list = listRef.current;
          if (!list) return;
          const currentScroll = list.scrollTop;

          if (currentScroll > maxScrollRef.current) {
            list.scrollTop = maxScrollRef.current;
            setScrollY(maxScrollRef.current);
          } else {
            setScrollY(currentScroll);
          }

          textObjectsRef.current.forEach((text, index) => {
            if (text) {
              text.position.y = 128 + index * 80 - currentScroll;
            }
          });
        };

        const handleMouseMove = (e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("resize", handleResize);
        if (list) list.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);

        handleResize();

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize);
          if (list) list.removeEventListener("scroll", handleScroll);
          window.removeEventListener("mousemove", handleMouseMove);
          if (pixiAppRef.current) {
            pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
            pixiAppRef.current = null;
          }
        };
      } catch (error) {
        console.error("Failed to initialize PixiJS:", error);
        setIsPixiReady(true); // Fallback to show HTML if PixiJS fails
      }
    };

    // Wait for DOM to be fully ready
    const timeoutId = setTimeout(initializePixi, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const getItemStyle = (index) => {
    if (!isMounted || !isPixiReady || !textObjectsRef.current[index]) {
      return {
        fontFamily: "BellotaText-Light, sans-serif",
        letterSpacing: "0.02em",
        lineHeight: "1.2",
        visibility: isPixiReady ? "hidden" : "visible", // Hide HTML text once PixiJS is ready
      };
    }

    const isHovered = hoveredIndex === index;
    const distanceFromHovered = hoveredIndex !== null ? Math.abs(index - hoveredIndex) : 0;
    const text = textObjectsRef.current[index];

    if (text) {
      try {
        text.scale.set(isHovered ? 1.05 : Math.max(0.95, 1 - distanceFromHovered * 0.02));
        text.position.x = (window.innerWidth > 0 ? window.innerWidth : 800) / 2 + (isHovered ? 10 : 0);
        text.rotation = 0;
        text.style.letterSpacing = isHovered ? 0.08 : 0.02;
        text.alpha = isHovered ? 1 : 0.8;
      } catch (error) {
        console.error(`Error updating text style for index ${index}:`, error);
      }
    }

    return {
      fontFamily: "BellotaText-Light, sans-serif",
      letterSpacing: isHovered ? "0.08em" : "0.02em",
      lineHeight: "1.2",
      visibility: "hidden",
    };
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
      <div
        className="absolute inset-0 z-5 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 25%, 
            transparent 50%)`,
        }}
      />
      <div
        ref={listRef}
        className="font-bellota-light relative z-20 flex flex-col items-center uppercase justify-start gap-8 py-32 overflow-y-auto no-scrollbar"
        style={{
          scrollBehavior: "smooth",
          perspective: "1000px",
          maxHeight: "100vh",
        }}
      >
        {brands.map((brand, index) => (
          <Link
            key={`${brand.slug}-${index}`}
            href={brand.slug}
            className="group relative text-white text-3xl md:text-8xl font-stretch-95% text-center transition-all duration-500 ease-out cursor-pointer will-change-transform"
            style={getItemStyle(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="relative z-10 block">{brand.name}</span>
            <div
              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                transform: "skewX(-15deg)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{ transformOrigin: "left" }}
            />
          </Link>
        ))}
      </div>
      <div
        className="absolute top-0 left-0 right-0 z-30 pointer-events-none transition-opacity duration-300"
        style={{
          height: "25vh",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          backdropFilter: `blur(${Math.min(scrollY / 50, 8)}px)`,
          opacity: Math.min(scrollY / 100, 0.95),
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none transition-opacity duration-300"
        style={{
          height: "25vh",
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          backdropFilter: `blur(${Math.min(scrollY / 50, 8)}px)`,
          opacity: Math.min(scrollY / 100, 0.95),
        }}
      />
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent relative">
          <div
            className="absolute w-2 h-2 bg-white rounded-full left-1/2 transform -translate-x-1/2 transition-all duration-300"
            style={{
              top: `${Math.min(scrollY / 10, 120)}px`,
              boxShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-40px) translateX(-5px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(-10px) rotate(270deg);
            opacity: 0.4;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .group:hover {
          z-index: 30;
        }
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}