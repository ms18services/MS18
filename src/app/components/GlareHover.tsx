'use client';

import { useRef } from 'react';

type GlareHoverProps = {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function GlareHover({
  children,
  className,
  glareColor = '255 255 255',
}: GlareHoverProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const updatePointer = (clientX: number, clientY: number) => {
    const element = rootRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const y = ((clientY - rect.top) / Math.max(rect.height, 1)) * 100;

    element.style.setProperty('--glare-x', `${x}%`);
    element.style.setProperty('--glare-y', `${y}%`);
  };

  return (
    <div
      ref={rootRef}
      className={joinClasses('group/glare relative overflow-hidden', className)}
      style={
        {
          '--glare-x': '50%',
          '--glare-y': '50%',
          '--glare-color': glareColor,
        } as React.CSSProperties
      }
      onMouseEnter={(event) => updatePointer(event.clientX, event.clientY)}
      onMouseMove={(event) => updatePointer(event.clientX, event.clientY)}
    >
      <div className="relative z-10">{children}</div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-20%] z-20 opacity-0 transition-opacity duration-300 ease-out group-hover/glare:opacity-100"
        style={{
          background: `
            radial-gradient(circle at var(--glare-x) var(--glare-y),
              rgb(var(--glare-color) / 0.34) 0%,
              rgb(var(--glare-color) / 0.14) 16%,
              rgb(var(--glare-color) / 0.07) 28%,
              transparent 48%
            ),
            linear-gradient(
              115deg,
              transparent 22%,
              rgb(var(--glare-color) / 0.02) 40%,
              rgb(var(--glare-color) / 0.24) 50%,
              rgb(var(--glare-color) / 0.04) 60%,
              transparent 76%
            )
          `,
          transform: 'translate3d(0,0,0)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 ease-out group-hover/glare:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, transparent 28%, rgb(var(--glare-color) / 0.12) 48%, transparent 66%)',
          transform: 'translateX(calc((var(--glare-x) - 50%) * 0.08)) translateY(calc((var(--glare-y) - 50%) * 0.04))',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
