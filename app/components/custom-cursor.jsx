"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const trailPosRef = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0, y: 0 }); // Track previous mouse position
  const animationFrameRef = useRef(null);
  const lastShadowTimeRef = useRef(0); // Track last shadow creation time
  const idCounterRef = useRef(0); // Unique ID counter
  const [shadowEffects, setShadowEffects] = useState([]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    const handleMouseMove = (e) => {
      if (!isMobile) {
        posRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateCursorPosition = () => {
      if (isMobile) return;

      // Smooth trailing effect
      trailPosRef.current = {
        x:
          trailPosRef.current.x +
          (posRef.current.x - trailPosRef.current.x) * 0.4,
        y:
          trailPosRef.current.y +
          (posRef.current.y - trailPosRef.current.y) * 0.4,
      };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${
          posRef.current.x - 1
        }px, ${posRef.current.y - 1}px)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${
          trailPosRef.current.x - 32
        }px, ${trailPosRef.current.y - 32}px)`;
      }

      // Only add shadow if mouse position has changed and throttled
      if (
        posRef.current.x !== prevPosRef.current.x ||
        posRef.current.y !== prevPosRef.current.y
      ) {
        const now = performance.now();
        if (now - lastShadowTimeRef.current >= 120) {
          // Throttle to every 120ms for less scattered trail
          setShadowEffects((prev) => [
            ...prev,
            {
              id: idCounterRef.current++, // Unique ID
              x: trailPosRef.current.x,
              y: trailPosRef.current.y,
            },
          ]);

          // Remove shadow after 1.2 seconds for tighter trail
          setTimeout(() => {
            setShadowEffects((prev) => prev.slice(1));
          }, 1200);

          lastShadowTimeRef.current = now;
        }

        // Update previous position
        prevPosRef.current = { ...posRef.current };
      }

      animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
    };

    animationFrameRef.current = requestAnimationFrame(updateCursorPosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkIfMobile);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Small white dot - main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50 transition-transform duration-75 ease-out"
      ></div>

      {/* Larger trailing circle */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-20 h-20 border-2 border-blue-500 rounded-full pointer-events-none z-40 transition-transform duration-300 ease-out"
        style={{
          borderWidth: "3px",
          opacity: 0.8,
        }}
      ></div>

      {/* Concentrated shadow trail effects */}
      <AnimatePresence>
        {shadowEffects.map((shadow) => (
          <motion.div
            key={shadow.id}
            className="fixed w-32 h-32 rounded-full pointer-events-none z-30"
            style={{
              left: shadow.x - 30,
              top: shadow.y - 30,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(200,200,255,0.1) 50%, transparent 70%)",
              filter: "blur(8px)",
            }}
            initial={{ opacity: 0.3, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}

// OLD Cursor

// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function CustomCursor() {
//   const cursorRef = useRef(null);
//   const trailRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const posRef = useRef({ x: 0, y: 0 });
//   const trailPosRef = useRef({ x: 0, y: 0 });
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);

//     const handleMouseMove = (e) => {
//       if (!isMobile) {
//         posRef.current = {
//           x: e.clientX,
//           y: e.clientY,
//         };
//       }
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     const updateCursorPosition = () => {
//       if (isMobile) return;

//       trailPosRef.current = {
//         x: trailPosRef.current.x + (posRef.current.x - trailPosRef.current.x) * 0.2,
//         y: trailPosRef.current.y + (posRef.current.y - trailPosRef.current.y) * 0.2
//       };

//       if (cursorRef.current) {
//         cursorRef.current.style.transform = `translate(${posRef.current.x - 1}px, ${posRef.current.y - 1}px)`;
//       }

//       if (trailRef.current) {
//         trailRef.current.style.transform = `translate(${trailPosRef.current.x - 32}px, ${trailPosRef.current.y - 32}px)`;
//       }

//       animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
//     };

//     animationFrameRef.current = requestAnimationFrame(updateCursorPosition);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener('resize', checkIfMobile);
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, [isMobile]);

//   if (isMobile) return null;

//   return (
//     <>
//       <div
//         ref={cursorRef}
//         className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50 transition-transform duration-75 ease-out"
//       ></div>

//       <div
//         ref={trailRef}
//         className="fixed top-0 left-0 w-20 h-20 border-2 border-blue-500 rounded-full pointer-events-none z-40 transition-transform duration-300 ease-out"
//         style={{
//           borderWidth: "3px",
//           opacity: 0.8
//         }}
//       ></div>
//     </>
//   );
// }
