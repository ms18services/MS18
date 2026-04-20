"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { GLTFLoader } from "three-stdlib";

export default function Hero3D() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0.9, 2.6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 1, 2]} intensity={1.5} />

        <Suspense fallback={null}>
          <HeroModel />
        </Suspense>

        <AutoRotate />
      </Canvas>
    </div>
  );
}

function HeroModel() {
  const gltf = useLoader(GLTFLoader, "/ms182.glb");



  return (
    <primitive
      object={gltf.scene}
      position={[0, 0.03, 0]}
      rotation={[-0.2, 0, 0]}
      scale={1}
    />
  );
}

function AutoRotate() {
  const startRef = useRef<number | null>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (startRef.current === null) startRef.current = performance.now();
    const t = (performance.now() - startRef.current) / 1000;
    const r = 2.9;
    camera.position.x = Math.cos(t * 0.20) * r;
    camera.position.z = Math.sin(t * 0.20) * r;
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}
