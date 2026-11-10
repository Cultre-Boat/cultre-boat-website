"use client";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import BrandModal from "../components/BrandModal";
import { IndustriesData } from "../Brands/Data";

// Order here is the order the filter buttons appear in (after "ALL").
const CATEGORIES = {
  FASHION: "FASHION",
  ACCESSORIES: "ACCESSORIES",
  LIFESTYLE: "LIFESTYLE",
  BEAUTY: "BEAUTY",
  FOOD: "FOOD",
  DECOR_HOME: "DECOR/HOME",
  CREATORS: "CREATORS",
};

const BRAND_CATEGORIES = {
  "amayra-by-bagrecha-gems": CATEGORIES.ACCESSORIES,
  "52-north-realty": CATEGORIES.LIFESTYLE,
  "aashima-behl": CATEGORIES.FASHION,
  "amiraah": CATEGORIES.FASHION,
  "blister-hand": CATEGORIES.DECOR_HOME,
  "buta": CATEGORIES.FASHION,
  "dayal-opticals": CATEGORIES.ACCESSORIES,
  "devans-coffee": CATEGORIES.FOOD,
  "dhartii": CATEGORIES.BEAUTY,
  "diviya-kapoor": CATEGORIES.FASHION,
  "dmodot": CATEGORIES.FASHION,
  "ebisu": CATEGORIES.FOOD,
  "everest-base-camp": CATEGORIES.LIFESTYLE,
  "fashionably-pernia": CATEGORIES.FASHION,
  "gaon-restaurants": CATEGORIES.FOOD,
  "gazal-gupta": CATEGORIES.FASHION,
  "gur-organics": CATEGORIES.BEAUTY,
  "healix": CATEGORIES.BEAUTY,
  "intiki": CATEGORIES.ACCESSORIES,
  "kalista-studio": CATEGORIES.CREATORS,
  "kelby-huston": CATEGORIES.CREATORS,
  "koe-beauty": CATEGORIES.BEAUTY,
  "kritika-dawar": CATEGORIES.FASHION,
  "liz-paul": CATEGORIES.FASHION,
  "love-to-bag": CATEGORIES.ACCESSORIES,
  "luxury-ampersand-frolics-group": CATEGORIES.LIFESTYLE,
  "masala-synergy": CATEGORIES.FOOD,
  "miri-kiri": CATEGORIES.FASHION,
  "nidhika-shekhar": CATEGORIES.FASHION,
  "nupur-gulati": CATEGORIES.FASHION,
  "oddcat": CATEGORIES.LIFESTYLE,
  "okami": CATEGORIES.BEAUTY,
  "pankhuri-jain": CATEGORIES.FASHION,
  "pernias-pop-up-shop": CATEGORIES.FASHION,
  "picture-time": CATEGORIES.CREATORS,
  "poppy-paro": CATEGORIES.CREATORS,
  "rasaiem-luxuury": CATEGORIES.FASHION,
  "sahibba-k-anand": CATEGORIES.FASHION,
  "samatvam-by-anjali-bhaskar": CATEGORIES.LIFESTYLE,
  "sewtable-clothing": CATEGORIES.FASHION,
  "shaadi-ka-ladoo": CATEGORIES.FOOD,
  "shakuntlam-xclusif": CATEGORIES.FASHION,
  "supria-munjal": CATEGORIES.FASHION,
  "tania-israni": CATEGORIES.FASHION,
  "tarini-vij": CATEGORIES.FASHION,
  "taruna-seth": CATEGORIES.BEAUTY,
  "the-belgian-fries-co": CATEGORIES.FOOD,
  "the-box-boutique": CATEGORIES.ACCESSORIES,
  "the-monk": CATEGORIES.LIFESTYLE,
  "vasansi-jaipur": CATEGORIES.FASHION,
  "waby-saby": CATEGORIES.LIFESTYLE,
  "zevar-by-geeta": CATEGORIES.ACCESSORIES,
};

