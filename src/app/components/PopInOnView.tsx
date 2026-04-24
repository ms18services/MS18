'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type PopInOnViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  startScale?: number;
  y?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function PopInOnView({
  children,
  className,
  delay = 0,
  duration = 0.85,
  startScale = 0.84,
  y = 36,
  triggerRef,
}: PopInOnViewProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = wrapperRef.current;
    const triggerElement = triggerRef?.current ?? element;
    if (!element || !triggerElement) return;

    let observer: IntersectionObserver | null = null;
    let introTween: gsap.core.Tween | null = null;
    let hasPlayed = false;
    let rafId = 0;

    const ctx = gsap.context(() => {
      gsap.set(element, {
        opacity: 0,
        y,
        scale: startScale,
        transformOrigin: '50% 50%',
      });

      introTween = gsap.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease: 'back.out(1.25)',
        paused: true,
      });

      const startIntro = () => {
        if (hasPlayed) return true;

        hasPlayed = true;
        observer?.disconnect();
        observer = null;
        introTween?.play(0);
        return true;
      };

      const playIfVisible = () => {
        if (hasPlayed) return true;

        const rect = triggerElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        if (rect.top <= viewportHeight * 0.92 && rect.bottom >= viewportHeight * 0.08) {
          return startIntro();
        }
        return false;
      };

      rafId = window.requestAnimationFrame(playIfVisible);

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry || !introTween) return;

          if (entry.isIntersecting && !hasPlayed) {
            startIntro();
          }
        },
        {
          threshold: 0.01,
          rootMargin: '0px 0px -6% 0px',
        }
      );

      observer.observe(triggerElement);
    }, wrapperRef);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      introTween?.kill();
      ctx.revert();
    };
  }, [delay, duration, startScale, triggerRef, y]);

  return <div ref={wrapperRef} className={joinClasses('will-change-[transform,opacity]', className)}>{children}</div>;
}
