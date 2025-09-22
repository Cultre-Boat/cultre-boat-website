"use client";

import Image from "next/image";

export default function Third() {
  const portfolioItems = [
    { id: 1, image: "/PR4.svg", magazine: "ELLE", title: "SO EXTRA" },
    { id: 2, image: "/PR3.svg", magazine: "ELLE", title: "COSMOPOLITAN" },
    { id: 3, image: "/PR2.svg", magazine: "COSMOPOLITAN", title: "FEMINA" },
    { id: 4, image: "/PR1.svg", magazine: "FEMINA", subtitle: "Pernia's Pop-Up Shop" },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-white py-4 md:py-8 text-center">
        <h1 className="text-2xl md:text-3xl ">Creative Consultancy</h1>
        <p className="text-lg md:text-xl italic font-light mt-1">
          Impactful PR Approach
        </p>
      </div>

      {/* ================= Portfolio Section ================= */}

      {/* Mobile (Marquee effect) */}
      <div className="bg-white mt-10 block md:hidden overflow-hidden">
        <div className="flex animate-marquee-left gap-6">
          {portfolioItems.concat(portfolioItems).map((item, index) => (
            <div
              key={index}
              className="relative h-[350px] flex-shrink-0"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={`Portfolio item ${item.id}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop (Static row) */}
      <div className="bg-white mt-10 hidden md:flex">
        <div className="max-w-8xl mx-auto flex flex-row justify-around items-center px-4 md:px-0 w-full">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col items-center w-1/4 px-2"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={`Portfolio item ${item.id}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
