"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TeamCard = {
  name: string;
  role: string;
  imageSrc: string;
};

function TeamTiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const currentRef = useRef({ rotateX: 0, rotateY: 0, scale: 1, glow: 0.45 });
  const targetRef = useRef({ rotateX: 0, rotateY: 0, scale: 1, glow: 0.45 });

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  function animate() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) {
      stopAnimation();
      return;
    }

    const current = currentRef.current;
    const target = targetRef.current;
    const ease = 0.12;

    current.rotateX += (target.rotateX - current.rotateX) * ease;
    current.rotateY += (target.rotateY - current.rotateY) * ease;
    current.scale += (target.scale - current.scale) * ease;
    current.glow += (target.glow - current.glow) * ease;

    card.style.transform = `rotateX(${current.rotateX}deg) rotateY(${current.rotateY}deg) scale(${current.scale})`;
    glow.style.opacity = `${current.glow}`;

    const settled =
      Math.abs(target.rotateX - current.rotateX) < 0.05 &&
      Math.abs(target.rotateY - current.rotateY) < 0.05 &&
      Math.abs(target.scale - current.scale) < 0.01 &&
      Math.abs(target.glow - current.glow) < 0.1;

    if (settled) {
      currentRef.current = { ...target };
      card.style.transform = `rotateX(${target.rotateX}deg) rotateY(${target.rotateY}deg) scale(${target.scale})`;
      glow.style.opacity = `${target.glow}`;
      frameRef.current = null;
      return;
    }

    frameRef.current = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(animate);
    }
  }

  function resetTilt() {
    targetRef.current = { rotateX: 0, rotateY: 0, scale: 1, glow: 0.45 };
    startAnimation();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;

    const wrapper = wrapperRef.current;
    const glow = glowRef.current;
    if (!wrapper || !glow) return;

    const rect = wrapper.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);

    targetRef.current = {
      rotateX: (0.5 - y) * 20,
      rotateY: (x - 0.5) * 20,
      scale: 1.03,
      glow: 10,
    };

    glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(72,115,255,0.34), rgba(154,66,230,0.22) 42%, transparent 72%)`;
    startAnimation();
  }

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ perspective: "1100px" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] blur-3xl opacity-45"
      />
      <div
        ref={cardRef}
        className="relative transform-gpu will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}

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
      <style>{`
        @keyframes team-sparkle-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
                  className="block w-full select-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                >
                  <div className="relative mx-auto w-[280px] select-none px-5 pb-5 pt-6">
                    <TeamTiltCard className="relative mx-auto aspect-square w-[220px]">
                      <div className="pointer-events-none absolute inset-x-4 top-4 h-16 rounded-full bg-[radial-gradient(circle,rgba(72,115,255,0.18)_0%,rgba(154,66,230,0.12)_42%,transparent_74%)] blur-2xl" />
                      <div className="relative aspect-square w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-black/5">
                        <Image
                          src={card.imageSrc}
                          alt={card.name}
                          fill
                          sizes="300px"
                          className="object-cover"
                          priority={i === activeIndex}
                          draggable={false}
                        />
                      </div>
                    </TeamTiltCard>
                    <div className="px-3 pt-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 120 120"
                          className="h-6 w-6 shrink-0"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M59.8719 12.9442C60.5748 10.1637 64.5281 10.1637 65.231 12.9442L72.0091 39.7784C72.431 41.447 74.2584 42.3271 75.8244 41.6171L100.771 30.3063C103.357 29.1332 105.795 32.1872 104.076 34.4487L87.4942 56.2507C86.462 57.6081 86.9099 59.5547 88.4266 60.3287L112.796 72.7708C115.323 74.0607 114.454 77.8706 111.616 77.936L84.2574 78.5688C82.5552 78.6081 81.3013 80.1766 81.6419 81.847L87.1149 108.671C87.6822 111.451 84.1625 113.151 82.3428 110.974L64.7828 89.9689C63.6904 88.662 61.4125 88.662 60.3201 89.9689L42.76 110.974C40.9403 113.151 37.4207 111.451 37.988 108.671L43.461 81.847C43.8015 80.1766 42.5477 78.6081 40.8455 78.5688L13.4869 77.936C10.6488 77.8706 9.78003 74.0607 12.3068 72.7708L36.6762 60.3287C38.1929 59.5547 38.6408 57.6081 37.6086 56.2507L21.0267 34.4487C19.3079 32.1872 21.746 29.1332 24.3314 30.3063L49.2785 41.6171C50.8445 42.3271 52.6719 41.447 53.0938 39.7784L59.8719 12.9442Z"
                            fill="#bdfc2c"
                            style={{
                              animation: "team-sparkle-spin 10s linear infinite",
                              transformBox: "fill-box",
                              transformOrigin: "center",
                            }}
                          />
                        </svg>
                        <span>{card.name}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-500">
                        <span>{card.role}</span>
                      </div>
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
