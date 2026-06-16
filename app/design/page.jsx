"use client";

import { useState, useRef, useEffect } from "react";
import Last from "../components/design-last";
import Logos from "../components/brand-logos";
import Mailers from "../components/mailers";
import LIZ from "../components/designLiz";
import MovingFog from "../components/MovingFog";
import PixiWaterImages from "../components/PixiWaterImages";

export default function DesignPortfolio() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [waterIntensity, setWaterIntensity] = useState(0.5);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef(null);

  // Water effect - active on both mobile and desktop with different intensities
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        // Mobile: Higher intensity for clear visibility
        setWaterIntensity(0.75); // Strong on mobile (75%)
      } else {
        // Desktop: Normal water effect
        setWaterIntensity(0.5); // Normal on desktop (50%)
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure text is visible immediately; any effects render as overlays without hiding originals.

  const openVideoModal = (url) => {
    setVideoUrl(url);
    setIsVideoOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeVideoModal = () => {
    setVideoUrl(null);
    setIsVideoOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="relative">
        <div
          id="design-content"
          ref={contentRef}
          className="text-white leading-relaxed font-bellota-light"
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-4 px-0">
          {/* Header Section */}
          <section className="relative mt-20 text-center z-[10]">
            <div className="flex flex-col lg:flex-row items-center min-h-[400px] lg:min-h-[400px] gap-5 lg:gap-10 md:mt-0">
              <div className="flex-1 px-6 md:px-8 lg:px-5 text-stable no-water-effect text-center w-full">
                <p className="text-lg md:text-xl tracking-[2px] uppercase my-2 text-white no-water-effect px-4">
                  DECODING BRANDING
                </p>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-thin tracking-tight mb-2 leading-none text-white no-water-effect px-4" style={{ fontWeight: 200 }}>
                  DESIGN
                </h1>
                <p className="text-xl lg:text-2xl text-white mt-2 mb-1 no-water-effect px-4 font-light" style={{ fontWeight: 300 }}>
                  Brand Identity Design
                </p>
                <p className="text-xl lg:text-2xl text-white no-water-effect px-4 font-light" style={{ fontWeight: 300 }}>
                  Tone Of Voice
                </p>
              </div>
              <div className="flex-1 relative w-full max-w-full lg:max-w-2xl mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design//webp/Design-image1.webp"
                  alt="Traditional Fashion Design"
                  width={600}
                  height={400}
                  className="w-full h-auto opacity-[1] object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="mt-10 md:mt-0 text-center z-[10]">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-24 justify-center mb-2 mx-auto items-stretch">
              {/* Left Image */}
              <div className="relative overflow-hidden w-full lg:w-[650px] md:mb-0 mx-auto lg:mx-0 z-[10] flex items-stretch">
                <img
                  src="/Design/webp/Design-image2.webp"
                  alt="Gurorganic Campaign"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>

              {/* Right Image */}
              <div className="relative overflow-hidden w-full lg:w-[500px] lg:mx-0 z-[10] mt-10 md:mt-0 flex items-stretch">
                <img
                  src="/Design/webp/Design-image3-1.webp"
                  alt="Fashion Photography"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
            </div>
          </section>

          {/* Creative Direction Section with Video */}
          <section className="text-center z-[10] mt-10 md:mt-16 px-4 md:px-6">
            <div className="text-stable no-water-effect">
              <h2 className="text-2xl lg:text-3xl font-light tracking-[2px] uppercase text-white no-water-effect px-4 mb-0 leading-none">
                CREATIVE DIRECTION AND STRATEGY
              </h2>
              <p className="text-lg lg:text-2xl italic text-white no-water-effect px-4 font-light mb-3 md:mb-4 mt-0 leading-tight" style={{ fontWeight: 300 }}>
                Brand Positioning
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-40 justify-center items-stretch">
              {/* Left video image */}
              <div className="relative overflow-hidden w-full lg:max-w-[600px] mx-auto lg:mx-0 z-[10] flex items-stretch">
                <button
                  onClick={() =>
                    openVideoModal(
                      "https://www.youtube.com/watch?v=C-4C4VnyZco"
                    )
                  }
                  className="w-full focus:outline-none block relative"
                  aria-label="Play video"
                >
                  <img
                    src="/Design/webp/Design-image4-1.webp"
                    alt="Kalki Fashion"
                    width={600}
                    height={350}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) =>
                      console.error(`Failed to load image: ${e.target.src}`)
                    }
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>

              {/* Right static image */}
              <div className="relative overflow-hidden w-full lg:w-[50%] lg:max-w-[350px] mx-auto lg:mx-0 z-[10] flex items-stretch mt-5 md:mt-0">
                <img
                  src="/Design/webp/img28.webp"
                  alt="Product Photography"
                  width={600}
                  height={350}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
            </div>
          </section>

          {/* Video Modal */}
          {isVideoOpen && (
            <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={closeVideoModal}
              ></div>
              <div className="relative z-[51] w-full max-w-4xl rounded-lg overflow-hidden">
                <button
                  onClick={closeVideoModal}
                  className="absolute top-2 right-2 z-[52] bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Close video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="aspect-w-16 aspect-h-9 w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      videoUrl.split("v=")[1]
                    }?autoplay=1&modestbranding=1&rel=0`}
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

          {/* Visual Vocabulary Section */}
          <section className="text-center z-[10] mt-10 md:mt-16 px-4 md:px-6">
            <div className="text-stable no-water-effect">
              <h2 className="text-2xl lg:text-3xl font-light tracking-[2px] uppercase text-white no-water-effect px-4 mb-0 leading-none">
                VISUAL VOCABULARY
              </h2>
              <p className="text-lg lg:text-2xl italic text-white no-water-effect px-4 font-light mb-3 md:mb-4 mt-0 leading-tight" style={{ fontWeight: 300 }}>
                Exhibition Guidelines
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-24 justify-center lg:mx-4 mb-0 md:mb-9">
              <div className="relative overflow-hidden w-full lg:w-[70%] lg:max-w-[400px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/webp/D_img1.webp"
                  alt="Visual Vocabulary Design 1"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
              <div className="relative overflow-hidden w-full lg:w-[70%] lg:max-w-[400px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/webp/D_img2.webp"
                  alt="Visual Vocabulary Design 2"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
            </div>
          </section>

          {/* Print Section */}
          <section className="text-center z-[10] mt-10 md:mt-16 px-4 md:px-6">
            <div className="text-stable no-water-effect">
              <h2 className="text-2xl lg:text-3xl font-light tracking-[2px] uppercase text-white no-water-effect px-4 mb-0 leading-none">
                PRINT AND DIGITAL DESIGN
              </h2>
              <p className="text-lg lg:text-2xl italic text-white no-water-effect px-4 font-light mb-3 md:mb-4 mt-0 leading-tight" style={{ fontWeight: 300 }}>
                Collaterals
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-24 justify-center lg:mx-4 mb-5 items-start">
              <div className="relative w-full lg:w-auto lg:max-w-[500px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/webp/print_1.webp"
                  alt="Print Design 1"
                  width={500}
                  height={700}
                  className="w-full h-auto object-contain"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
              <div className="relative w-full lg:w-auto lg:max-w-[500px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/webp/print_2.webp"
                  alt="Print Design 2"
                  width={500}
                  height={700}
                  className="w-full h-auto object-contain"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
            </div>
          </section>

          {/* Portfolio Collage Section */}
          <section className="text-center z-[10]">
            <div className="mb-6">
              <hr className="w-3/5 h-px bg-gray-600 border-none mx-auto mb-10 mt-10" />
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start justify-center lg:px-4">
              <div className="flex flex-col gap-4 w-full lg:max-w-lg lg:max-w-xl mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Mailer/webp/1.webp"
                  alt="Portfolio Item 1"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/webp/4.webp"
                  alt="Portfolio Item 4"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/webp/6.webp"
                  alt="Portfolio Item 6"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
              <div className="flex flex-col gap-4 w-full lg:max-w-lg lg:max-w-xl mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Mailer/webp/2.webp"
                  alt="Portfolio Item 2"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/webp/5.webp"
                  alt="Portfolio Item 5"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/webp/7.webp"
                  alt="Portfolio Item 7"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/webp/Group.webp"
                  alt="Portfolio Item 3"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
            </div>
            {/* <hr className="w-3/5 h-px bg-gray-600 border-none mx-auto mb-5 mt-10" /> */}
          </section>

          {/* Logos Section */}
          <section className=" z-[10]">
            <Logos />
          </section>
          </div>
        </div>
        
        {/* Water effect - Text AND images rendered together in Pixi */}
        <PixiWaterImages containerRef={contentRef} intensity={waterIntensity} />
      </div>
      
      {/* Both mobile and desktop: Text and images in same Pixi canvas with uniform water effect
          Mobile: 75% intensity (baseScale 5 × 0.75 = 3.75) - MORE visible than desktop!
          Desktop: 50% intensity (baseScale 6 × 0.5 = 3.0) */}
    </>
  );
}
