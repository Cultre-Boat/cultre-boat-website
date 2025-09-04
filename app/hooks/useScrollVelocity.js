import { useRef, useEffect } from 'react';

export default function useScrollVelocity() {
  const velocity = useRef(0);
  let lastScrollY = 0;
  let lastTime = Date.now();

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      const timeDelta = now - lastTime;
      velocity.current = Math.abs(delta) / Math.max(timeDelta, 16);
      lastScrollY = currentScrollY;
      lastTime = now;
      requestAnimationFrame(update);
    };
    update();
  }, []);

  return velocity;
}
