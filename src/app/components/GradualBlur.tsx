'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type GradualBlurProps = {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  y?: number;
  start?: string;
  end?: string;
  duration?: number;
  delay?: number;
  scrub?: boolean | number;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function GradualBlur({
  children,
  className,
  blur = 16,
  y = 48,
  start = 'top 88%',
  end = 'top 48%',
  duration = 0.9,
  delay = 0,
  scrub = 0.9,
}: GradualBlurProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    let observer: IntersectionObserver | null = null;
    let tween: gsap.core.Tween | null = null;

    if (scrub) {
      tween = gsap.fromTo(element, {
        filter: `blur(${blur}px)`,
        opacity: 0.25,
        y,
      }, {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      });
    } else {
      tween = gsap.fromTo(element, {
        filter: `blur(${blur}px)`,
        opacity: 0.25,
        y,
      }, {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        paused: true,
      });

      const playIfVisible = () => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        if (rect.top <= viewportHeight * 0.86 && rect.bottom >= 0) {
          tween?.play(0);
          return true;
        }
        return false;
      };

      if (!playIfVisible()) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry || !tween) return;

            if (entry.isIntersecting) {
              tween.play(0);
              return;
            }

            if (entry.boundingClientRect.top > 0) {
              tween.pause(0);
            }
          },
          {
            threshold: 0.05,
            rootMargin: '0px 0px -14% 0px',
          }
        );

        observer.observe(element);
      }
    }

    return () => {
      observer?.disconnect();
      if (tween?.scrollTrigger) tween.scrollTrigger.kill();
      tween?.kill();
    };
  }, [blur, delay, duration, end, scrub, start, y]);

  return (
    <div ref={wrapperRef} className={joinClasses('will-change-[filter,opacity,transform]', className)}>
      {children}
    </div>
  );
}
