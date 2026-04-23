'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SplitText } from 'gsap/SplitText';

type ScrollFloatProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
  text: string;
  className?: string;
  wrapperClassName?: string;
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

export default function ScrollFloat({
  as: Component = 'div',
  text,
  className,
  wrapperClassName,
}: ScrollFloatProps) {
  const textRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;

    const rafId = window.requestAnimationFrame(() => {
      split = new SplitText(element, { type: 'chars', charsClass: 'scroll-float-char' });

      const chars = split.chars as HTMLElement[];
      const styles = resolveVisualStyles(element);
      const triggerElement = element.closest('section') ?? element;

      for (const char of chars) {
        char.style.display = 'inline-block';
        char.style.willChange = 'transform';

        if (styles.backgroundImage) {
          char.style.backgroundImage = styles.backgroundImage;
          char.style.backgroundSize = styles.backgroundSize;
          char.style.backgroundPosition = styles.backgroundPosition;
          char.style.backgroundRepeat = styles.backgroundRepeat;
          char.style.backgroundClip = 'text';
          (char.style as CSSStyleDeclaration & { WebkitBackgroundClip?: string }).WebkitBackgroundClip = 'text';
          char.style.color = 'transparent';
          (char.style as CSSStyleDeclaration & { WebkitTextFillColor?: string }).WebkitTextFillColor = 'transparent';
        } else if (styles.color) {
          char.style.color = styles.color;
        }
      }

      tween = gsap.fromTo(
        chars,
        {
          yPercent: (index: number) => (index % 2 === 0 ? -1 : 1) * (22 + (index % 4) * 6),
          xPercent: (index: number) => ((index % 3) - 1) * 7,
          rotate: (index: number) => (index % 2 === 0 ? -1 : 1) * (3 + (index % 3)),
        },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          ease: 'none',
          stagger: {
            each: 0.03,
            from: 'center',
          },
          scrollTrigger: {
            trigger: triggerElement,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (tween?.scrollTrigger) tween.scrollTrigger.kill();
      if (tween) tween.kill();
      if (split) split.revert();
    };
  }, [text]);

  return (
    <div className={joinClasses('w-max overflow-visible', wrapperClassName)}>
      {Component === 'h1' ? <h1 ref={textRef as React.RefObject<HTMLHeadingElement | null>} className={joinClasses('block w-max', className)}>{text}</h1> : null}
      {Component === 'h2' ? <h2 ref={textRef as React.RefObject<HTMLHeadingElement | null>} className={joinClasses('block w-max', className)}>{text}</h2> : null}
      {Component === 'h3' ? <h3 ref={textRef as React.RefObject<HTMLHeadingElement | null>} className={joinClasses('block w-max', className)}>{text}</h3> : null}
      {Component === 'p' ? <p ref={textRef as React.RefObject<HTMLParagraphElement | null>} className={joinClasses('block w-max', className)}>{text}</p> : null}
      {Component === 'span' ? <span ref={textRef as React.RefObject<HTMLSpanElement | null>} className={joinClasses('inline-block w-max', className)}>{text}</span> : null}
      {Component === 'div' ? <div ref={textRef as React.RefObject<HTMLDivElement | null>} className={joinClasses('block w-max', className)}>{text}</div> : null}
    </div>
  );
}
