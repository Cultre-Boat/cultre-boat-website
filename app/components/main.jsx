"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { Montserrat } from "next/font/google"; // Import Montserrat
import MovingFog from "./MovingFog"; // Import the WaveCanvas component
import UnderwaterEffect from "./UnderwaterEffect"; // Import the WaveCanvas component
import ScrollingText from "./ScrollingText";

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
  const wordsData = useRef([]);
  const totalMovementDistance = useRef(0);
  const animationScrollBuffer = useRef(0);
  const wordSpacing = 220;
  const avgCharWidth = 80;
  const isHoverActive = useRef(false);
  const hoveredWordIndex = useRef(-1);
  const [maxScroll, setMaxScroll] = useState(0);

  const leftImages = {
    1: "/image/img1.jpeg",
    2: "/image/img2.jpeg",
    3: "/image/img3.jpeg",
    4: "/image/img4.jpeg",
    5: "/image/img5.jpeg",
    6: "/image/img6.jpg",
    7: "/image/img7.jpg",
    8: "/image/img8.jpg",
    9: "/image/img9.jpg",
    10: "/image/img10.jpg",
  };

  const rightImages = {
    1: "/image/img10.jpg",
    2: "/image/img9.jpg",
    3: "/image/img8.jpg",
    4: "/image/img7.jpg",
    5: "/image/img6.jpg",
    6: "/image/img5.jpeg",
    7: "/image/img4.jpeg",
    8: "/image/img3.jpeg",
    9: "/image/img2.jpeg",
    10: "/image/img1.jpeg",
  };

  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
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

  const setupOpacityHoverEvents = () => {
    words.current.forEach((word, index) => {
      const linkElement = word.linkElement;

      linkElement.addEventListener("mouseenter", () => {
        isHoverActive.current = true;
        hoveredWordIndex.current = index;
      });

      linkElement.addEventListener("mouseleave", () => {
        isHoverActive.current = false;
        hoveredWordIndex.current = -1;
      });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (
        !containerRef.current ||
        !leftColRef.current ||
        !rightColRef.current
      ) {
        return;
      }
      const windowHeight = window.innerHeight;
      const columnHeight = leftColRef.current.scrollHeight;
      const maxScrollDistance = columnHeight - windowHeight + 100;
      setMaxScroll(maxScrollDistance);
      gsap.set(containerRef.current, {
        height: maxScrollDistance + windowHeight,
      });

      const initialLeftOffset = 0;
      const initialRightOffset = 0;

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
          scrub: true,
        },
      });

      gsap.to(rightColRef.current, {
        y: 0 + initialRightOffset,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: true,
        },
      });

      const initializeAndSetup = () => {
        words.current = [
          { linkElement: designTextRef.current?.querySelector("a") },
          { linkElement: prTextRef.current?.querySelector("a") },
          { linkElement: socialTextRef.current?.querySelector("a") },
        ].filter((word) => word.linkElement); // Filter out nulls if any

        wordsData.current = words.current.map((word) => ({
          width: word.linkElement?.parentElement?.offsetWidth || 0,
        }));

        calculatePositionsAndScrollRange();
        setupOpacityHoverEvents();
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

      let ticking = false;
      gsap.fromTo(
        textRef.current,
        { x: "30vw" },
        {
          x: "-150vw",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${maxScrollDistance}`,
            scrub: true,
          },
        }
      );

      // --- CONTINUOUS WATER EFFECT FOR IMAGES ---
      const imageTurbulence = document.querySelector(
        "#waterFilter feTurbulence"
      );
      const imageDisplacementMap = document.querySelector(
        "#waterFilter feDisplacementMap"
      );

      if (imageTurbulence && imageDisplacementMap) {
        // Apply the filter to all image elements
        imageRefs.current.forEach((imageWrapper) => {
          const imageElement = imageWrapper.querySelector("img");
          if (imageElement) {
            imageElement.style.filter = "url(#waterFilter)";
          }
        });

        // Set a constant, visible displacement scale for the effect
        gsap.set(imageDisplacementMap, { attr: { scale: 25 } });

        // Create a smooth, infinite animation for the turbulence
        gsap.to(imageTurbulence, {
          attr: { baseFrequency: "0.015 0.03" }, // Target frequency for the ripple
          duration: 10, // How long one cycle of the animation takes
          ease: "none",
          repeat: -1, // Loop forever
          yoyo: true, // Animate back and forth smoothly
        });
      }

      // --- CONTINUOUS WATER EFFECT FOR TEXT ---
      const textTurbulence = document.querySelector(
        "#textWaterFilter feTurbulence"
      );
      const textDisplacementMap = document.querySelector(
        "#textWaterFilter feDisplacementMap"
      );

      if (textTurbulence && textDisplacementMap) {
        // Apply the filter to all text link elements
        [designTextRef, prTextRef, socialTextRef].forEach((ref) => {
          const linkElement = ref.current?.querySelector("a");
          if (linkElement) {
            linkElement.style.filter = "url(#textWaterFilter)";
          }
        });

        // Set a constant, visible displacement scale
        gsap.set(textDisplacementMap, { attr: { scale: 15 } }); // Adjust scale as needed

        // Create a smooth, infinite animation for the text turbulence
        gsap.to(textTurbulence, {
          attr: { baseFrequency: "0.02 0.05" },
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
      const handleResize = () => {
        ScrollTrigger.refresh();
        if (isLetterSystemInitialized.current) {
          calculatePositionsAndScrollRange();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        clearInterval(checkRefsInterval);
        // clearInterval(textEffectsInterval);
        window.removeEventListener("resize", handleResize);

        words.current.forEach((word) => {
          if (word.splitTextInstance) {
            word.splitTextInstance.revert();
          }
          if (word.linkElement) {
            word.linkElement.onmouseenter = null;
            word.linkElement.onmouseleave = null;
          }
        });

        imageRefs.current.forEach((imageWrapper) => {
          const img = imageWrapper.querySelector("img");
          if (img) {
            img.onmouseenter = null;
            img.onmouseleave = null;
          }
        });

        isLetterSystemInitialized.current = false;
        isHoverActive.current = false;
        hoveredWordIndex.current = -1;
      };
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.killAll();
      gsap.killTweensOf("*");
    };
  }, []);
  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);
  }, []);

  return (
    <>
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="waterFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.008"
            numOctaves="1"
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
            numOctaves="1"
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

      <MovingFog />
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden reverse-start-layout z-0"
        style={{}}
      >
        {/* Left Column */}
        <div
          ref={leftColRef}
          className="fixed top-0 w-[42%] md:w-[35%] flex flex-col gap-4 md:gap-8 py-4 md:py-8 px-2 md:px-4 z-10"
          style={{
            left: "50%",
            transform: "translateX(-100%)",
            willChange: "transform",
            marginLeft: "-2%",
          }}
        >
          {Object.entries(leftImages).map(([key, src]) => (
            <div
              key={`left-${key}`}
              ref={addImageRef}
              className="w-full aspect-[3/4] relative mb-4 md:mb-8 cursor-pointer"
            >
              <Image
                src={src}
                alt={`Left Image ${key}`}
                fill
                className="object-cover"
                quality={80}
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
            willChange: "transform",
            marginRight: "-2%",
          }}
        >
          {Object.entries(rightImages).map(([key, src]) => (
            <div
              key={`right-${key}`}
              ref={addImageRef}
              className="w-full aspect-[3/4] relative mb-4 md:mb-8 cursor-pointer"
            >
              <Image
                src={src}
                alt={`Right Image ${key}`}
                fill
                className="object-cover mb-20 mt-20"
                quality={80}
                sizes="(max-width: 768px) 50vw, 40vw"
              />
            </div>
          ))}
        </div>
        <ScrollingText
          ref={textRef}
          designTextRef={designTextRef}
          prTextRef={prTextRef}
          socialTextRef={socialTextRef}
        />
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-30">
          <p className="text-white text-sm font-bold opacity-35">
            SCROLL AND SELECT
          </p>
        </div>
      </div>
    </>
  );
}
