"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AvailablePill, OnSitePill, RemotePill, UnavailablePill } from "./Pills";

export type ServicePillStatus = "available" | "unavailable" | "remote" | "on_site";

export type ServiceCard = {
  id?: string;
  title: string;
  description: string;
  iconSrc?: string;
  modalImageSrc?: string;
  details?: string;
  pillStatuses?: ServicePillStatus[];
};

function TiltedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentTiltRef = useRef({ rotateX: 0, rotateY: 0, scale: 1, depth: 0, glare: 0 });
  const targetTiltRef = useRef({ rotateX: 0, rotateY: 0, scale: 1, depth: 0, glare: 0 });

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  function animateTilt() {
    const frame = frameRef.current;
    const content = contentRef.current;
    const glare = glareRef.current;
    if (!frame || !content || !glare) {
      stopAnimation();
      return;
    }

    const current = currentTiltRef.current;
    const target = targetTiltRef.current;
    const ease = 0.14;

    current.rotateX += (target.rotateX - current.rotateX) * ease;
    current.rotateY += (target.rotateY - current.rotateY) * ease;
    current.scale += (target.scale - current.scale) * ease;
    current.depth += (target.depth - current.depth) * ease;
    current.glare += (target.glare - current.glare) * ease;

    frame.style.transform =
      `perspective(1600px) rotateX(${current.rotateX}deg) rotateY(${current.rotateY}deg) scale(${current.scale})`;
    content.style.transform = `translateZ(${current.depth}px)`;
    glare.style.opacity = `${current.glare}`;

    const settled =
      Math.abs(target.rotateX - current.rotateX) < 0.05 &&
      Math.abs(target.rotateY - current.rotateY) < 0.05 &&
      Math.abs(target.scale - current.scale) < 0.001 &&
      Math.abs(target.depth - current.depth) < 0.05 &&
      Math.abs(target.glare - current.glare) < 0.01;

    if (settled) {
      currentTiltRef.current = { ...target };
      frame.style.transform =
        `perspective(1600px) rotateX(${target.rotateX}deg) rotateY(${target.rotateY}deg) scale(${target.scale})`;
      content.style.transform = `translateZ(${target.depth}px)`;
      glare.style.opacity = `${target.glare}`;
      animationFrameRef.current = null;
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(animateTilt);
  }

  function startAnimation() {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame(animateTilt);
    }
  }

  function resetTilt() {
    targetTiltRef.current = { rotateX: 0, rotateY: 0, scale: 1, depth: 0, glare: 0 };
    startAnimation();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;

    const wrapper = wrapperRef.current;
    const glare = glareRef.current;
    if (!wrapper || !glare) return;

    const rect = wrapper.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    const rotateY = (x - 0.5) * 20;
    const rotateX = (0.5 - y) * 20;

    targetTiltRef.current = {
      rotateX,
      rotateY,
      scale: 1.10,
      depth: 12,
      glare: 0.9,
    };
    glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.34), transparent 100%)`;
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
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div
        ref={frameRef}
        className="h-full w-full transform-gpu will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={contentRef}
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0"
          />
        </div>
      </div>
    </div>
  );
}

export default function SCarousel({
  cards,
  twoRows = false,
}: {
  cards: ServiceCard[];
  twoRows?: boolean;
}) {
  const HIGHLIGHT_COUNT = 2;
  const HIGHLIGHT_INTERVAL_MS = 1000;
  const HIGHLIGHT_DURATION_MS = 1200;

  const stickyTopPx = 30;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerTopRef = useRef<HTMLDivElement | null>(null);
  const scrollerBottomRef = useRef<HTMLDivElement | null>(null);
  const modalAnimationFrameRef = useRef<number | null>(null);
  const modalCloseTimeoutRef = useRef<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scrollHeight, setScrollHeight] = useState(0);

  const [selectedCard, setSelectedCard] = useState<ServiceCard | null>(null);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [highlightedTitles, setHighlightedTitles] = useState<Set<string>>(() => new Set());
  const lastHighlightedRef = useRef<Set<string>>(new Set());

  const openModal = (card: ServiceCard) => {
    if (modalCloseTimeoutRef.current !== null) {
      window.clearTimeout(modalCloseTimeoutRef.current);
      modalCloseTimeoutRef.current = null;
    }
    if (modalAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(modalAnimationFrameRef.current);
    }

    setSelectedCard(card);
    setIsModalMounted(true);
    modalAnimationFrameRef.current = window.requestAnimationFrame(() => {
      setIsModalVisible(true);
      modalAnimationFrameRef.current = null;
    });
  };

  const closeModal = () => {
    setIsModalVisible(false);
    if (modalCloseTimeoutRef.current !== null) {
      window.clearTimeout(modalCloseTimeoutRef.current);
    }
    modalCloseTimeoutRef.current = window.setTimeout(() => {
      setIsModalMounted(false);
      setSelectedCard(null);
      modalCloseTimeoutRef.current = null;
    }, 280);

    const serviceId = searchParams?.get("service");
    if (serviceId) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("service");
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}#services` : `${pathname}#services`, { scroll: false });
    }
  };

  useEffect(() => {
    const serviceId = searchParams?.get("service");
    if (!serviceId) return;
    if (!cards.length) return;
    if (isModalMounted) return;

    const match = cards.find((c) => String(c.id ?? "") === serviceId);
    if (match) {
      openModal(match);
    }
  }, [cards, searchParams, isModalMounted]);

  useEffect(() => {
    if (!cards.length) return;

    const pickRandom = (count: number) => {
      const next = new Set<string>();
      const max = Math.min(count, cards.length);

      const prev = lastHighlightedRef.current;
      const pool = cards
        .map((c) => c.title)
        .filter((t) => (cards.length > max ? !prev.has(t) : true));

      while (next.size < max) {
        const list = pool.length >= max ? pool : cards.map((c) => c.title);
        const idx = Math.floor(Math.random() * list.length);
        next.add(list[idx]);
        if (cards.length > max) {
          const removeIdx = pool.indexOf(list[idx]);
          if (removeIdx >= 0) pool.splice(removeIdx, 1);
        }
      }

      if (max > 0 && prev.size > 0) {
        let same = next.size === prev.size;
        if (same) {
          for (const t of next) {
            if (!prev.has(t)) {
              same = false;
              break;
            }
          }
        }
        if (same && cards.length > 1) {
          const fallbackIdx = Math.floor(Math.random() * cards.length);
          next.clear();
          next.add(cards[fallbackIdx].title);
        }
      }

      lastHighlightedRef.current = next;
      return next;
    };

    let clearId: number | null = null;
    const intervalId = window.setInterval(() => {
      setHighlightedTitles(pickRandom(HIGHLIGHT_COUNT));

      if (clearId) window.clearTimeout(clearId);
      clearId = window.setTimeout(() => setHighlightedTitles(new Set()), HIGHLIGHT_DURATION_MS);
    }, HIGHLIGHT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      if (clearId) window.clearTimeout(clearId);
    };
  }, [cards]);

  useEffect(() => {
    const container = containerRef.current;
    const scrollerTop = scrollerTopRef.current;
    if (!container || !scrollerTop) return;

    const calculateHeights = () => {
      const maxTop = scrollerTop.scrollWidth - scrollerTop.clientWidth;
      const bottom = scrollerBottomRef.current;
      const maxBottom = bottom ? bottom.scrollWidth - bottom.clientWidth : 0;
      const maxScroll = Math.max(maxTop, maxBottom);
      setScrollHeight(maxScroll);
      return { maxTop, maxBottom, maxScroll };
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const { maxTop, maxBottom, maxScroll } = calculateHeights();

      if (rect.top <= stickyTopPx && rect.top >= stickyTopPx - maxScroll) {
        const horizontalScroll = Math.min(maxScroll, Math.max(0, stickyTopPx - rect.top));
        scrollerTop.scrollLeft = Math.min(maxTop, horizontalScroll);
        if (twoRows && scrollerBottomRef.current) {
          scrollerBottomRef.current.scrollLeft = Math.max(0, Math.min(maxBottom, maxBottom - horizontalScroll));
        }
      } else if (rect.top < stickyTopPx - maxScroll) {
        scrollerTop.scrollLeft = maxTop;
        if (twoRows && scrollerBottomRef.current) {
          scrollerBottomRef.current.scrollLeft = 0;
        }
      } else if (rect.top > stickyTopPx) {
        scrollerTop.scrollLeft = 0;
        if (twoRows && scrollerBottomRef.current) {
          scrollerBottomRef.current.scrollLeft = maxBottom;
        }
      }
    };

    const handleResize = () => {
      calculateHeights();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [twoRows]);

  useEffect(() => {
    if (!selectedCard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard]);

  useEffect(() => {
    if (!isModalMounted) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isModalMounted]);

  useEffect(() => {
    return () => {
      if (modalAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(modalAnimationFrameRef.current);
      }
      if (modalCloseTimeoutRef.current !== null) {
        window.clearTimeout(modalCloseTimeoutRef.current);
      }
    };
  }, []);

  const modal = isModalMounted && selectedCard ? (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-[background-color,opacity] duration-300 ease-out ${
        isModalVisible ? "bg-black/70 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedCard.title}
        className={`relative h-[300px] w-full max-w-5xl rounded-lg overflow-hidden bg-white shadow-[0_30px_90px_rgba(2,6,23,0.45)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[350px] ${
          isModalVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.97] opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={closeModal}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        <div className="grid h-full grid-cols-1 gap-10 md:grid-cols-[360px_1fr]">
          <div className="relative w-100 h-full bg-slate-100">
            <Image
              src={selectedCard.modalImageSrc ?? '/about-image.jpg'}
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="hide-scrollbar h-full overflow-y-auto p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  {selectedCard.iconSrc ? (
                    <Image
                      src={selectedCard.iconSrc}
                      alt=""
                      width={40}
                      height={40}
                      className="mt-1 h-20 w-20 shrink-0 object-contain"
                    />
                  ) : null}
                  <h3 className="ml-2 bg-gradient-to-l from-[#2767BC] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text text-[35px] font-bold leading-[1.05] tracking-[-0.5px]  w-100  ">
                    {selectedCard.title.toUpperCase()}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(selectedCard.pillStatuses?.length ? selectedCard.pillStatuses : ["available", "on_site"]).map(
                (s) => {
                  if (s === "available") return <AvailablePill key={s} variant="filled" />;
                  if (s === "unavailable") return <UnavailablePill key={s} variant="filled" />;
                  if (s === "remote") return <RemotePill key={s} variant="filled" />;
                  if (s === "on_site") return <OnSitePill key={s} variant="filled" />;
                  return null;
                }
              )}
            </div>

            <div className="mt-4 text-[13.5px] mr-10 leading-5 text-slate-600">
              {selectedCard.details ?? selectedCard.description}
            </div>

            <div className="mt-6">
              <Link
                href="/#contact"
                onClick={closeModal}
                className="group relative inline-flex items-center gap-3 rounded-full pr-5 text-[12px] font-bold"
              >
                <span className="relative inline-flex h-7 items-center justify-center">
                  <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#6D28D9] transition-all duration-500 ease-out group-hover:w-[135px]" />
                  
                  <span className="relative z-10 inline-flex h-7 w-7 items-center justify-center">
                    <span className="absolute left-[10px] right-[22px] top-1/2 z-0 h-[2px] -translate-y-1/2 origin-left scale-x-0 bg-white transition-transform duration-300 ease-in-out delay-150 group-hover:scale-x-100" />
                    <svg
                      viewBox="0 0 24 24"
                      className="relative z-10 h-4 w-4 text-white transition-transform duration-300 ease-out delay-140 group-hover:translate-x-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 5l8 7-8 7" />
                    </svg>
                   
                  </span>

                   <div className="absolute rounded-full h-[1.5px] w-3 bg-white translate-y-[0.8px] translate-x-[9.4px] scale-x-0 origin-left transition-transform duration-700 ease-in-out group-hover:scale-x-100" />
                  
                </span>

                <span className="relative z-10 text-[#142699] transition-colors duration-300 ease-out delay-300 group-hover:text-white">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={containerRef}
        className="relative"
        style={{
          height: `calc(${twoRows ? 100 : 60}vh + ${scrollHeight}px)`,
          minHeight: "10vh",
        }}
      >
        <div
          className={
            twoRows
              ? 'sticky top-0 h-screen flex flex-col -mb-20 justify-center gap-5 overflow-hidden'
              : 'sticky top-0 h-[60vh] flex items-center overflow-hidden'
          }
          style={{ top: stickyTopPx }}
        >
          <div
            ref={scrollerTopRef}
            className="hide-scrollbar flex gap-15 overflow-x-scroll py-2 px-6 md:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => openModal(card)}
                className="shrink-0 w-[85%] sm:w-[45%] md:w-[30%] flex flex-col items-center text-left"
              >
                <div className="relative w-full max-w-sm pb-18">
                  <TiltedCard className="mx-auto h-56 w-full max-w-[18rem]">
                    <div className=" relative h-full w-full overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,255,0.92)_100%)]">
                      <div className="pointer-events-none absolute inset-x-8 top-0 h-16 rounded-full bg-[radial-gradient(circle,rgba(72,115,255,0.18)_0%,transparent_70%)] blur-2xl" />
                      <div className="relative flex h-full items-center justify-center">
                        {card.iconSrc ? (
                          <Image
                              src={card.iconSrc}
                              alt=""
                              width={250}
                              height={250}
                              className={` h-35 w-35 object-contain transition-[filter,opacity,transform] duration-700 ${
                                highlightedTitles.has(card.title) ? "grayscale-0 opacity-100" : "grayscale opacity-70"
                            } hover:grayscale-0 hover:opacity-100`}
                            />
                        ) : null}
                      </div>
                    </div>
                  </TiltedCard>

                  <div className=" mb-5 pointer-events-none absolute inset-x-0 bottom-0 z-10 text-center">
                    <h3 className="text-[15px] font-semibold text-slate-800">
                      {card.title}
                    </h3>
                    <p className="mt-2 mx-auto text-[10px] leading-3 text-slate-500 px-10">
                      {card.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {twoRows ? (
            <div
              ref={scrollerBottomRef}
              className="hide-scrollbar flex gap-15 overflow-x-scroll py-2 px-6 md:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {cards.map((card) => (
                <button
                  key={`row2-${card.title}`}
                  type="button"
                  onClick={() => openModal(card)}
                  className="shrink-0 w-[85%] sm:w-[45%] md:w-[30%] flex flex-col items-center text-left"
                >
                  <div className="relative w-full max-w-sm pb-18">
                    <TiltedCard className="mx-auto h-56 w-full max-w-[18rem]">
                      <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,255,0.92)_100%)]">
                        <div className="pointer-events-none absolute inset-x-8 top-0 h-16 rounded-full bg-[radial-gradient(circle,rgba(72,115,255,0.18)_0%,transparent_70%)] blur-2xl" />
                        <div className="relative flex h-full items-center justify-center">
                          {card.iconSrc ? (
                            <Image
                                src={card.iconSrc}
                                alt=""
                                width={220}
                                height={220}
                                className={`h-35 w-35 object-contain transition-[filter,opacity,transform] duration-700 ${
                                  highlightedTitles.has(card.title) ? "grayscale-0 opacity-100" : "grayscale opacity-70"
                              } hover:grayscale-0 hover:opacity-100`}
                              />
                          ) : null}
                        </div>
                      </div>
                    </TiltedCard>

                    <div className="mb-5 pointer-events-none absolute inset-x-0 bottom-0 z-10 text-center">
                      <h3 className="text-[15px] font-semibold text-slate-800">
                        {card.title}
                      </h3>
                      <p className="mt-2 mx-auto text-[10px] leading-3 px-10 text-slate-500">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {modal && typeof document !== "undefined" ? createPortal(modal, document.body) : null}
    </>
  );
}
