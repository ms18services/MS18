'use client';

import { useEffect, useRef } from 'react';

type WavesBackgroundProps = {
  className?: string;
  lineCount?: number;
  lineColor?: [number, number, number];
  accentColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  fullBleedX?: boolean;
  bleedY?: number;
  showGlow?: boolean;
  interactive?: boolean;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function interpolateColor(
  from: [number, number, number],
  to: [number, number, number],
  progress: number
) {
  return [
    Math.round(from[0] + (to[0] - from[0]) * progress),
    Math.round(from[1] + (to[1] - from[1]) * progress),
    Math.round(from[2] + (to[2] - from[2]) * progress),
  ] as const;
}

export default function WavesBackground({
  className,
  lineCount = 14,
  lineColor = [72, 115, 255],
  accentColor = [154, 66, 230],
  speed = 0.8,
  amplitude = 20,
  fullBleedX = true,
  bleedY = 12,
  showGlow = false,
  interactive = true,
}: WavesBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const mouseTargetRef = useRef({ x: 0.5, y: 0.3, active: 0 });
  const mouseCurrentRef = useRef({ x: 0.5, y: 0.3, active: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    resize();

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = wrapper.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside) {
        mouseTargetRef.current.active = 0;
        return;
      }

      mouseTargetRef.current = {
        x: (clientX - rect.left) / Math.max(rect.width, 1),
        y: (clientY - rect.top) / Math.max(rect.height, 1),
        active: 1,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!interactive) return;
      updateMouse(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      mouseTargetRef.current.active = 0;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    const render = (time: number) => {
      const t = time * 0.001 * speed;
      context.clearRect(0, 0, width, height);

      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.08;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.08;
      mouseCurrentRef.current.active += (mouseTargetRef.current.active - mouseCurrentRef.current.active) * 0.08;

      const mouseX = mouseCurrentRef.current.x * width;
      const mouseY = mouseCurrentRef.current.y * height;
      const mouseActive = mouseCurrentRef.current.active;

      for (let index = 0; index < lineCount; index += 1) {
        const progress = lineCount <= 1 ? 0 : index / (lineCount - 1);
        const [r, g, b] = interpolateColor(lineColor, accentColor, progress);
        const baseY = height * (0.12 + progress * 0.78);
        const localAmplitude = amplitude * (0.5 + progress * 0.8);
        const frequency = 0.008 + progress * 0.004;
        const phase = t * (1.4 + progress * 0.45);
        let maxInfluence = 0;

        context.beginPath();

        for (let x = 0; x <= width + 8; x += 8) {
          const dx = x - mouseX;
          const dy = baseY - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 120 + progress * 90;
          const influence = interactive
            ? Math.max(0, 1 - distance / influenceRadius) * mouseActive
            : 0;
          if (influence > maxInfluence) {
            maxInfluence = influence;
          }
          const ripple =
            influence > 0
              ? Math.sin((distance * 0.06) - t * 4.5) * influence * (8 + progress * 10)
              : 0;

          const y =
            baseY +
            Math.sin(x * frequency + phase) * localAmplitude +
            Math.cos(x * frequency * 0.45 - phase * 1.2) * (localAmplitude * 0.35) +
            ripple;

          if (x === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }

        context.lineWidth = 1 + progress * 1.2 + maxInfluence * 0.6;
        context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 + progress * 0.14 + maxInfluence * 0.3})`;
        context.stroke();
      }

      frameRef.current = window.requestAnimationFrame(render);
    };

    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [accentColor, amplitude, interactive, lineColor, lineCount, showGlow, speed]);

  const bleedYRem = `${bleedY / 4}rem`;

  return (
    <div
      ref={wrapperRef}
      className={joinClasses(
        fullBleedX
          ? 'pointer-events-none absolute left-1/2 w-screen -translate-x-1/2 overflow-visible'
          : 'pointer-events-none absolute overflow-visible',
        className
      )}
      style={
        fullBleedX
          ? {
              top: `calc(-1 * ${bleedYRem})`,
              height: `calc(100% + (${bleedYRem} * 2))`,
            }
          : {
              inset: `calc(-1 * ${bleedYRem})`,
            }
      }
    >
      <canvas ref={canvasRef} className="h-full w-full scale-[1.06]" aria-hidden="true" />
    </div>
  );
}
