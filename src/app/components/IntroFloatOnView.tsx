'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type IntroFloatOnViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  floatY?: number;
  duration?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function IntroFloatOnView({
  children,
  className,
  delay = 0,
  floatY = -10,
  duration = 1,
  triggerRef,
}: IntroFloatOnViewProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = wrapperRef.current;
    const triggerElement = triggerRef?.current ?? element;
    if (!element || !triggerElement) return;

    let observer: IntersectionObserver | null = null;
    let introTween: gsap.core.Tween | null = null;
    let floatTween: gsap.core.Tween | null = null;
    let rafId = 0;
    let hasPlayed = false;

    const ctx = gsap.context(() => {
      gsap.set(element, {
        opacity: 0,
        y: 500,
        scale: 0.95,
      });

      introTween = gsap.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        paused: true,
        onStart: () => {
          floatTween?.kill();
          floatTween = null;
        },
        onComplete: () => {
          floatTween?.kill();
          floatTween = gsap.to(element, {
            y: floatY,
            duration: 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
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
      floatTween?.kill();
      ctx.revert();
    };
  }, [delay, duration, floatY, triggerRef]);

  return <div ref={wrapperRef} className={joinClasses('will-change-[transform,opacity]', className)}>{children}</div>;
}
