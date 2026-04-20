"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { GLTFLoader } from "three-stdlib";

export default function Hero3D() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0.9, 2.6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[0, -0, 15]} intensity={1} />
        <directionalLight position={[3, -1, -10]} intensity={0.9} />
        <directionalLight position={[1.6,1.1, 2.8]} intensity={0.8} />
        <pointLight position={[3, 1, 2]} intensity={10} />
       

        <hemisphereLight color="#1b4ef7" groundColor="#9610f0" intensity={0.9} />

        <Suspense fallback={null}>
          <HeroModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

function HeroModel() {
  const gltf = useLoader(GLTFLoader, "/ms183.glb");
  const groupRef = useRef<any>(null);
  const hoveringRef = useRef(false);
  const startRef = useRef<number | null>(null);

  // Base pose: slight lean (radians)
  const baseRotX = -0.25;
  const baseRotY = 0.15;

  return (
    <group
      ref={groupRef}
      position={[0, -10, 0]}
      rotation={[baseRotX, baseRotY, 0]}
      scale={0.9}
      onPointerOver={() => {
        hoveringRef.current = true;
      }}
      onPointerOut={() => {
        hoveringRef.current = false;
      }}
    >
      <primitive object={gltf.scene} />
      <ModelMotion
        groupRef={groupRef}
        hoveringRef={hoveringRef}
        startRef={startRef}
        baseRotX={baseRotX}
        baseRotY={baseRotY}
      />
    </group>
  );
}

function ModelMotion({
  groupRef,
  hoveringRef,
  startRef,
  baseRotX,
  baseRotY,
}: {
  groupRef: React.MutableRefObject<any>;
  hoveringRef: React.MutableRefObject<boolean>;
  startRef: React.MutableRefObject<number | null>;
  baseRotX: number;
  baseRotY: number;
}) {
  const { camera } = useThree();
  const yawOffsetRef = useRef(0);
  const spinRef = useRef({
    nextAt: 0,
    startAt: 0,
    duration: 0.9,
    active: false,
    startYaw: 0,
  });

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Time
    if (startRef.current === null) startRef.current = performance.now();
    const t = (performance.now() - startRef.current) / 1000;

    // Trigger a spin once in a while
    const s = spinRef.current;
    if (!s.nextAt) s.nextAt = t + 3.5;
    if (!s.active && t >= s.nextAt) {
      s.active = true;
      s.startAt = t;
      s.startYaw = yawOffsetRef.current;
      // random-ish interval between spins
      s.nextAt = t + 4 + Math.random() * 4;
    }

    if (s.active) {
      const p = Math.min(1, Math.max(0, (t - s.startAt) / s.duration));
      // easeInOutQuad
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      yawOffsetRef.current = s.startYaw + eased * Math.PI * 2;
      if (p >= 1) {
        s.active = false;
        yawOffsetRef.current = s.startYaw + Math.PI * 2;
      }
    }

    // Only react to mouse while hovering
    const mx = hoveringRef.current ? state.mouse.x : 0;
    const my = hoveringRef.current ? state.mouse.y : 0;

    // Float/bob effect
    const floatY = Math.sin(t * 1.2) * 0.04;

    // Mouse tracking (subtle)
    const targetRotX = baseRotX + my * 0.12;
    const targetRotY = baseRotY + yawOffsetRef.current + mx * 0.18;
    const targetPosY = -0.1 + floatY;

    // Smooth damping
    const damp = Math.min(1, delta * 6);
    g.rotation.x += (targetRotX - g.rotation.x) * damp;
    g.rotation.y += (targetRotY - g.rotation.y) * damp;
    g.position.y += (targetPosY - g.position.y) * damp;

    // Keep camera centered toward the model
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}
