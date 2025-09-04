import { useEffect } from "react";
import localFont from "next/font/local";

const bellotaText = localFont({
  src: "/fonts/BellotaText-Regular.ttf",
  weight: "400",
  display: "swap",
});

export default function BrandShowcase() {
  const brands = [
    "KalistaStudio",
    "kritkaDawar ",
    "Devanscoffee",
    "Zevarby geeta",
    "the monk",
    "Dayal Opticals",
    "Kelby Huston",
    "nidhika shekhar",
    "Blister Hand",
    "Shakuntlam Xclusif",
    "Luxury Ampersand Frolics Group",
    "LIZ PAUL",
    "dhartii",
    "Amiraah",
    "gaon restaurants",
    "Rasaiem Luxuury",
    "the box boutique",
    "AMAYRA by Bagrecha Gems",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#3F3F3F] to-[#272323] text-white">
      <div className="space-y-4">
        {brands.map((brand, index) => (
          <h1
            key={index}
            className={`${bellotaText.className} uppercase text-center`}
            style={{
              fontSize: "185.82px",
              fontWeight: 400,
              lineHeight: "111%",
              letterSpacing: "-8%",
            }}
          >
            {brand}
          </h1>
        ))}
      </div>
    </div>
  );
}
