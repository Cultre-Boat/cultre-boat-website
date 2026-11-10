"use client";
import { useRef } from "react";

// Returns touch handlers for a swipeable container.
// A horizontal swipe longer than 40px calls onNext (swipe left) or onPrev (swipe right).
// onStart / onEnd are optional and run on touch start / end (e.g. to pause autoplay).
export default function useSwipe({ onNext, onPrev, onStart, onEnd }) {
  const startX = useRef(null);
  return {
    onTouchStart: (e) => {
      onStart?.();
      startX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      startX.current = null;
      onEnd?.();
      if (Math.abs(dx) > 40) {
        if (dx < 0) onNext();
        else onPrev();
      }
    },
  };
}
