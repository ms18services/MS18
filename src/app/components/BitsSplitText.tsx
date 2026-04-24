'use client';

import { type Ref, useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type BitsSplitTextProps = {
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

export default function BitsSplitText({
  as: Component = 'div',
  text,
  className,
  wrapperClassName,
}: BitsSplitTextProps) {
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
        const chars = Array.from(element.querySelectorAll<HTMLElement>('[data-char]'));
        if (!chars.length) return;

        const styles = resolveVisualStyles(element);

        for (const char of chars) {
          char.style.willChange = 'transform, opacity, filter';
          char.style.backgroundColor = 'transparent';

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

        gsap.set(chars, {
          yPercent: 110,
          opacity: 0,
          rotateX: -90,
          transformOrigin: '50% 100%',
          filter: 'blur(8px)',
        });

        tween = gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          ease: 'power3.out',
          duration: 0.9,
          stagger: 0.035,
          paused: true,
        });

        const playIfVisible = () => {
          const rect = wrapper.getBoundingClientRect();
          const viewportHeight = window.innerHeight || 1;
          if (rect.top <= viewportHeight * 0.88 && rect.bottom >= 0) {
            tween?.play(0);
            return true;
          }
          return false;
        };

        playIfVisible();

        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry || !tween) return;

            if (entry.isIntersecting) {
              tween.play();
              return;
            }

            if (entry.boundingClientRect.top > 0) {
              tween.reverse();
            }
          },
          {
            threshold: 0.05,
            rootMargin: '0px 0px -12% 0px',
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
  }, [text]);

  const renderedChars = text.split('').map((char, index) => (
    <span
      key={`${char}-${index}`}
      data-char
      aria-hidden="true"
      className="inline-block bg-transparent"
      style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  const srOnlyText = <span className="sr-only">{text}</span>;

  const content = (
    <>
      {srOnlyText}
      <span aria-hidden="true" className="inline-flex overflow-hidden whitespace-nowrap bg-transparent align-top">
        {renderedChars}
      </span>
    </>
  );

  return (
    <div ref={wrapperRef} className={joinClasses('inline-block w-max overflow-visible bg-transparent', wrapperClassName)} style={{ perspective: '800px' }}>
      {Component === 'h1' ? <h1 ref={textRef as Ref<HTMLHeadingElement>} className={joinClasses('block w-max whitespace-nowrap overflow-visible bg-transparent', className)}>{content}</h1> : null}
      {Component === 'h2' ? <h2 ref={textRef as Ref<HTMLHeadingElement>} className={joinClasses('block w-max whitespace-nowrap overflow-visible bg-transparent', className)}>{content}</h2> : null}
      {Component === 'h3' ? <h3 ref={textRef as Ref<HTMLHeadingElement>} className={joinClasses('block w-max whitespace-nowrap overflow-visible bg-transparent', className)}>{content}</h3> : null}
      {Component === 'p' ? <p ref={textRef as Ref<HTMLParagraphElement>} className={joinClasses('block w-max whitespace-nowrap overflow-visible bg-transparent', className)}>{content}</p> : null}
      {Component === 'span' ? <span ref={textRef as Ref<HTMLSpanElement>} className={joinClasses('inline-block w-max whitespace-nowrap overflow-visible bg-transparent', className)}>{content}</span> : null}
      {Component === 'div' ? <div ref={textRef as Ref<HTMLDivElement>} className={joinClasses('block w-max whitespace-nowrap overflow-visible bg-transparent', className)}>{content}</div> : null}
    </div>
  );
}
