"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { Montserrat } from "next/font/google"; // Import Montserrat
import WaveCanvas from "./WaveCanvas"; // Import the WaveCanvas component

// Initialize Montserrat font
const montserratLight = Montserrat({
  weight: "300", // '300' corresponds to Light weight
  subsets: ["latin"],
  display: "swap",
});

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function EnhancedReverseStartLayout() {
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const textRef = useRef(null);

  const imageRefs = useRef([]);

  const designTextRef = useRef(null);
  const prTextRef = useRef(null);
  const socialTextRef = useRef(null);

  const words = useRef([]);
  const isLetterSystemInitialized = useRef(false);

  // Letter scaling system refs and variables
  const wordsData = useRef([]);
  const totalMovementDistance = useRef(0);
  const animationScrollBuffer = useRef(0);
  const wordSpacing = 220; // This controls initial spacing between *entire words*.
  // We will primarily control "gap" via letter-spacing.
  const avgCharWidth = 80;

  // Opacity system variables
  const isHoverActive = useRef(false);
  const hoveredWordIndex = useRef(-1);

  const leftImages = {
    1: "/image1.jpg",
    2: "/image2.jpg",
    3: "/image3.jpg",
    4: "/image4.jpg",
    5: "/image1.jpg",
    6: "/image2.jpg",
    7: "/image3.jpg",
    8: "/image4.jpg",
    9: "/image1.jpg",
  };

  const rightImages = {
    1: "/image4.jpg",
    2: "/image2.jpg",
    3: "/image2.jpg",
    4: "/image4.jpg",
    5: "/image4.jpg",
    6: "/image2.jpg",
    7: "/image3.jpg",
    8: "/image4.jpg",
    9: "/image2.jpg",
  };

  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  const initializeLetterSystem = () => {
    if (isLetterSystemInitialized.current) return;
    if (
      !socialTextRef.current ||
      !prTextRef.current ||
      !designTextRef.current
    ) {
      console.warn("Letter system refs not ready yet for SplitText.");
      return;
    }

    const wordElements = [
      designTextRef.current,
      prTextRef.current,
      socialTextRef.current,
    ];
    const wordTexts = ["DESIGN", "PR", "SOCIAL"];

    words.current = [];
    wordsData.current = [];

    wordElements.forEach((wordElement, index) => {
      const linkElement = wordElement.querySelector("a");

      if (!linkElement) {
        console.warn(`Link element not found for word:`, wordElement);
        return;
      }

      const splitText = new SplitText(linkElement, {
        type: "chars",
        charsClass: "letter-transform",
      });

      splitText.chars.forEach((letter) => {
        gsap.set(letter, {
          scale: 1,
          transformOrigin: "center center",
          letterSpacing: "0px", // Start with 0 or a very small value, will be dynamic
        });
      });

      words.current.push({
        element: wordElement,
        linkElement: linkElement,
        splitTextInstance: splitText,
        letters: splitText.chars,
        originalText: linkElement.textContent,
        index: index,
      });

      const wordWidth =
        linkElement.clientWidth || wordTexts[index].length * avgCharWidth;
      wordsData.current.push({
        element: linkElement,
        letters: splitText.chars,
        text: wordTexts[index],
        initialX: 0,
        width: wordWidth,
      });
    });

    isLetterSystemInitialized.current = true;
    console.log("Letter system initialized with SplitText:", words.current);
  };

  const calculatePositionsAndScrollRange = () => {
    if (wordsData.current.length === 0) return;

    const screenWidth = window.innerWidth;
    let currentXOffset = 0;

    const firstWord = wordsData.current[0];
    firstWord.initialX = screenWidth / 2 - firstWord.width / 2;
    currentXOffset = firstWord.initialX + firstWord.width + wordSpacing;

    for (let i = 1; i < wordsData.current.length; i++) {
      const word = wordsData.current[i];
      word.initialX = currentXOffset;
      currentXOffset += word.width + wordSpacing;
    }

    const lastWord = wordsData.current[wordsData.current.length - 1];
    const lastWordTargetX = screenWidth / 2 - lastWord.width / 2;
    totalMovementDistance.current = Math.max(
      0,
      lastWord.initialX - lastWordTargetX
    );

    animationScrollBuffer.current = window.innerHeight * 1;
  };

  // NEW: Dynamic opacity system
  const updateOpacitySystem = () => {
    if (!words.current.length || !isLetterSystemInitialized.current) return;

    const screenWidth = window.innerWidth;
    const centerX = screenWidth / 2;

    if (isHoverActive.current && hoveredWordIndex.current !== -1) {
      // Hover state: hovered word gets full opacity, others get reduced
      words.current.forEach((word, index) => {
        const targetOpacity = index === hoveredWordIndex.current ? 1 : 0.3;
        gsap.to(word.element, {
          opacity: targetOpacity,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    } else {
      // Normal state: word closest to center gets full opacity
      let closestWordIndex = 0;
      let closestDistance = Infinity;

      words.current.forEach((word, index) => {
        const rect = word.element.getBoundingClientRect();
        const wordCenterX = rect.left + rect.width / 2;
        const distanceFromCenter = Math.abs(wordCenterX - centerX);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestWordIndex = index;
        }
      });

      // Apply opacity based on proximity to center
      words.current.forEach((word, index) => {
        const rect = word.element.getBoundingClientRect();
        const wordCenterX = rect.left + rect.width / 2;
        const distanceFromCenter = Math.abs(wordCenterX - centerX);

        // Create a smooth opacity falloff
        const maxDistance = screenWidth * 0.4; // Distance at which opacity becomes minimal
        let opacity;

        if (index === closestWordIndex) {
          opacity = 1; // Closest word gets full opacity
        } else {
          // Other words get opacity based on distance from center
          const normalizedDistance = Math.min(
            distanceFromCenter / maxDistance,
            1
          );
          opacity = Math.max(0.4, 1 - normalizedDistance * 0.6); // Min opacity of 0.4
        }

        gsap.to(word.element, {
          opacity: opacity,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    }
  };

  const updateLetterTransformations = () => {
    if (!words.current.length || !isLetterSystemInitialized.current) return;

    const screenWidth = window.innerWidth;

    const centerZoneStart = screenWidth * 0.4;
    const centerZoneEnd = screenWidth * 0.6;

    const maxScale = 1.0;
    const baseScale = 0.8;

    const maxRotationDeg = 30;
    const minLetterSpacingPx = -20;
    const maxLetterSpacingPx = -10;

    words.current.forEach((word) => {
      word.letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;

        let scale = baseScale;
        let rotationY = 0;

        if (letterCenterX < centerZoneStart) {
          const progress = Math.min(
            1,
            Math.max(0, (centerZoneStart - letterCenterX) / centerZoneStart)
          );
          scale = baseScale + (maxScale - baseScale) * progress;
          rotationY = (maxRotationDeg * progress) / 2;
        } else if (letterCenterX > centerZoneEnd) {
          const progress = Math.min(
            1,
            Math.max(
              0,
              (letterCenterX - centerZoneEnd) / (screenWidth - centerZoneEnd)
            )
          );
          scale = baseScale + (maxScale - baseScale) * progress;
          rotationY = maxRotationDeg * progress;
        }

        const scaleRange = maxScale - baseScale;
        const currentScaleProgress = (scale - baseScale) / scaleRange;

        const adjustedLetterSpacing =
          scaleRange === 0
            ? minLetterSpacingPx
            : minLetterSpacingPx +
              (maxLetterSpacingPx - minLetterSpacingPx) * currentScaleProgress;

        gsap.set(letter, {
          scale,
          rotationY,
          transformOrigin: "center center",
          letterSpacing: `${adjustedLetterSpacing}px`,
        });
      });
    });

    // Update opacity system alongside letter transformations
    updateOpacitySystem();
  };

  // NEW: Setup hover events for opacity system
  const setupOpacityHoverEvents = () => {
    words.current.forEach((word, index) => {
      const linkElement = word.linkElement;

      linkElement.addEventListener("mouseenter", () => {
        isHoverActive.current = true;
        hoveredWordIndex.current = index;
        updateOpacitySystem();
      });

      linkElement.addEventListener("mouseleave", () => {
        isHoverActive.current = false;
        hoveredWordIndex.current = -1;
        updateOpacitySystem();
      });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const windowHeight = window.innerHeight;
      const maxScrollDistance = isMobile ? 1800 : 4000;

      gsap.set(containerRef.current, {
        height: maxScrollDistance + windowHeight,
      });

      const initialLeftOffset = windowHeight * (isMobile ? 0.2 : 0.4);
      const initialRightOffset = windowHeight * (isMobile ? 0.1 : 0.2);

      gsap.set(leftColRef.current, { y: initialLeftOffset });
      gsap.set(rightColRef.current, {
        y: -maxScrollDistance - initialRightOffset,
      });

      gsap.to(leftColRef.current, {
        y: -maxScrollDistance + initialLeftOffset,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: 1,
        },
      });

      gsap.to(rightColRef.current, {
        y: 0 + initialRightOffset,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: 1,
        },
      });

      const initializeAndSetup = () => {
        initializeLetterSystem();
        calculatePositionsAndScrollRange();
        updateLetterTransformations();
        setupOpacityHoverEvents(); // NEW: Setup hover events
      };

      const checkRefsInterval = setInterval(() => {
        if (
          socialTextRef.current &&
          prTextRef.current &&
          designTextRef.current
        ) {
          clearInterval(checkRefsInterval);
          initializeAndSetup();
        }
      }, 50);

      // Text horizontal scroll animation with letter scaling integration
      gsap.set(textRef.current, { x: "150vw" });

      gsap.to(textRef.current, {
        x: "-50vw", // This value determines how far the entire text block scrolls
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: 1,
          onUpdate: () => {
            if (isLetterSystemInitialized.current) {
              requestAnimationFrame(updateLetterTransformations);
            }
          },
        },
      });

      // --- CENTRALIZED RESET FUNCTION FOR IMAGE EFFECTS ---
      const resetImageFilters = () => {
        imageRefs.current.forEach((imageWrapper) => {
          const imageElement = imageWrapper.querySelector("img");
          if (imageElement) {
            gsap.killTweensOf(imageElement);
            imageElement.style.filter = "none";
            gsap.set(imageElement, { scale: 1 });
          }
        });
        const imageTurbulence = document.querySelector("#waterFilter feTurbulence");
        const imageDisplacementMap = document.querySelector("#waterFilter feDisplacementMap");
        if (imageTurbulence && imageDisplacementMap) {
          gsap.killTweensOf(imageTurbulence);
          gsap.killTweensOf(imageDisplacementMap);
          gsap.set(imageTurbulence, { attr: { baseFrequency: "0.005 0.008" } });
          gsap.set(imageDisplacementMap, { attr: { scale: 0 } });
        }
      };
      imageRefs.current.forEach((imageWrapper) => {
        const imageElement = imageWrapper.querySelector("img");
        if (imageElement) {
          imageWrapper.addEventListener("mouseenter", () => {
            resetImageFilters();
            const imageTurbulence = document.querySelector("#waterFilter feTurbulence");
            const imageDisplacementMap = document.querySelector("#waterFilter feDisplacementMap");
            if (imageTurbulence && imageDisplacementMap) {
              imageElement.style.filter = "url(#waterFilter)";
             // Modified for a gentler wave
   gsap.to(imageTurbulence, { 
          attr: { baseFrequency: "0.03 0.05" }, // Significantly increased from "0.008 0.01"
          duration: 15.0, 
          ease: "none", 
          repeat: -1, 
          yoyo: true 
        });

        // 2. INCREASE scale for a stronger, more visible displacement
        // Experiment with these values, starting around 40-60:
        gsap.to(imageDisplacementMap, { 
          attr: { scale: 13 }, // Increased from 15 (previous suggestion) or 35 (original)
          duration: 0.9, 
          ease: "power1.out" 
        });

        gsap.to(imageElement, { scale: 1.03, duration: 0.2, ease: "power1.out" });
      }
    });          imageWrapper.addEventListener("mouseleave", () => {
            const imageTurbulence = document.querySelector("#waterFilter feTurbulence");
            const imageDisplacementMap = document.querySelector("#waterFilter feDisplacementMap");
            gsap.killTweensOf(imageTurbulence);
            gsap.killTweensOf(imageDisplacementMap);
            gsap.killTweensOf(imageElement);
            gsap.to(imageTurbulence, { attr: { baseFrequency: "0.003 0.006" }, duration: 0.5, ease: "power2.out" });
            gsap.to(imageDisplacementMap, { attr: { scale: 0 }, duration: 0.5, ease: "power2.out", onComplete: () => { imageElement.style.filter = "none"; } });
            gsap.to(imageElement, { scale: 1, duration: 0.5, ease: "power1.out" });
          });
        }
      });

      // --- CENTRALIZED RESET FUNCTION FOR TEXT EFFECTS ---
      const resetTextFilters = () => {
        words.current.forEach((word) => {
          if (word.linkElement) {
            gsap.killTweensOf(word.linkElement);
            word.linkElement.style.filter = "none";
            gsap.set(word.linkElement, { scale: 1 }); // Ensure scale is reset
          }
        });
        const textTurbulence = document.querySelector(
          "#textWaterFilter feTurbulence"
        );
        const textDisplacementMap = document.querySelector(
          "#textWaterFilter feDisplacementMap"
        );
        if (textTurbulence && textDisplacementMap) {
          gsap.killTweensOf(textTurbulence);
          gsap.killTweensOf(textDisplacementMap);
          gsap.set(textTurbulence, { attr: { baseFrequency: "0.01 0.01" } });
          gsap.set(textDisplacementMap, { attr: { scale: 0 } });
        }
      };

      // Text water effects
      const animateTextWaterEffect = (textElement) => {
        if (!textElement) return;

        const linkElement = textElement.querySelector("a");
        if (!linkElement) return;

        linkElement.addEventListener("mouseenter", () => {
          // Reset all text filters before applying a new one
          resetTextFilters();

          const textTurbulence = document.querySelector(
            "#textWaterFilter feTurbulence"
          );
          const textDisplacementMap = document.querySelector(
            "#textWaterFilter feDisplacementMap"
          );

          if (textTurbulence && textDisplacementMap) {
            linkElement.style.filter = "url(#textWaterFilter)";

            gsap.to(textTurbulence, {
              attr: { baseFrequency: "0.01 0.05" },
              duration: 3.0,
              ease: "sine.inOut",
              repeat: -1, // Make it repeat indefinitely
              yoyo: true, // Go back and forth for a smoother loop
            });

            gsap.to(textDisplacementMap, {
              attr: { scale: 50 },
              duration: 0.3,
              ease: "power2.out",
            });

            gsap.to(linkElement, {
              scale: 1.05,
              duration: 0.2,
              ease: "power1.out",
            });
          }
        });

        linkElement.addEventListener("mouseleave", () => {
          const textTurbulence = document.querySelector(
            "#textWaterFilter feTurbulence"
          );
          const textDisplacementMap = document.querySelector(
            "#textWaterFilter feDisplacementMap"
          );

          gsap.killTweensOf(textTurbulence); // Kill repeating turbulence
          gsap.killTweensOf(textDisplacementMap);
          gsap.killTweensOf(linkElement); // Kill any ongoing scale animation

          gsap.to(textTurbulence, {
            attr: { baseFrequency: "0.01 0.01" },
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(textDisplacementMap, {
            attr: { scale: 0 },
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              linkElement.style.filter = "none";
            },
          });

          gsap.to(linkElement, {
            scale: 1,
            duration: 0.3,
            ease: "power1.out",
          });
        });
      };

      const textEffectsInterval = setInterval(() => {
        if (
          designTextRef.current &&
          prTextRef.current &&
          socialTextRef.current
        ) {
          clearInterval(textEffectsInterval);
          animateTextWaterEffect(designTextRef.current);
          animateTextWaterEffect(prTextRef.current);
          animateTextWaterEffect(socialTextRef.current);
        }
      }, 50);

      const handleResize = () => {
        ScrollTrigger.refresh();
        if (isLetterSystemInitialized.current) {
          calculatePositionsAndScrollRange();
          requestAnimationFrame(updateLetterTransformations);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearInterval(checkRefsInterval);
        clearInterval(textEffectsInterval);
        window.removeEventListener("resize", handleResize);
        words.current.forEach((word) => {
          if (word.splitTextInstance) {
            word.splitTextInstance.revert();
          }
          if (word.linkElement) {
            word.linkElement.style.filter = "none";
            gsap.set(word.linkElement, { scale: 1, rotationY: 0, opacity: 1 }); // Reset opacity too
          }
        });
        imageRefs.current.forEach((imageWrapper) => {
          const imageElement = imageWrapper.querySelector("img");
          if (imageElement) {
            imageElement.style.filter = "none";
            gsap.set(imageElement, { scale: 1 });
          }
        });
        isLetterSystemInitialized.current = false;
        isHoverActive.current = false;
        hoveredWordIndex.current = -1;
        ctx.revert();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* SVG Filters Definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="waterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.008"
            numOctaves="2"
            result="noiseForImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noiseForImage"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="textWaterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="3"
            result="noiseForText"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noiseForText"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden reverse-start-layout z-0"
        style={{ background: "#000" }}
      >
        {/* Left Column */}
        <div
          ref={leftColRef}
          className="fixed top-0 w-[42%] md:w-[35%] flex flex-col gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4 z-10"
          style={{
            left: "50%",
            transform: "translateX(-100%)",
            marginLeft: "-2%",
          }}
        >
          {Object.entries(leftImages).map(([key, src]) => (
            <div
              key={`left-${key}`}
              ref={addImageRef}
              className="w-full aspect-[3/4] relative mb-10 md:mb-32 cursor-pointer"
            >
              <Image
                src={src}
                alt={`Left Image ${key}`}
                fill
                className="object-cover"
                quality={100}
                sizes="(max-width: 768px) 50vw, 40vw"
              />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div
          ref={rightColRef}
          className="fixed top-0 w-[42%] md:w-[35%] flex flex-col-reverse gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4 z-10"
          style={{
            left: "50%",
            transform: "translateX(4%)",
            marginRight: "-2%",
          }}
        >
          {Object.entries(rightImages).map(([key, src]) => (
            <div
              key={`right-${key}`}
              ref={addImageRef}
              className="w-full aspect-[3/4] relative mb-10 md:mb-32 cursor-pointer"
            >
              <Image
                src={src}
                alt={`Right Image ${key}`}
                fill
                className="object-cover mb-20 mt-20"
                quality={100}
                sizes="(max-width: 768px) 50vw, 40vw"
              />
            </div>
          ))}
        </div>
        <div
          ref={textRef}
          className="fixed gap-10 top-1/2 transform -translate-y-1/2 flex md:gap-40 whitespace-nowrap z-20 items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* Apply the font to each h1 element */}
          <h1
            ref={designTextRef}
            className={`text-7xl md:text-9xl lg:text-9xl text-white/90 transition-opacity duration-300 font-bellota-light`}
          >
            <a href="/design" className="inline-block">
              DESIGN
            </a>
          </h1>
          <h1
            ref={prTextRef}
            className={`text-7xl md:text-9xl lg:text-9xl text-white/90 transition-opacity duration-300 font-bellota-light`}
          >
            <a href="/PR" className="inline-block">
              PR
            </a>
          </h1>
          <h1
            ref={socialTextRef}
            className={`text-7xl md:text-9xl lg:text-9xl text-white/90 transition-opacity duration-300 font-bellota-light`}
          >
            <a href="/social-scroll" className="inline-block">
              SOCIAL
            </a>
          </h1>
        </div>
        {/* Added this div for the "scroll & select" text with styling */}
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-30">
          <p className="text-white text-sm font-bold opacity-35">
            SCROLL AND SELECT
          </p>
        </div>  
      </div>
    </>
  );
}
