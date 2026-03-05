"use client";

import { useRef } from "react";

export type ServiceCard = {
  title: string;
  description: string;
};

export default function SCarousel({ cards }: { cards: ServiceCard[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByOne = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    // scroll by one card width (approx)
    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const amount = firstCard ? firstCard.offsetWidth + 24 : Math.floor(el.clientWidth * 0.9);

    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* arrows (like the picture) */}
      <button
        type="button"
        onClick={() => scrollByOne("left")}
        aria-label="Scroll left"
        className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-black border border-slate-200 shadow-sm hover:bg-white"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => scrollByOne("right")}
        aria-label="Scroll right"
        className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-black border border-slate-200 shadow-sm hover:bg-white"
      >
        ›
      </button>

      {/* track */}
      <div
        ref={scrollerRef}
        className="
          flex gap-8
          overflow-x-auto overflow-y-visible
          snap-x snap-mandatory scroll-smooth no-scrollbar
          py-4
          px-6
          scroll-px-6
          md:px-0 md:scroll-px-0
          bg-red-500
          Z
        "
      >
        {cards.map((card) => (
          <div
            key={card.title}
            data-card
            className="
             snap-start shrink-0
              w-[95%] sm:w-[100%] md:w-[320px]
              flex flex-col items-center
            "
          >
            {/* card */}
            <div className="">
              {/* purple square */}
              <div className="rounded-xl h-40 w-[100%] bg-purple-900 mx-auto" />

              {/* text centered */} 
              <div className="pt-3 text-center">
                <h3 className="text-[12px] font-semibold text-slate-700">
                  {card.title}
                </h3>
                <p className="mt-2 mx-auto rounded-10 text-[10px] leading-4 text-slate-500">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* tiny end pad */}
        <div className="shrink-0 w-2" />
      </div>
    </div>
  );
}