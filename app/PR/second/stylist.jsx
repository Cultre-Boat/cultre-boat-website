"use client";

import Image from 'next/image';

export default function Stylist() {
    const productImages = [
        { src: '/stylist/1_34.webp', alt: 'Stylist 1'},
        { src: '/stylist/1_35.webp', alt: 'Stylist 2'},
        { src: '/stylist/1_36.webp', alt: 'Stylist 3'},
        { src: '/stylist/1_37.webp', alt: 'Stylist 4'},
        { src: '/stylist/1_38.webp', alt: 'Stylist 5'},
        { src: '/stylist/1_39.webp', alt: 'Stylist 6'},
    ]
    
    return (
        <>
        <div className="text-white py-4 text-center mt-13 mb-13">
        <h1 className="text-2xl md:text-3xl ">STYLISTS</h1>
        {/* <p className="text-lg md:text-xl italic font-light mt-1">Impactful PR Approach</p> */}
    </div>
        <div className="relative w-full overflow-hidden bg-white">
            <div className="flex w-full overflow-hidden">
                <div className="flex animate-marquee-left items-center py-2">
                    {[...productImages, ...productImages].map((img, index) => ( 
                        <div 
                            key={index}
                            className="mx-2 flex-shrink-0"
                        >
                            <div className="relative w-[250px] h-[350px]">
                                <Image 
                                    src={img.src} 
                                    alt={img.alt} 
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={100}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};