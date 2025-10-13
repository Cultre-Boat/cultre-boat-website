"use client";

import { useState, useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import Last from "../components/design-last";
import Logos from "../components/brand-logos";
import Mailers from "../components/mailers";
import LIZ from "../components/designLiz";
import MovingFog from "../components/MovingFog";
import PixiWaterImages from "../components/PixiWaterImages";

const PixiWaterText = ({ containerRef }) => {
  const pixiContainerRef = useRef(null);

  useEffect(() => {
    if (!pixiContainerRef.current || !containerRef.current) return;

    // Get text elements within containerRef, excluding no-water-effect
    const textElements = containerRef.current.querySelectorAll(
      "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
    );
    if (textElements.length === 0) return;

    // Initialize PIXI application
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    pixiContainerRef.current.appendChild(app.view);
    app.view.style.position = "absolute";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.pointerEvents = "none";

    // Displacement sprite with fallback
    const displacementSprite = PIXI.Sprite.from("/pattern-clouds.jpg");
    displacementSprite.texture.baseTexture.on("error", () => {
      console.error("Failed to load /pattern-clouds.jpg, using fallback");
      displacementSprite.texture = PIXI.Texture.from(
        "https://i.imgur.com/3PTiU4U.jpg"
      );
    });
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    displacementSprite.alpha = 0;
    displacementSprite.width = window.innerWidth;
    displacementSprite.height = window.innerHeight;
    const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementFilter.scale.set(10, 10);

    app.stage.addChild(displacementSprite);

    // Create PIXI text for each DOM text element
    const textSprites = [];
    textElements.forEach((el) => {
      const text = el.textContent;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const textSprite = new PIXI.Text(text, {
        fontFamily: style.fontFamily,
        fontSize: parseFloat(style.fontSize),
        fontWeight: style.fontWeight,
        fill: style.color,
        align: "left",
      });

      textSprite.x = rect.left + rect.width / 2;
      textSprite.y = rect.top + rect.height / 2;
      textSprite.anchor.set(0.5);
      textSprite.filters = [displacementFilter];

      app.stage.addChild(textSprite);
      textSprites.push({ sprite: textSprite, element: el });
    });

    // Animate displacement
    app.ticker.add(() => {
      displacementSprite.x += 1;
      displacementSprite.y += 1;
    });

    // Update positions on resize and scroll
    const updatePositions = () => {
      textSprites.forEach(({ sprite, element }) => {
        const rect = element.getBoundingClientRect();
        sprite.x = rect.left + rect.width / 2;
        sprite.y = rect.top + rect.height / 2;
        sprite.visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      app.renderer.resize(window.innerWidth, window.innerHeight);
      displacementSprite.width = window.innerWidth;
      displacementSprite.height = window.innerHeight;
    };

    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      if (pixiContainerRef.current) pixiContainerRef.current.innerHTML = "";
    };
  }, [containerRef]);

  return (
    <div
      ref={pixiContainerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2]"
    />
  );
};

export default function DesignPortfolio() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Hide text elements within contentRef, excluding no-water-effect
    const textElements = contentRef.current.querySelectorAll(
      "h1:not(.no-water-effect), h2:not(.no-water-effect), h3:not(.no-water-effect), p:not(.no-water-effect), a:not(.no-water-effect)"
    );
    textElements.forEach((el) => {
      el.style.opacity = "0";
    });

    // Debug image loading
    const images = contentRef.current.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete || img.naturalWidth === 0) {
        console.error(`Failed to load image: ${img.src}`);
      }
    });

    return () => {
      textElements.forEach((el) => {
        el.style.opacity = "1";
      });
    };
  }, []);

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
      <PixiWaterText containerRef={contentRef} />
      <PixiWaterImages containerRef={contentRef} />
      <div
        ref={contentRef}
        className="text-white leading-relaxed font-bellota-light"
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-4 px-0">
          {/* Header Section */}
          <section className=" relative mt-20 text-center sm:text-left z-[10]">
            <div className="flex flex-col lg:flex-row items-center min-h-[400px] lg:min-h-[400px] gap-5 lg:gap-10 md:mt-0">
              <div className="flex-1 px-4 lg:px-5">
                <p className="text-lg tracking-[2px] uppercase  my-5">
                  DECODING BRANDING
                </p>
                <h1 className="text-6xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight mb-5 leading-none">
                  DESIGN
                </h1>
                <p className="text-xl lg:text-lg text-gray-300 mt-2.5 mb-0">
                  Brand Identity Design
                </p>
                <p className="text-xl lg:text-lg text-gray-300">
                  Tone Of Voice
                </p>
              </div>
              <div className="flex-1 relative w-full max-w-full lg:max-w-2xl mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/Design-image1.webp"
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
          <section className="mt-10 md:mt-0 text-center sm:text-left z-[10]">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-24 justify-center mb-2 mx-auto items-stretch">
              {/* Left Image */}
              <div className="relative overflow-hidden w-full lg:w-[650px] md:mb-0 mx-auto lg:mx-0 z-[10] flex items-stretch">
                <span className="absolute left-0 z-[11] bg-black text-white px-2.5 rounded-tr-lg rounded-br-lg text-sm lg:text-base tracking-wider">
                  For GURORGANIC by Pernia Qureshi
                </span>
                <img
                  src="/Design/Design-image2.webp"
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
                  src="/Design/Design-image3-1-1.png"
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
          <section className="text-center z-[10]">
            <h2 className="text-xl lg:text-2xl font-light tracking-[2px] uppercase md:mt-7">
              CREATIVE DIRECTION AND STRATEGY
            </h2>
            <p className="text-base lg:text-xl  italic mb-5 md:mb-7">
              Brand Positioning
            </p>

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
                    src="/Design/Design-image4-1.webp"
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
                  src="/Design/img28.webp"
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
          <section className="text-center z-[10]">
            <h2 className="text-xl lg:text-2xl font-light tracking-[2px] uppercase mt-5 md:mt-7">
              VISUAL VOCABULARY
            </h2>
            <p className="text-base lg:text-xl  italic mb-5 md:mb-7">
              Exhibition Guidelines
            </p>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-24 justify-center lg:mx-4 mb-0 md:mb-9">
              <div className="relative overflow-hidden w-full lg:w-[70%] lg:max-w-[400px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/D_img1.jpg"
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
                  src="/Design/D_img2.jpg"
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
          <section className="text-center z-[10]">
            <h2 className="text-xl lg:text-2xl font-light tracking-[2px] uppercase mt-5 md:mt-7">
              PRINT AND DIGITAL DESIGN
            </h2>
            <p className="text-base lg:text-xl  italic mb-5 md:mb-7">
              Collaterals
            </p>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-24 justify-center lg:mx-4 mb-5">
              <div className="relative overflow-hidden w-full lg:w-[100%] lg:max-w-[650px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/DSC_1196_1.jpg"
                  alt="Print Design 1"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
              </div>
              <div className="relative overflow-hidden w-full lg:w-[70%] lg:max-w-[380px] mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Design/image-5.webp"
                  alt="Print Design 2"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
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
              <hr className="w-3/5 h-px bg-gray-600 border-none mx-auto mb-8" />
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-start justify-center lg:px-4">
              <div className="flex flex-col gap-4 w-full lg:max-w-lg lg:max-w-xl mx-auto lg:mx-0 z-[10]">
                <img
                  src="/Mailer/1.webp"
                  alt="Portfolio Item 1"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/4.webp"
                  alt="Portfolio Item 4"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/6.webp"
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
                  src="/Mailer/2.webp"
                  alt="Portfolio Item 2"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/5.webp"
                  alt="Portfolio Item 5"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/7.webp"
                  alt="Portfolio Item 7"
                  width={570}
                  height={400}
                  className="w-full h-auto object-contain z-[10]"
                  onError={(e) =>
                    console.error(`Failed to load image: ${e.target.src}`)
                  }
                />
                <img
                  src="/Mailer/Group.webp"
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
            <hr className="w-3/5 h-px bg-gray-600 border-none mx-auto mb-5 mt-10" />
          </section>

          {/* Logos Section */}
          <section className=" z-[10]">
            <Logos />
          </section>
        </div>
      </div>
    </>
  );
}
