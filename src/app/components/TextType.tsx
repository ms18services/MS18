'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type TextSegment = {
  text: string;
  className?: string;
};

type TextTypeProps = {
  as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3';
  className?: string;
  segments: TextSegment[];
  cursorCharacter?: string;
  typingSpeed?: number;
  startDelay?: number;
  once?: boolean;
  resetOnExit?: boolean;
  outroSpeed?: number;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function TextType({
  as: Component = 'div',
  className,
  segments,
  cursorCharacter = '|',
  typingSpeed = 14,
  startDelay = 0,
  once = true,
  resetOnExit = false,
  outroSpeed = 10,
}: TextTypeProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const hasStartedRef = useRef(false);
  const [visibleChars, setVisibleChars] = useState(0);

  const totalLength = useMemo(
    () => segments.reduce((sum, segment) => sum + segment.text.length, 0),
    [segments]
  );

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    let timeoutId: number | null = null;
    let intervalId: number | null = null;
    let outroIntervalId: number | null = null;

    const startTyping = () => {
      if (once && hasStartedRef.current) return;
      if (outroIntervalId !== null) {
        window.clearInterval(outroIntervalId);
        outroIntervalId = null;
      }
      hasStartedRef.current = true;
      setVisibleChars(0);

      timeoutId = window.setTimeout(() => {
        intervalId = window.setInterval(() => {
          setVisibleChars((current) => {
            if (current >= totalLength) {
              if (intervalId !== null) {
                window.clearInterval(intervalId);
              }
              return totalLength;
            }

            return current + 1;
          });
        }, typingSpeed);
      }, startDelay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          startTyping();
          return;
        }

        if (resetOnExit) {
          if (timeoutId !== null) window.clearTimeout(timeoutId);
          if (intervalId !== null) window.clearInterval(intervalId);

          outroIntervalId = window.setInterval(() => {
            setVisibleChars((current) => {
              if (current <= 0) {
                if (outroIntervalId !== null) {
                  window.clearInterval(outroIntervalId);
                  outroIntervalId = null;
                }
                hasStartedRef.current = false;
                return 0;
              }

              return current - 1;
            });
          }, outroSpeed);
          return;
        }

        if (!once && entry.boundingClientRect.top > 0) {
          if (timeoutId !== null) window.clearTimeout(timeoutId);
          if (intervalId !== null) window.clearInterval(intervalId);
          setVisibleChars(0);
          hasStartedRef.current = false;
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (intervalId !== null) window.clearInterval(intervalId);
      if (outroIntervalId !== null) window.clearInterval(outroIntervalId);
    };
  }, [once, outroSpeed, resetOnExit, startDelay, totalLength, typingSpeed]);

  const typedSegments = segments.reduce<React.ReactNode[]>(
    (acc, segment, index) => {
      const alreadyVisible = segments
        .slice(0, index)
        .reduce((sum, current) => sum + current.text.length, 0);
      const count = Math.max(0, Math.min(segment.text.length, visibleChars - alreadyVisible));

      if (count <= 0) return acc;

      acc.push(
        <span key={`${segment.text}-${index}`} className={segment.className}>
          {segment.text.slice(0, count)}
        </span>
      );

      return acc;
    },
    []
  );

  const cursorVisible = visibleChars < totalLength;

  return (
    <Component
      ref={rootRef as React.Ref<HTMLElement>}
      className={joinClasses(className, 'whitespace-pre-wrap')}
    >
      {typedSegments}
      <span
        aria-hidden="true"
        className={joinClasses(
          'inline-block align-baseline text-current',
          cursorVisible ? 'text-type-cursor' : 'opacity-0'
        )}
      >
        {cursorCharacter}
      </span>
    </Component>
  );
}
