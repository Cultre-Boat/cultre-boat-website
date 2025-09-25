"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [counter, setCounter] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress from 1 to 100
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            if (onLoadingComplete) onLoadingComplete();
          }, 500); // Short delay after reaching 100 before fading out
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Speed of counter - adjust as needed

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (isComplete) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white text-6xl font-bold mb-16"
        >
          <div className="text-white font-bold h-10 justify-center items-center flex flex-row gap-5">
            <a href="/" className="flex flex-row gap-5 items-center">
              <img
                src="/Vector 4.png"
                width={34}
                height={17}
                alt="First icon"
                className=""
              />
              <img
                src="/Group 2.png"
                width={26}
                height={16}
                alt="Second icon"
                className="scale-125 -left-1 relative ml-3"
              />
              <img
                src="/Vector 3.png"
                width={30}
                height={15}
                alt="Last icon"
                className="scale-110  ml-3"
              />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-8 text-white text-sm"
        >
          {counter}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
