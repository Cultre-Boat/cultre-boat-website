"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function BrandModal({
  isOpen,
  onClose,
  brandName,
  brandSlug,
  images = [],
  instagramUrl,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const modalRef = useRef(null);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext(); // Swipe left
    } else if (distance < -minSwipeDistance) {
      handlePrev(); // Swipe right
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Click on sides to navigate (Only works if not clicking the image directly)
  const handleClickSide = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (clickX > centerX) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Animated Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            className="absolute inset-0 bg-black/85"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative z-10 w-full max-w-7xl h-[95vh] flex flex-col bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-3 md:p-6"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex justify-center items-center mb-2 md:mb-4 relative">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide text-center"
              >
                {brandName}
              </motion.h2>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 hover:scale-110 backdrop-blur-md transition-all group z-50"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Main Image Display with navigation */}
            <div
              className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm group cursor-pointer"
              onClick={handleClickSide}
            >
              {/* Current Image */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`image-${currentIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="absolute inset-0 flex items-center justify-center p-2 md:p-4"
                >
                  {/* INSTAGRAM REDIRECT WRAPPER */}
                  <div
                    className={`relative w-full h-full z-10 ${instagramUrl ? "cursor-pointer" : ""}`}
                    onClick={(e) => {
                      if (instagramUrl) {
                        e.stopPropagation(); // Prevents image slide from changing
                        window.open(
                          instagramUrl,
                          "_blank",
                          "noopener,noreferrer",
                        ); // Guaranteed Redirect
                      }
                    }}
                    title={
                      instagramUrl ? `Visit ${brandName} on Instagram` : ""
                    }
                  >
                    <Image
                      src={images[currentIndex]}
                      alt={`${brandName} ${currentIndex + 1}`}
                      fill
                      className="object-contain drop-shadow-2xl"
                      quality={100}
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 border border-white/20"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 border border-white/20"
              >
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>

              {/* Progress indicator */}
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-8 md:w-10 h-2 md:h-2.5 bg-white"
                        : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Image Counter - Centered */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-center"
            >
              <p className="text-white/80 text-sm md:text-base font-medium">
                <span className="text-white font-semibold">
                  {currentIndex + 1}
                </span>
                <span className="mx-2 text-white/50">/</span>
                <span className="text-white/60">{images.length}</span>
              </p>
            </motion.div>

            {/* Thumbnail Grid - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 md:mt-3 overflow-x-auto no-scrollbar"
            >
              <div className="flex gap-2 md:gap-3 pb-2 justify-center">
                {images.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                      index === currentIndex
                        ? "ring-3 ring-white shadow-lg shadow-white/50 scale-110 z-10"
                        : "opacity-60 hover:opacity-100 ring-1 ring-white/20"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full pointer-events-none"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
