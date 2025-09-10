import Image from 'next/image';

export default function MyPage() {
    const productImages = [
        { src: '/Influencers/1.png', alt: 'Product 1' },
        { src: '/Influencers/2.png', alt: 'Product 2' },
        { src: '/Influencers/3.png', alt: 'Product 3' },
        { src: '/Influencers/4.png', alt: 'Product 4' },
        { src: '/Influencers/5.png', alt: 'Product 5' },
        { src: '/Influencers/6.png', alt: 'Product 6' },
    ]

    return (
        <>
            <div className="text-white py-4 text-center mb-13 mt-13">
                <h1 className="text-2xl md:text-3xl ">INFLUENCERS</h1>
                {/* <p className="text-lg md:text-xl italic font-light mt-1">Impactful PR Approach</p> */}
            </div>
            <div className="relative w-full overflow-hidden bg-white"> 
                <div className="flex w-full overflow-hidden">
                    <div className="flex animate-marquee-left items-center py-2"> {/* Added vertical padding */}
                        {[...productImages, ...productImages].map((img, index) => (
                            <div
                                key={index}
                                className="mx-2 flex-shrink-0" // Adjusted spacing
                            >
                                <div className="relative w-[250px] h-[350px]"> {/* Taller container */}
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill // Fill the container
                                        className="object-contain" // Ensures full image visibility
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        quality={100} // Best quality
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