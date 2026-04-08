'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function DirectionalMarquee({
  children,
  speedPxPerSecond = 80,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  speedPxPerSecond?: number;
  reverse?: boolean;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  const content = useMemo(() => children, [children]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const group = groupRef.current;
    if (!wrapper || !group) return;

    let x = 0;
    let groupWidth = group.getBoundingClientRect().width;
    let scrollDir = 1;
    let lastTime = performance.now();

    const ro = new ResizeObserver(() => {
      groupWidth = group.getBoundingClientRect().width;
    });
    ro.observe(group);

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self: any) => {
        // 1 = scrolling down, -1 = scrolling up
        scrollDir = self.direction || 1;
      },
    });

    const tick = () => {
      if (pausedRef.current) return;
      const t = performance.now();
      const dt = Math.min(64, t - lastTime) / 1000;
      lastTime = t;

      const dir = (reverse ? -1 : 1) * scrollDir;
      x += dir * speedPxPerSecond * dt;

      if (groupWidth > 0) {
        x = x % groupWidth;
        if (x > 0) x -= groupWidth;
      }

      gsap.set(wrapper, { x });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      ro.disconnect();
      gsap.set(wrapper, { clearProps: 'transform' });
    };
  }, [reverse, speedPxPerSecond, content]);

  return (
    <div
      className={className ?? ''}
      style={{ overflow: 'hidden' }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
    >
      <div ref={wrapperRef} style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}>
        <div ref={groupRef} style={{ display: 'flex' }}>
          {content}
        </div>
        <div aria-hidden="true" style={{ display: 'flex' }}>
          {content}
        </div>
      </div>
    </div>
  );
}
