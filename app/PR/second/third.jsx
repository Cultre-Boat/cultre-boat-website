"use client";

import Image from "next/image";

export default function Third() {
  const portfolioItems = [
    { id: 1, image: "/third/PR4_1.jpg", magazine: "ELLE", title: "SO EXTRA" },
    { id: 2, image: "/third/PR3_1.jpg", magazine: "ELLE", title: "COSMOPOLITAN" },
    { id: 3, image: "/third/PR2_1.jpg", magazine: "COSMOPOLITAN", title: "FEMINA" },
    { id: 4, image: "/third/PR1_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 5, image: "/third/PR5_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 6, image: "/third/PR6_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 7, image: "/third/PR7_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 8, image: "/third/PR8_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 9, image: "/third/PR9_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 11, image: "/third/PR11_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
    { id: 12, image: "/third/PR12_1.jpg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
  ];

  return (
    <div className="w-full font-bellota-light">
      {/* Header Section */}
      <div className="text-white py-0 md:py-0 text-center">
        <h1 className="text-2xl md:text-3xl">Creative Consultancy</h1>
        <p className="text-lg md:text-xl italic font-light mt-1">
          Impactful PR Approach
        </p>
      </div>

      {/* ================= Portfolio Section ================= */}

      {/* Mobile (Marquee effect) */}
      <div className="bg-white mt-5 my-0 block md:hidden overflow-hidden h-[380px]">
        <div className="flex animate-marquee-left gap-4">
          {portfolioItems.concat(portfolioItems).map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative h-[350px] flex-shrink-0"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`Portfolio item ${item.id}`}
                width={0}
                height={350}
                sizes="100vw"
                style={{ width: "auto", height: "100%", objectFit: "contain", marginTop:"13px" }}
                className="no-water-effect"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop (Marquee effect) */}
      <div className="bg-white mt-5 hidden md:block overflow-hidden h-[380px]">
        <div className="flex animate-marquee-left gap-3">
          {portfolioItems.concat(portfolioItems).map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative h-[350px] flex-shrink-0"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`Portfolio item ${item.id}`}
                width={0}
                height={350}
                sizes="100vw"
                style={{ width: "auto", height: "100%", objectFit: "contain", marginTop:"13px"}}
                className="no-water-effect"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}