'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import WaterEffect from "../components/WaterEffect"; 
import MovingFog from '../components/MovingFog';

export default function BrandShowcase() {
  const brands = [
    { name: "AMAYRA by Bagrecha Gems", slug: "/Brands/amayra-by-bagrecha-gems" },
    { name: "Amiraah", slug: "/Brands/amiraah" },
    { name: "Bhumika Sharma", slug: "/Brands/Bhumika-sharma" },
    { name: "Blister Hand", slug: "/Brands/blister-hand" },
    { name: "dhartii", slug: "/Brands/dhartii" },
    { name: "Dayal Opticals", slug: "/Brands/dayal-opticals" },
    { name: "Devans coffee", slug: "/Brands/devans-coffee" },
    { name: "gaon restaurants", slug: "/Brands/gaon-restaurants" },
    { name: "Gazal Gupta", slug: "/Brands/Ghazal-gupta" },
    { name: "Kalista Studio", slug: "/Brands/kalista-studio" },
    { name: "Kelby Huston", slug: "/Brands/kelby-huston" },
    { name: "kritika Dawar", slug: "/Brands/kritika-dawar" },
    { name: "LIZ PAUL", slug: "/Brands/liz-paul" },
    { name: "Luxury Ampersand Frolics Group", slug: "/Brands/luxury-ampersand-frolics-group" },
    { name: "nidhika shekhar", slug: "/Brands/nidhika-shekhar" },
    { name: "Pernia's Pop-Up Shop", slug: "/Brands/pernias-pop-up-shop" },
    { name: "Rasaiem Luxuury", slug: "/Brands/rasaiem-luxuury" },
    { name: "Shakuntlam Xclusif", slug: "/Brands/shakuntlam-xclusif" },
    { name: "the box boutique", slug: "/Brands/the-box-boutique" },
    { name: "the monk", slug: "/Brands/the-monk" },
    { name: "VASANSI JAIPUR", slug: "/Brands/vasansi-jaipur" },
    { name: "Zevar by geeta", slug: "/Brands/zevar-by-geeta" },
  ];

  // const repeatedBrands = [...brands, ...brands];
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollTop = 0;

    const handleScroll = () => {
      // Optional: Scroll logic here
    };

    list.addEventListener('scroll', handleScroll);
    return () => list.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* WaterEffect as a background */}
    

      {/* Brands List */}
      <div
        ref={listRef}
        className="font-bellota-light relative z-10 flex flex-col items-center uppercase justify-start gap-4 py-28 h-full overflow-y-auto no-scrollbar"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {brands.map((brand, index) => (
          <Link
            key={`${brand.slug}-${index}`}
            href={brand.slug}
            className="text-white opacity-30 text-2xl md:text-7xl font-stretch-95% text-center hover:opacity-80 active:opacity-80 focus:opacity-80 transition-opacity duration-300"
            style={{
              fontFamily: 'BellotaText-Light, sans-serif',
              letterSpacing: '0.02em',
              lineHeight: '1.2',
            }}
          >
            {brand.name}
          </Link>
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
