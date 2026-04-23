/* eslint-disable react-hooks/immutability */
'use client';

import { RefObject, useEffect, useMemo, useRef } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

const waveVertexShader = `
precision highp float;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform float colorIntensity;
uniform vec3 waveColor;
uniform vec3 baseColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

varying vec2 vUv;

vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);

  return 2.3 * n_xy;
}

void main() {
  vec2 uv = vUv;
  vec2 aspectUv = (uv - 0.5) * vec2(resolution.x / max(resolution.y, 1.0), 1.0);
  float mouseEffect = 0.0;

  if (enableMouseInteraction == 1) {
    vec2 mouseAspectUv = (mousePos - 0.5) * vec2(resolution.x / max(resolution.y, 1.0), 1.0);
    float dist = length(aspectUv - mouseAspectUv);
    mouseEffect = 1.0 - smoothstep(0.0, mouseRadius, dist);
  }

  float t = time * waveSpeed;
  float noiseA = cnoise(aspectUv * waveFrequency + vec2(t, t * 0.4));
  float noiseB = cnoise((aspectUv + vec2(3.7, -2.4)) * (waveFrequency * 1.75) - vec2(t * 0.3, t * 1.1));
  float bands = 0.5 + 0.5 * sin((aspectUv.y + noiseA * waveAmplitude) * 11.0 + t * 6.0);

  float field = clamp(0.2 + noiseA * 0.45 + noiseB * 0.25 + bands * 0.45, 0.0, 1.0);

  if (enableMouseInteraction == 1) {
    field -= 0.5 * mouseEffect;
  }

  vec3 color = mix(baseColor, waveColor * colorIntensity, clamp(field, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;

uniform float colorNum;
uniform float pixelSize;

const float bayerMatrix8x8[64] = float[64](
  0.0 / 64.0, 48.0 / 64.0, 12.0 / 64.0, 60.0 / 64.0,  3.0 / 64.0, 51.0 / 64.0, 15.0 / 64.0, 63.0 / 64.0,
  32.0 / 64.0, 16.0 / 64.0, 44.0 / 64.0, 28.0 / 64.0, 35.0 / 64.0, 19.0 / 64.0, 47.0 / 64.0, 31.0 / 64.0,
  8.0 / 64.0, 56.0 / 64.0,  4.0 / 64.0, 52.0 / 64.0, 11.0 / 64.0, 59.0 / 64.0,  7.0 / 64.0, 55.0 / 64.0,
  40.0 / 64.0, 24.0 / 64.0, 36.0 / 64.0, 20.0 / 64.0, 43.0 / 64.0, 27.0 / 64.0, 39.0 / 64.0, 23.0 / 64.0,
  2.0 / 64.0, 50.0 / 64.0, 14.0 / 64.0, 62.0 / 64.0,  1.0 / 64.0, 49.0 / 64.0, 13.0 / 64.0, 61.0 / 64.0,
  34.0 / 64.0, 18.0 / 64.0, 46.0 / 64.0, 30.0 / 64.0, 33.0 / 64.0, 17.0 / 64.0, 45.0 / 64.0, 29.0 / 64.0,
  10.0 / 64.0, 58.0 / 64.0,  6.0 / 64.0, 54.0 / 64.0,  9.0 / 64.0, 57.0 / 64.0,  5.0 / 64.0, 53.0 / 64.0,
  42.0 / 64.0, 26.0 / 64.0, 38.0 / 64.0, 22.0 / 64.0, 41.0 / 64.0, 25.0 / 64.0, 37.0 / 64.0, 21.0 / 64.0
);

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 resolution = vec2(textureSize(inputBuffer, 0));
  vec2 grid = vec2(max(pixelSize, 1.0)) / max(resolution, vec2(1.0));
  vec2 snappedUv = floor(uv / grid) * grid;
  vec4 color = texture(inputBuffer, snappedUv);

  float x = mod(floor(gl_FragCoord.x / max(pixelSize, 1.0)), 8.0);
  float y = mod(floor(gl_FragCoord.y / max(pixelSize, 1.0)), 8.0);
  int index = int(x + y * 8.0);
  float threshold = bayerMatrix8x8[index] - 0.5;

  float steps = max(colorNum - 1.0, 1.0);
  vec3 dithered = floor(color.rgb * steps + threshold) / steps;

  outputColor = vec4(dithered, color.a);
}
`;

class RetroEffectImpl extends Effect {
  constructor({ colorNum = 4, pixelSize = 2 }: { colorNum?: number; pixelSize?: number } = {}) {
    const uniforms = new Map<string, THREE.Uniform<number>>([
      ['colorNum', new THREE.Uniform(colorNum)],
      ['pixelSize', new THREE.Uniform(pixelSize)],
    ]);

    super('RetroEffect', ditherFragmentShader, { uniforms });
  }
}

