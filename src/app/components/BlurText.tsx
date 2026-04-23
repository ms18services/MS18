'use client';

import { type Ref, useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type BlurTextProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
  text: string;
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function isTransparent(color: string) {
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === 'rgba(0,0,0,0)';
}

function resolveVisualStyles(element: HTMLElement) {
  let current: HTMLElement | null = element;
  let backgroundImage = '';
  let backgroundSize = '';
  let backgroundPosition = '';
  let backgroundRepeat = '';
  let color = '';

  while (current) {
    const computed = window.getComputedStyle(current);

    if (!backgroundImage && computed.backgroundImage && computed.backgroundImage !== 'none') {
      backgroundImage = computed.backgroundImage;
      backgroundSize = computed.backgroundSize;
      backgroundPosition = computed.backgroundPosition;
      backgroundRepeat = computed.backgroundRepeat;
    }

    if (!color && computed.color && !isTransparent(computed.color)) {
      color = computed.color;
    }

    if (backgroundImage && color) break;
    current = current.parentElement;
  }

  return { backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat, color };
}

export default function BlurText({
  as: Component = 'div',
  text,
  className,
  wrapperClassName,
  delay = 0,
  duration = 0.85,
  stagger = 0.08,
}: BlurTextProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const element = textRef.current;
    if (!wrapper || !element) return;

    let observer: IntersectionObserver | null = null;
    let tween: gsap.core.Tween | null = null;
    let rafId = 0;

    const ctx = gsap.context(() => {
      rafId = window.requestAnimationFrame(() => {
        const bits = Array.from(element.querySelectorAll<HTMLElement>('[data-blur-bit]'));
        if (!bits.length) return;

        const styles = resolveVisualStyles(element);
        const elementRect = element.getBoundingClientRect();

        for (const bit of bits) {
          bit.style.willChange = 'transform, opacity, filter';
          bit.style.backgroundColor = 'transparent';

          if (styles.backgroundImage) {
            const bitRect = bit.getBoundingClientRect();
            const backgroundOffsetX = -(bitRect.left - elementRect.left);

            bit.style.backgroundImage = styles.backgroundImage;
            bit.style.backgroundSize = `${Math.max(elementRect.width, 1)}px 100%`;
            bit.style.backgroundPosition = `${backgroundOffsetX}px 0px`;
            bit.style.backgroundRepeat = styles.backgroundRepeat || 'no-repeat';
            bit.style.backgroundClip = 'text';
            (bit.style as CSSStyleDeclaration & { WebkitBackgroundClip?: string }).WebkitBackgroundClip = 'text';
            bit.style.color = 'transparent';
            (bit.style as CSSStyleDeclaration & { WebkitTextFillColor?: string }).WebkitTextFillColor = 'transparent';
          } else if (styles.color) {
            bit.style.color = styles.color;
          }
        }

        gsap.set(bits, {
          y: 18,
          opacity: 0,
          filter: 'blur(14px)',
        });

        tween = gsap.to(bits, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration,
          delay,
          stagger,
          paused: true,
        });

        const playIfVisible = () => {
          const rect = wrapper.getBoundingClientRect();
          const viewportHeight = window.innerHeight || 1;
          if (rect.top <= viewportHeight * 0.9 && rect.bottom >= 0) {
            tween?.play(0);
            return true;
          }
          return false;
        };

        if (playIfVisible()) {
          return;
        }

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
            threshold: 0.08,
            rootMargin: '0px 0px -10% 0px',
          }
        );

        observer.observe(wrapper);
      });
    }, wrapper);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      tween?.kill();
      ctx.revert();
    };
  }, [delay, duration, stagger, text]);

  const bits = text.split(/(\s+)/).map((part, index) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) {
      return (
        <span key={`space-${index}`} aria-hidden="true" style={{ whiteSpace: 'pre' }}>
          {part}
        </span>
      );
    }

    return (
      <span key={`${part}-${index}`} data-blur-bit aria-hidden="true" className="inline-block bg-transparent">
        {part}
      </span>
    );
  });

  const content = (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block bg-transparent">
        {bits}
      </span>
    </>
  );

  return (
    <div ref={wrapperRef} className={joinClasses('inline-block bg-transparent', wrapperClassName)}>
      {Component === 'h1' ? <h1 ref={textRef as Ref<HTMLHeadingElement>} className={joinClasses('bg-transparent', className)}>{content}</h1> : null}
      {Component === 'h2' ? <h2 ref={textRef as Ref<HTMLHeadingElement>} className={joinClasses('bg-transparent', className)}>{content}</h2> : null}
      {Component === 'h3' ? <h3 ref={textRef as Ref<HTMLHeadingElement>} className={joinClasses('bg-transparent', className)}>{content}</h3> : null}
      {Component === 'p' ? <p ref={textRef as Ref<HTMLParagraphElement>} className={joinClasses('bg-transparent', className)}>{content}</p> : null}
      {Component === 'span' ? <span ref={textRef as Ref<HTMLSpanElement>} className={joinClasses('inline-block bg-transparent', className)}>{content}</span> : null}
      {Component === 'div' ? <div ref={textRef as Ref<HTMLDivElement>} className={joinClasses('bg-transparent', className)}>{content}</div> : null}
    </div>
  );
}