export default function BrandShowcase() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const openBrandModal = (slug) => {
    setSelectedBrand(slug);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
    document.body.style.overflow = "auto";
  };

  const brands = [
    {
      name: "AMAYRA by Bagrecha Gems",
      slug: "/Brands/amayra-by-bagrecha-gems",
      instagram:
        "https://www.instagram.com/amayrajewellery?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    },
    { name: "52 North Realty", slug: "/Brands/52-north-realty" },
    { name: "aashima behl", slug: "/Brands/aashima-behl" },
    { name: "Amiraah", slug: "/Brands/amiraah" },
    { name: "Blister Hand", slug: "/Brands/blister-hand" },
    { name: "BUTA", slug: "/Brands/buta" },
    { name: "Dayal Opticals", slug: "/Brands/dayal-opticals" },
    { name: "Devans coffee", slug: "/Brands/devans-coffee" },
    { name: "dhartii", slug: "/Brands/dhartii" },
    { name: "DIVIYA KAPOOR", slug: "/Brands/diviya-kapoor" },
    { name: "dmodot", slug: "/Brands/dmodot" },
    { name: "EBISU", slug: "/Brands/ebisu" },
    { name: "EVEREST BASE CAMP", slug: "/Brands/everest-base-camp" },
    { name: "Fashionably Pernia", slug: "/Brands/fashionably-pernia" },
    { name: "gaon restaurants", slug: "/Brands/gaon-restaurants" },
    { name: "GAZAL GUPTA", slug: "/Brands/gazal-gupta" },
    { name: "GUR ORGANICS", slug: "/Brands/gur-organics" },
    { name: "HEALIX", slug: "/Brands/healix" },
    { name: "INTIKI", slug: "/Brands/intiki" },
    { name: "Kalista Studio", slug: "/Brands/kalista-studio" },
    { name: "Kelby Huston", slug: "/Brands/kelby-huston" },
    { name: "KOE BEAUTY", slug: "/Brands/koe-beauty" },
    { name: "kritika Dawar", slug: "/Brands/kritika-dawar" },
    { name: "LIZ PAUL", slug: "/Brands/liz-paul" },
    { name: "LOVE TO BAG", slug: "/Brands/love-to-bag" },
    {
      name: "Luxury Ampersand Frolics Group",
      slug: "/Brands/luxury-ampersand-frolics-group",
    },
    { name: "MASALA SYNERGY", slug: "/Brands/masala-synergy" },
    { name: "MIRI KIRI", slug: "/Brands/miri-kiri" },
    { name: "nidhika shekhar", slug: "/Brands/nidhika-shekhar" },
    { name: "Nupur Gulati", slug: "/Brands/nupur-gulati" },
    { name: "ODDCAT", slug: "/Brands/oddcat" },
    { name: "OKAMI", slug: "/Brands/okami" },
    { name: "PANKHURI JAIN", slug: "/Brands/pankhuri-jain" },
    { name: "Pernia's Pop-Up Shop", slug: "/Brands/pernias-pop-up-shop" },
    { name: "PICTURE TIME", slug: "/Brands/picture-time" },
    { name: "Poppy Paro", slug: "/Brands/poppy-paro" },
    { name: "Rasaiem Luxuury", slug: "/Brands/rasaiem-luxuury" },
    { name: "Sahibba K Anand", slug: "/Brands/sahibba-k-anand" },
    { name: "Samatvam By Anjali Bhaskar", slug: "/Brands/samatvam-by-anjali-bhaskar" },
    { name: "SEWTABLE CLOTHING", slug: "/Brands/sewtable-clothing" },
    { name: "SHAADI KA LADOO", slug: "/Brands/shaadi-ka-ladoo" },
    { name: "Shakuntlam Xclusif", slug: "/Brands/shakuntlam-xclusif" },
    { name: "SUPRIA MUNJAL", slug: "/Brands/supria-munjal" },
    { name: "TANIA ISRANI", slug: "/Brands/tania-israni" },
    { name: "TARINI VIJ", slug: "/Brands/tarini-vij" },
    { name: "taruna seth", slug: "/Brands/taruna-seth" },
    { name: "The Belgian Fries Co", slug: "/Brands/the-belgian-fries-co" },
    { name: "the box boutique", slug: "/Brands/the-box-boutique" },
    { name: "the monk", slug: "/Brands/the-monk" },
    { name: "VASANSI JAIPUR", slug: "/Brands/vasansi-jaipur" },
    { name: "WABY SABY", slug: "/Brands/waby-saby" },
    { name: "Zevar by geeta", slug: "/Brands/zevar-by-geeta" },
  ];

  const sortedBrands = [...brands].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  );

  const filteredBrands = activeCategory
    ? sortedBrands.filter((brand) => {
        const slug = brand.slug.replace("/Brands/", "");
        return BRAND_CATEGORIES[slug] === activeCategory;
      })
    : sortedBrands;

  const listRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isClientMobile, setIsClientMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMobile) setIsClientMobile(true);

    const handleWindowScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleWindowScroll);

    if (!isMobile) {
      const handleMouseMove = (e) =>
        setMousePosition({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("scroll", handleWindowScroll);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  const getItemStyle = (index) => {
    if (!isMounted) {
      return {
        fontFamily: "BellotaText-Light, sans-serif",
        letterSpacing: "0.02em",
        lineHeight: "1.2",
        filter: "brightness(0.8)",
        textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)",
      };
    }

    const isHovered = hoveredIndex === index;
    const distanceFromHovered =
      hoveredIndex !== null ? Math.abs(index - hoveredIndex) : 0;

    return {
      fontFamily: "BellotaText-Light, sans-serif",
      letterSpacing: isHovered ? "0.08em" : "0.02em",
      lineHeight: "1.2",
      transform: `
        translateZ(0)
        scale(${isHovered ? 1.05 : Math.max(0.95, 1 - distanceFromHovered * 0.02)})
        translateX(${isHovered ? "5px" : "0px"})
        rotateX(${Math.sin((scrollY + index * 100) * 0.01) * 2}deg)
      `,
      textShadow: isHovered
        ? "0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)"
        : "0 2px 20px rgba(0, 0, 0, 0.8)",
      filter: `
        brightness(${isHovered ? 1.4 : 0.8})
        blur(${distanceFromHovered > 0 && distanceFromHovered < 3 ? distanceFromHovered * 0.3 : 0}px)
      `,
    };
  };

  return (
    <>
      <div
        className="relative w-full overflow-x-hidden"
        style={{ backgroundColor: "#2a4862" }}
      >
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-20 gradient-overlay"
          style={
            isMounted && !isClientMobile
              ? {
                  background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.05) 25%,
                    transparent 50%)`,
                }
              : {}
          }
        />

        {/* Category Filter Buttons */}
        <div className="fixed top-24 left-0 right-0 z-30 bg-transparent py-4 px-4 backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-3 pointer-events-auto">
            <button
              onClick={() => setActiveCategory(null)}
              onMouseEnter={() => setHoveredCategory("all")}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`px-4 py-2 rounded-full font-bellota-light text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer relative group ${
                activeCategory === null
                  ? "bg-white/20 border border-white text-white"
                  : "bg-transparent border border-white/30 text-white hover:border-white/60"
              }`}
              style={{
                transform: hoveredCategory === "all" ? "scale(1.05) translateX(5px)" : "scale(1)",
                textShadow: hoveredCategory === "all" ? "0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)" : "none",
                filter: hoveredCategory === "all" ? "brightness(1.4)" : "brightness(1)",
              }}
            >
              All
              <div
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-0 group-hover:w-full transition-all duration-700"
                style={{ transformOrigin: "left" }}
              />
            </button>
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(value)}
                onMouseEnter={() => setHoveredCategory(key)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`px-4 py-2 rounded-full font-bellota-light text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer relative group ${
                  activeCategory === value
                    ? "bg-white/20 border border-white text-white"
                    : "bg-transparent border border-white/30 text-white hover:border-white/60"
                }`}
                style={{
                  transform: hoveredCategory === key ? "scale(1.05) translateX(5px)" : "scale(1)",
                  textShadow: hoveredCategory === key ? "0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)" : "none",
                  filter: hoveredCategory === key ? "brightness(1.4)" : "brightness(1)",
                }}
              >
                {value}
                <div
                  className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-0 group-hover:w-full transition-all duration-700"
                  style={{ transformOrigin: "left" }}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={listRef}
          className="font-bellota-light relative z-10 flex flex-col items-center justify-start gap-8 mt-40 pb-6 overflow-x-hidden no-scrollbar list-container"
          style={{
            perspective: "1000px",
          }}
        >
          {filteredBrands.map((brand, index) => {
            const brandSlug = brand.slug.replace("/Brands/", "");

            return (
              <button
                key={`${brand.slug}-${index}`}
                onClick={() => openBrandModal(brandSlug)}
                className="group relative text-white text-3xl sm:text-xl md:text-5xl lg:text-7xl font-stretch-95% py-4 text-center transition-all duration-500 ease-out cursor-pointer will-change-transform max-w-[90vw] w-full uppercase tracking-wider"
                style={getItemStyle(index)}
                onMouseEnter={
                  isClientMobile ? null : () => setHoveredIndex(index)
                }
                onMouseLeave={
                  isClientMobile ? null : () => setHoveredIndex(null)
                }
              >
                <span className="relative z-10 block">
                  {brand.name.toUpperCase()}
                </span>

                <div
                  className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                    transform: "skewX(-15deg)",
                  }}
                />

                <div
                  className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out"
                  style={{ transformOrigin: "left" }}
                />
              </button>
            );
          })}
        </div>

        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
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

        <style jsx global>{`
          html,
          body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
          }

          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          @media (max-width: 640px) {
            .gradient-overlay {
              display: none;
            }

            .list-container {
              gap: 4px;
              padding-top: 100px;
              padding-bottom: 8px;
            }
          }
        `}</style>
      </div>

      {selectedBrand && IndustriesData[selectedBrand] && (
        <BrandModal
          isOpen={isModalOpen}
          onClose={closeModal}
          brandName={IndustriesData[selectedBrand].name}
          brandSlug={selectedBrand}
          instagramUrl={IndustriesData[selectedBrand].instagram}
          reels={IndustriesData[selectedBrand].reels || []}
          images={[
            ...IndustriesData[selectedBrand].images,
            ...(IndustriesData[selectedBrand].additionalImages || []),
          ]}
        />
      )}
    </>
  );
}
