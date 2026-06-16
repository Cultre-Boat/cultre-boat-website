"use client";

import { useEffect, useRef } from "react";
import { Text } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Scrolling3DText({ scrollVelocity }) {
  const ref = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(ref.current.position, {
      x: -window.innerWidth * 2.5,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=4000",
        scrub: true,
      },
    });
  }, []);

  return (
    <group ref={ref} position={[window.innerWidth, 0, 0]}>
      <Text
        font="/fonts/Inter-Thin.woff"
        fontSize={window.innerWidth > 768 ? 6 : 3}
        letterSpacing={-0.05}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        DESIGN&nbsp;&nbsp;/&nbsp;&nbsp;PR&nbsp;&nbsp;/&nbsp;&nbsp;SOCIAL
      </Text>
    </group>
  );
}