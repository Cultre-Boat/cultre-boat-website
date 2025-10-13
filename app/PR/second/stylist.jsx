"use client";

import Image from 'next/image';

export default function Stylist() {
    const productImages = [
        { src: '/stylist/img1.webp', alt: 'Stylist 1'},
        { src: '/stylist/img2.webp', alt: 'Stylist 2'},
        { src: '/stylist/img3.webp', alt: 'Stylist 3'},
        { src: '/stylist/img4.webp', alt: 'Stylist 4'},
        { src: '/stylist/img5.webp', alt: 'Stylist 5'},
        { src: '/stylist/img6.webp', alt: 'Stylist 6'},
    ]
    
    return (
        <>
        <div className="text-white py-5 text-center mt-0 mb-0 font-bellota-light">
        <h1 className="text-2xl md:text-3xl ">STYLISTS</h1>
        {/* <p className="text-lg md:text-xl italic font-light mt-1">Impactful PR Approach</p> */}
    </div>
        <div className="relative w-full overflow-hidden bg-white">
            <div className="flex w-full overflow-hidden">
                <div className="flex animate-marquee-left items-center py-1">
                    {[...productImages, ...productImages].map((img, index) => ( 
                        <div 
                            key={index}
                            className="mx-3 flex-shrink-0"
                        >
                            <div className="relative w-[250px] h-[350px]">
                                <Image 
                                    src={img.src} 
                                    alt={img.alt} 
                                    fill
                                    className="object-contain no-water-effect"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    // quality={100}
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