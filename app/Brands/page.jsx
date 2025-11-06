'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // Scroll handling for list
    list.scrollTop = 0;
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Brands List */}
      <div
        ref={listRef}
        className="font-bellota-light relative flex flex-col items-center uppercase justify-start gap-6 py-20 h-full overflow-y-auto no-scrollbar"
      >
        {brands.map((brand, index) => (
          <div key={`${brand.slug}-${index}`} className="flex flex-col items-center gap-4">
            {/* Image */}
            <img
              src={brand.image}
              alt={brand.name}
              className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg"
            />
            {/* Text wrapped in Link */}
            <Link
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