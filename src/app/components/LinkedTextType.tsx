'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

type TextSegment = {
  text: string;
  className?: string;
};

type TextBlock = {
  as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3';
  className?: string;
  segments: TextSegment[];
};

type LinkedTextTypeProps = {
  blocks: TextBlock[];
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

function getBlockLength(block: TextBlock) {
  return block.segments.reduce((sum, segment) => sum + segment.text.length, 0);
}

export default function LinkedTextType({
  blocks,
  cursorCharacter = '|',
  typingSpeed = 14,
  startDelay = 0,
  once = true,
  resetOnExit = false,
  outroSpeed = 10,
}: LinkedTextTypeProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);
  const isInViewRef = useRef(false);
  const [visibleChars, setVisibleChars] = useState(0);

  const blockLengths = useMemo(() => blocks.map(getBlockLength), [blocks]);
  const blockOffsets = useMemo(
    () =>
      blockLengths.map((_, index) =>
        blockLengths.slice(0, index).reduce((sum, length) => sum + length, 0)
      ),
    [blockLengths]
  );
  const totalLength = useMemo(
    () => blockLengths.reduce((sum, length) => sum + length, 0),
    [blockLengths]
  );

  useEffect(() => {
    const root = rootRef.current;
    const element = root?.parentElement ?? root;
    if (!element) return;

    let timeoutId: number | null = null;
    let intervalId: number | null = null;
    let outroIntervalId: number | null = null;

    const clearTypingTimers = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const clearOutroTimer = () => {
      if (outroIntervalId !== null) {
        window.clearInterval(outroIntervalId);
        outroIntervalId = null;
      }
    };

    const startTyping = () => {
      if (once && hasStartedRef.current && outroIntervalId === null) return;

      clearOutroTimer();
      clearTypingTimers();

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
          isInViewRef.current = true;
          startTyping();
          return;
        }

        isInViewRef.current = false;

        if (resetOnExit) {
          clearTypingTimers();
          clearOutroTimer();

          outroIntervalId = window.setInterval(() => {
            setVisibleChars((current) => {
              if (current <= 0) {
                clearOutroTimer();
                hasStartedRef.current = false;

                if (isInViewRef.current) {
                  window.requestAnimationFrame(() => {
                    startTyping();
                  });
                }

                return 0;
              }

              return current - 1;
            });
          }, outroSpeed);
          return;
        }

        if (!once && entry.boundingClientRect.top > 0) {
          clearTypingTimers();
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
      clearTypingTimers();
      clearOutroTimer();
    };
  }, [once, outroSpeed, resetOnExit, startDelay, totalLength, typingSpeed]);

  return (
    <div ref={rootRef} className="contents">
      {blocks.map((block, blockIndex) => {
        const Component = block.as ?? 'div';
        const blockOffset = blockOffsets[blockIndex] ?? 0;
        const blockVisibleChars = Math.max(0, Math.min(blockLengths[blockIndex] ?? 0, visibleChars - blockOffset));
        const shouldShowCursor = visibleChars < totalLength && visibleChars >= blockOffset;

        let consumedByPreviousSegments = 0;

        return (
          <Component key={`linked-text-block-${blockIndex}`} className={joinClasses(block.className, 'whitespace-pre-wrap')}>
            {block.segments.map((segment, segmentIndex) => {
              const count = Math.max(
                0,
                Math.min(segment.text.length, blockVisibleChars - consumedByPreviousSegments)
              );
              consumedByPreviousSegments += segment.text.length;

              if (count <= 0) return null;

              return (
                <span key={`${blockIndex}-${segmentIndex}-${segment.text}`} className={segment.className}>
                  {segment.text.slice(0, count)}
                </span>
              );
            })}
            <Fragment>
              <span
                aria-hidden="true"
                className={joinClasses(
                  'inline-block align-baseline text-current',
                  shouldShowCursor ? 'text-type-cursor' : 'opacity-0'
                )}
              >
                {cursorCharacter}
              </span>
            </Fragment>
          </Component>
        );
      })}
    </div>
  );
}
