"use client";

import Image from "next/image"
import { useState } from 'react';
import Last from "../components/design-last"
import Logos from "../components/brand-logos"
import Mailers from '../components/mailers';
import LIZ from "../components/designLiz"
import WaterEffect from "../components/WaterEffect";


const images = [
    {
        id: 1,
        src: '/Mailer/1.jpg',
        alt: 'Project 1',
        caption: 'Once Upon a Trunk',
        description: 'Complete brand identity redesign for a tech startup',
    },
    {
        id: 2,
        src: '/Mailer/2.png',
        alt: 'Project 2',
        caption: "Pernia's Pop-Up Shop",
        description: 'E-commerce website with custom illustrations',
    },
    {
        id: 3,
        src: '/Mailer/3.jpg',
        alt: 'Project 3',
        caption: 'Vian Lable',
        description: 'Sustainable packaging design for organic products',
    },
    {
        id: 4,
        src: '/Mailer/4.jpg',
        alt: 'Project 4',
        caption: "Pernia's Pop-Up Shop",
        description: 'Animated explainer video for a fintech solution',
    },
    {
        id: 5,
        src: '/Mailer/5.jpg',
        alt: 'Project 5',
        caption: 'Love to Bag',
        description: 'Campaign visuals for Instagram and Twitter',
    },
    {
        id: 6,
        src: '/Mailer/7.jpg',
        alt: 'Project 7',
        caption: 'Once Upon a Trunk',
        description: 'Mobile app interface design for fitness tracking',
    }
];

export default function DesignBrandingSection() {
    const [videoUrl, setVideoUrl] = useState(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const openVideoModal = (url) => {
        setVideoUrl(url);
        setIsVideoOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeVideoModal = () => {
        setVideoUrl(null);
        setIsVideoOpen(false);
        document.body.style.overflow = 'auto';
    };


    return (
        <section className="w-full mt-14 text-white py-8 md:py-16 lg:py-24 relative">
                  {/* WaterEffect as a background */}
        <WaterEffect />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {/* Left content area */}
                    <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col justify-start pt-4 md:pt-16">
                        <div className="space-y-4 md:space-y-12">
                            <h3 className="text-xs sm:text-sm md:text-base tracking-widest text-white uppercase font-medium">DECODING BRANDING</h3>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light">DESIGN</h1>

                            <div className="pt-6 ml-0 sm:ml-20 md:ml-40 md:pt-16 lg:pt-24">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal">Brand Identity Design</h2>
                                <p className="text-lg sm:text-xl md:text-2xl text-white italic">Tone Of Voice</p>
                            </div>
                        </div>
                    </div>

                    {/* Top right image */}
                    <div className="col-span-12 md:col-span-7 lg:col-span-8 md:col-start-6 lg:col-start-5 row-span-1 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative">
                        <Image
                            src="/Design-image1.png?height=1000&width=1000"
                            alt="Person in yellow outfit with flowing fabric"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Bottom left image with caption */}
                    <div className="col-span-12 md:col-span-7 lg:col-span-6 row-span-1 mt-4 md:mt-0 relative left-0 sm:left-20 md:left-40">
                        <div className="h-[180px] sm:h-[250px] md:h-[300px] relative">
                            <Image
                                src="/Design-image2.svg?height=600&width=800"
                                alt="Two people in a field with golden grass"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="text-xl sm:text-2xl mt-2">For GURORGANIC by Pernia Qureshi</p>
                    </div>

                    {/* Bottom right image */}
                    <div className="col-span-12 md:col-span-5 lg:col-span-4 md:col-start-8 lg:col-start-9 row-span-1 mt-4 md:mt-0 h-[200px] sm:h-[300px] md:h-[350px] relative left-0 sm:left-20 md:left-32 bottom-0 sm:bottom-10">
                        <Image
                            src="/Design-image3.png?height=700&width=400"
                            alt="Person in red outfit in doorway"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Second section - new content */}
                <div className="grid grid-cols-12 gap-4 md:gap-6 relative mt-12 sm:mt-20">
                    {/* Top text content */}
                    <div className="col-span-12 md:col-span-8 mb-6 ml-0 sm:ml-20 md:ml-40">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal">Creative Direction And Strategy</h2>
                        <p className="text-lg sm:text-xl md:text-2xl text-white italic">Brand Positing</p>
                    </div>

                    {/* Left image with overlay text - now clickable for video */}
                    <div className="col-span-12 md:col-span-7 h-[200px] sm:h-[300px] md:h-[350px] relative">
                        <button 
                            onClick={() => openVideoModal("https://www.youtube.com/watch?v=C-4C4VnyZco")}
                            className="w-full h-full focus:outline-none"
                            aria-label="Play video"
                        >
                            <Image
                                src="/Design-image4.png?height=700&width=1000"
                                alt="Person in white dress"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Right image */}
                    <div className="col-span-12 md:col-span-5 md:col-start-8 h-[180px] sm:h-[250px] md:h-[350px] mt-4 md:mt-0 relative left-0 sm:left-20 md:left-60 top-0 sm:top-36">
                        <Image
                            src="/Design-image5.svg?height=500&width=500"
                            alt="Product photography with red, white and blue colors"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Video Modal */}
                {isVideoOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop with blur effect */}
                        <div 
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={closeVideoModal}
                        ></div>

                        {/* Video Container */}
                        <div className="relative z-10 w-full max-w-4xl rounded-lg overflow-hidden">
                            {/* Close button */}
                            <button
                                onClick={closeVideoModal}
                                className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                aria-label="Close video"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Responsive Video Embed */}
                            <div className="aspect-w-16 aspect-h-9 w-full">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]}?autoplay=1&modestbranding=1&rel=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh]"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
                <Last />
                                    {/* <LIZ /> */}
                <div className="min-h-screen bg-transparent w-full relative">
                    <div className="py-2 md:py-2">
                        <div className="container px-4">
                            {/* <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Portfolio</h1> */}
                            <p className="text-white text-center max-w-2xl lg:text-4xl mx-auto">
                                Explore our latest projects showcasing our design capabilities across various mediums and industries.
                            </p>
                        </div>
                    </div>
                    <Mailers images={images} />
                </div>
                <div className="mt-12 sm:mt-20">
                    <Logos />
                </div>
            </div>
        </section>
    )
}