'use client';
import Image from 'next/image';
// import SimpleParallax from 'simple-parallax-js'

export default function ProductShowcase() {
    const sections = [
        {
            title: "Visual Vocabulary Exhibition Guidelines",
            imageSrc: "/LIZ/1.jpg",
            alt: "Visual Vocabulary Exhibition Guidelines",
        },
        {
            title: "Print & Digital Design Collaterals Design",
            imageSrc: "/LIZ/2.jpg",
            alt: "Print & Digital Design Collaterals",
        },
        {
            title: "Visual Vocabulary Exhibition Guidelines",
            imageSrc: "/LIZ/5.jpg",
            alt: "Visual Vocabulary Exhibition Guidelines",
        },
        {
            title: "Print & Digital Design Collaterals Design",
            imageSrc: "/LIZ/4.jpg",
            alt: "Print & Digital Design Collaterals",
        },
        {
            title: "Visual Vocabulary Exhibition Guidelines",
            imageSrc: "/Shakuntalam/1.jpg",
            alt: "Visual Vocabulary Exhibition Guidelines",
        },
        {
            title: "Print & Digital Design Collaterals Design",
            imageSrc: "/Shakuntalam/5.jpg",
            alt: "Print & Digital Design Collaterals",
        },
        {
            title: "Visual Vocabulary Exhibition Guidelines",
            imageSrc: "/Shakuntalam/3.jpg",
            alt: "Visual Vocabulary Exhibition Guidelines",
        },
        {
            title: "Print & Digital Design Collaterals Design",
            imageSrc: "/Shakuntalam/4.jpg",
            alt: "Print & Digital Design Collaterals",
        }
    ];

    return (
        <div className="min-h-screen mt-20 bg-transparent text-white p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden rounded-lg transition-all duration-300 "
                    >
                        {/* <SimpleParallax orientation='down' scale={1.5}> */}
                            <Image
                                src={section.imageSrc}
                                alt={section.alt}
                                width={600}
                                height={400}
                                className="w-full h-auto"
                            />
                        {/* </SimpleParallax> */}

                    </div>
                ))}
            </div>
        </div>
    );
}