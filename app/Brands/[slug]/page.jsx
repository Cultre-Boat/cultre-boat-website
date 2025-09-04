"use client"

import React from 'react';
import Image from 'next/image';
import { IndustriesData } from "../Data.js";
import WaterEffect from "../../components/WaterEffect.jsx";

export default function BrandShowcase({ params }) {
    // Unwrap params with React.use() as recommended by Next.js
    const unwrappedParams = React.use(Promise.resolve(params));
    const { slug } = unwrappedParams;

    const brand = IndustriesData[slug];

    if (!brand) {
        return <div className="text-center text-white mt-20">Brand not found</div>;
    }

    // Default metrics if not provided in the data
    const metrics = brand.metrics || {
        influencers: "40+ Influencer Collaboration",
        growth: "37% Growth in Brand Retention",
        celebrities: "10+ Celebrity Placements"
    };

    // Default additional images if not provided in the data
    const additionalImages = brand.additionalImages || [
        brand.images[0],  // Fallback to main images if no additional images
        brand.images[1],
        brand.images[2]
    ];

    return (
        // <Water>
        <div className="mt-20 text-white min-h-screen p-4 sm:p-10">
                              {/* WaterEffect as a background */}
      {/* <div className="absolute inset-0 z-0"> */}
        <WaterEffect />
      {/* </div> */}
            <div className="mb-10 sm:mb-20 z-10">
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
                        {/* <p className="text-gray-400">{brand.year}</p> */}
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
                                className="object-contain rounded-lg"
                                objectFit="cover"
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
                            {brand.metrics?.growth || "37% Growth in Brand Retention."}
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