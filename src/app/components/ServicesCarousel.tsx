"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AvailablePill, OnSitePill, RemotePill, UnavailablePill } from "./Pills";

export type ServicePillStatus = "available" | "unavailable" | "remote" | "on_site";

export type ServiceCard = {
  title: string;
  description: string;
  iconSrc?: string;
  modalImageSrc?: string;
  details?: string;
  pillStatuses?: ServicePillStatus[];
};

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
  const [scrollHeight, setScrollHeight] = useState(0);

  const [selectedCard, setSelectedCard] = useState<ServiceCard | null>(null);
  const [highlightedTitles, setHighlightedTitles] = useState<Set<string>>(() => new Set());
  const lastHighlightedRef = useRef<Set<string>>(new Set());

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
      if (e.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard]);

  useEffect(() => {
    if (!selectedCard) {
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
  }, [selectedCard]);

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
                onClick={() => setSelectedCard(card)}
                className="shrink-0 w-[85%] sm:w-[45%] md:w-[30%] flex flex-col items-center text-left"
              >
                <div className="w-full max-w-sm">
                  <div className="rounded-xl h-56 w-full  mx-auto flex items-center justify-center">
                    {card.iconSrc ? (
                      <Image
                        src={card.iconSrc}
                        alt=""
                        width={250}
                        height={250}
                        className={`h-35 w-35 object-contain transition-[filter,opacity] duration-700 ${
                          highlightedTitles.has(card.title) ? 'grayscale-0 opacity-100' : 'grayscale opacity-70'
                        } hover:grayscale-0 hover:opacity-100`}
                      />
                    ) : null}
                  </div>

                  <div className="-pt-2 text-center -mt-5">
                    <h3 className="text-[15px] font-semibold text-slate-700">
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
                  onClick={() => setSelectedCard(card)}
                  className="shrink-0 w-[85%] sm:w-[45%] md:w-[30%] flex flex-col items-center text-left"
                >
                  <div className="w-full max-w-sm">
                    <div className="rounded-xl h-56 w-full mx-auto flex items-center justify-center">
                      {card.iconSrc ? (
                        <Image
                          src={card.iconSrc}
                          alt=""
                          width={220}
                          height={220}
                          className={`h-35 w-35 object-contain transition-[filter,opacity] duration-700 ${
                            highlightedTitles.has(card.title) ? 'grayscale-0 opacity-100' : 'grayscale opacity-70'
                          } hover:grayscale-0 hover:opacity-100`}
                        />
                      ) : null}
                    </div>

                    <div className="-pt-4 text-center -mt-5">
                      <h3 className="text-[15px] font-semibold text-slate-700">
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

      {selectedCard ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={() => setSelectedCard(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedCard.title}
        >
          <div
            className="relative h-[300px] w-full max-w-5xl overflow-hidden  bg-white shadow-[0_30px_90px_rgba(2,6,23,0.45)] md:h-[350px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedCard(null)}
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
                    onClick={() => setSelectedCard(null)}
                    className="group relative inline-flex items-center gap-3 rounded-full pr-5 text-[12px] font-bold"
                  >
                    <span className="relative inline-flex h-7 items-center justify-center">
                      <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#6D28D9] transition-all duration-500 ease-out group-hover:w-[135px]" />
                      <span className="relative z-10 inline-flex h-7 w-7 items-center justify-center">
                        <span className="absolute left-[10px] right-[22px] top-1/2 z-0 h-[2px] -translate-y-1/2 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out delay-150 group-hover:scale-x-100" />
                        <svg
                          viewBox="0 0 24 24"
                          className="relative z-10 h-4 w-4 text-white transition-transform duration-300 ease-out delay-100 group-hover:translate-x-2.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8 5l8 7-8 7" />
                        </svg>
                      </span>
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
      ) : null}
    </>
  );
}