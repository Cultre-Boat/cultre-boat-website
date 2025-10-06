"use client";
import Link from "next/link";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import MovingFog from "../components/MovingFog";
import FullScreenWaterEffect from "../components/FullScreenWaterEffect";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // This state is key

 useEffect(() => {
  setIsMounted(true);

  const list = listRef.current;
  if (!list) return;

  // Center the last item
  const lastItem = list.lastElementChild;
  if (lastItem) {
    const containerHeight = list.offsetHeight;
    const lastItemHeight = lastItem.offsetHeight;
    list.style.paddingBottom = `${containerHeight / 2 - lastItemHeight / 2}px`;
  }

  list.scrollTop = 0;

  const handleScroll = () => setScrollY(list.scrollTop);
  const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });

  list.addEventListener("scroll", handleScroll);
  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    list.removeEventListener("scroll", handleScroll);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, []);


  // ✅ THE FIX IS HERE
  const getItemStyle = (index) => {
    // Before the component is mounted, return a default, static style.
    // This ensures server and initial client renders are identical.
    if (!isMounted) {
      return {
        fontFamily: "BellotaText-Light, sans-serif",
        letterSpacing: "0.02em",
        lineHeight: "1.2",
        filter: "brightness(0.8)",
        textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)",
      };
    }

    // After mounting, apply the full dynamic styles.
    const isHovered = hoveredIndex === index;
    const distanceFromHovered =
      hoveredIndex !== null ? Math.abs(index - hoveredIndex) : 0;

    return {
      fontFamily: "BellotaText-Light, sans-serif",
      letterSpacing: isHovered ? "0.08em" : "0.02em",
      lineHeight: "1.2",
      transform: `
        translateZ(0) 
        scale(${
          isHovered ? 1.05 : Math.max(0.95, 1 - distanceFromHovered * 0.02)
        })
        translateX(${isHovered ? "10px" : "0px"})
        rotateX(${Math.sin((scrollY + index * 100) * 0.01) * 2}deg)
      `,
      textShadow: isHovered
        ? "0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)"
        : "0 2px 20px rgba(0, 0, 0, 0.8)",
      filter: `
        brightness(${isHovered ? 1.4 : 0.8}) 
        blur(${
          distanceFromHovered > 0 && distanceFromHovered < 3
            ? distanceFromHovered * 0.3
            : 0
        }px)
      `,
    };
  };

useEffect(() => {
    
    const textTurbulence = document.querySelector(
      "#textWaterFilter feTurbulence"
    );
    const textDisplacementMap = document.querySelector(
      "#textWaterFilter feDisplacementMap"
    );

    if (textTurbulence && textDisplacementMap) {
      document.querySelectorAll("h1, h2, h3, p, a").forEach((el) => {
        el.style.filter = "url(#textWaterFilter)";
      });

      gsap.set(textDisplacementMap, { attr: { scale: 10 } });

      gsap.to(textTurbulence, {
        attr: { baseFrequency: "0.02 0.10" },
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <>
        <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="textWaterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            result="noiseForText"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noiseForText"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 25%, 
            transparent 50%)`,
          }}
        />

       
        {/* Brands List */}
        <div
          ref={listRef}
          className="font-bellota-light relative z-10 flex flex-col items-center uppercase justify-start gap-8 py-32 h-full overflow-y-auto no-scrollbar"
          style={{
            scrollBehavior: "smooth",
            perspective: "1000px",
          }}
        >
          {brands.map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              href={brand.slug}
              className="group relative text-white text-2xl md:text-7xl font-stretch-95% text-center transition-all duration-500 ease-out cursor-pointer will-change-transform"
              style={{
                ...getItemStyle(index),
                filter: "url(#textWaterFilter)",
              }} // add filter here
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="relative z-10 block">{brand.name}</span>

              {/* Hover background effect */}
              <div
                className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                  transform: "skewX(-15deg)",
                }}
              />

              {/* Underline effect */}
              <div
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out"
                style={{ transformOrigin: "left" }}
              />
            </Link>
          ))}
        </div>

        {/* Top fade overlay */}
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

        {/* Bottom fade overlay */}
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

        {/* Scroll indicator */}
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
    </>
  );
}
