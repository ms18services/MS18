"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TeamCard = {
  name: string;
  role: string;
  imageSrc: string;
};

export default function TeamCarousel3D({
  cards,
  initialIndex = 0,
  className,
}: {
  cards: TeamCard[];
  initialIndex?: number;
  className?: string;
}) {
  const safeInitialIndex = useMemo(() => {
    if (cards.length === 0) return 0;
    const normalized = ((initialIndex % cards.length) + cards.length) % cards.length;
    return normalized;
  }, [cards.length, initialIndex]);

  const [activeIndex, setActiveIndex] = useState(safeInitialIndex);

  useEffect(() => {
    setActiveIndex(safeInitialIndex);
  }, [safeInitialIndex]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (cards.length === 0) return;
      setActiveIndex((prev) => (prev + dir + cards.length) % cards.length);
    },
    [cards.length]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  if (cards.length === 0) return null;

  const visibleRange = 2;
  const cardWidth = 320;
  const ringRadius = 600;
  const angleStep = 28;

  return (
    <div className={className}>
      <div
        className="relative mx-auto h-[420px] w-full max-w-[1100px]"
        style={{ perspective: "1200px" }}
      >
        {/* <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-slate-200  px-3 py-2 text-slate-900 shadow-sm backdrop-blur hover:bg-white"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-full  px-3 py-2 text-slate-900 shadow-sm backdrop-blur hover:bg-white"
        >
          ›
        </button> */}

        <div className="absolute left-1/2 top-1/2 h-[420px] w-full -translate-x-1/2 -translate-y-1/2">
          {cards.map((card, i) => {
            let offset = i - activeIndex;

            if (offset > cards.length / 2) offset -= cards.length;
            if (offset < -cards.length / 2) offset += cards.length;

            if (Math.abs(offset) > visibleRange) return null;

            const abs = Math.abs(offset);
            const rotateY = offset * angleStep;
            const translateZ = ringRadius;
            const popZ = offset === 0 ? 120 : abs === 1 ? 40 : 0;
            const scale = offset === 0 ? 1.25 : abs === 1 ? 0.95 : 0.78;
            const opacity = offset === 0 ? 1 : abs === 1 ? 0.7 : 0.45;
            const zIndex = 100 - abs;

            return (
              <div
                key={`${card.name}-${card.role}-${i}`}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: cardWidth,
                  transform: `translate(-50%, -50%) rotateY(${rotateY}deg) translateZ(${translateZ}px) translateZ(${popZ}px) rotateY(${-rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Select ${card.name}`}
                  className="block w-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                >
                  <div className="relative mx-auto aspect-square w-[240px] overflow-hidden rounded-full bg-slate-100">
                    <Image
                      src={card.imageSrc}
                      alt={card.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                      priority={i === activeIndex}
                    />
                  </div>
                  <div className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="text-slate-900"
                      >
                        <path
                          d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 3v4a2 2 0 0 0 2 2h4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{card.name}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-500">
                      <span>{card.role}</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-1  flex items-center justify-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to ${i + 1}`}
            className={
              "h-2 w-2 rounded-full transition " +
              (i === activeIndex ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400")
            }
          />
        ))}
      </div>
    </div>
  );
}
