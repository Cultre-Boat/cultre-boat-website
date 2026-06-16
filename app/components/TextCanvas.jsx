"use client";

import { Canvas } from "@react-three/fiber";
import Scrolling3DText from "./Scrolling3DText";
import { Suspense } from "react";

export default function TextCanvas({ scrollVelocity }) {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 30,
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 150], fov: 45 }}
    >
      <Suspense fallback={null}>
        <Scrolling3DText scrollVelocity={scrollVelocity} />
      </Suspense>
    </Canvas>
  );
}