const WrappedRetroEffect = wrapEffect(RetroEffectImpl);

type DitheredWavesProps = {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  colorIntensity: number;
  waveColor: [number, number, number];
  baseColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
  mousePositionRef?: RefObject<{ x: number; y: number } | null>;
};

const initialWaveColor: [number, number, number] = [0, 0, 0];
const initialBaseColor: [number, number, number] = [0.02, 0.0, 0.08];

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  colorIntensity,
  waveColor,
  baseColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
  mousePositionRef,
}: DitheredWavesProps) {
  const mouseRef = useRef(new THREE.Vector2(-10, -10));
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size, gl } = useThree();

  const waveUniforms = useMemo(() => ({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(0),
    waveFrequency: new THREE.Uniform(0),
    waveAmplitude: new THREE.Uniform(0),
    colorIntensity: new THREE.Uniform(1),
    waveColor: new THREE.Uniform(new THREE.Color(...initialWaveColor)),
    baseColor: new THREE.Uniform(new THREE.Color(...initialBaseColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(0),
    mouseRadius: new THREE.Uniform(0),
  }), []);

  const previousColor = useRef<[number, number, number]>(waveColor);
  const previousBaseColor = useRef<[number, number, number]>(baseColor);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.waveColor.value.setRGB(waveColor[0], waveColor[1], waveColor[2]);
    previousColor.current = [...waveColor] as [number, number, number];
  }, [waveColor]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.baseColor.value.setRGB(baseColor[0], baseColor[1], baseColor[2]);
    previousBaseColor.current = [...baseColor] as [number, number, number];
  }, [baseColor]);

  useEffect(() => {
    if (!materialRef.current) return;

    const dpr = gl.getPixelRatio();
    const width = Math.floor(size.width * dpr);
    const height = Math.floor(size.height * dpr);
    materialRef.current.uniforms.resolution.value.set(width, height);
  }, [gl, size, waveUniforms]);

  useFrame(({ clock }) => {
    const uniforms = materialRef.current?.uniforms;
    if (!uniforms) return;

    if (!disableAnimation) {
      uniforms.time.value = clock.getElapsedTime();
    }

    uniforms.waveSpeed.value = waveSpeed;
    uniforms.waveFrequency.value = waveFrequency;
    uniforms.waveAmplitude.value = waveAmplitude;
    uniforms.colorIntensity.value = colorIntensity;
    uniforms.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    uniforms.mouseRadius.value = mouseRadius;

    if (
      previousColor.current[0] !== waveColor[0] ||
      previousColor.current[1] !== waveColor[1] ||
      previousColor.current[2] !== waveColor[2]
    ) {
      uniforms.waveColor.value.setRGB(waveColor[0], waveColor[1], waveColor[2]);
      previousColor.current = [...waveColor] as [number, number, number];
    }

    if (
      previousBaseColor.current[0] !== baseColor[0] ||
      previousBaseColor.current[1] !== baseColor[1] ||
      previousBaseColor.current[2] !== baseColor[2]
    ) {
      uniforms.baseColor.value.setRGB(baseColor[0], baseColor[1], baseColor[2]);
      previousBaseColor.current = [...baseColor] as [number, number, number];
    }

    if (enableMouseInteraction) {
      const nextMouse = mousePositionRef?.current;
      if (nextMouse) {
        uniforms.mousePos.value.set(nextMouse.x, nextMouse.y);
      } else {
        uniforms.mousePos.value.copy(mouseRef.current);
      }
    }
  });

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!enableMouseInteraction) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.set(
      (event.clientX - rect.left) / Math.max(rect.width, 1),
      1 - (event.clientY - rect.top) / Math.max(rect.height, 1)
    );
  };

  return (
    <>
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniforms}
        />
      </mesh>

      <EffectComposer>
        <WrappedRetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>

      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={!mousePositionRef}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

type DitherBackgroundProps = {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  colorIntensity?: number;
  waveColor?: [number, number, number];
  baseColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  className?: string;
  mousePositionRef?: RefObject<{ x: number; y: number } | null>;
};

export default function DitherBackground({
  waveSpeed = 0.06,
  waveFrequency = 2.8,
  waveAmplitude = 0.35,
  colorIntensity = 1,
  waveColor = [0.41, 0.2, 0.60],
  baseColor = [0.02, 0.0, 0.08],
  colorNum = 4,
  pixelSize = 3,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  className = '',
  mousePositionRef,
}: DitherBackgroundProps) {
  return (
    <Canvas
      className={`h-full w-full ${className}`.trim()}
      camera={{ position: [0, 0, 6] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        colorIntensity={colorIntensity}
        waveColor={waveColor}
        baseColor={baseColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
        mousePositionRef={mousePositionRef}
      />
    </Canvas>
  );
}
