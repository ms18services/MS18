"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SCarousel, { type ServiceCard } from "./ServicesCarousel"; // same folder
import DirectionalMarquee from "./DirectionalMarquee";
import fallbackServices from "@/data/services.json";

export default function Services() {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const marqueeWrapRef = useRef<HTMLDivElement | null>(null);
  const [marqueeVisible, setMarqueeVisible] = useState(false);

  const fallbackCards: ServiceCard[] = (Array.isArray(fallbackServices) ? fallbackServices : []).map(
    (r: any) => ({
      title: String(r?.title ?? ""),
      description: String(r?.description ?? ""),
      details: typeof r?.details === "string" ? r.details : undefined,
      iconSrc: typeof r?.icon_src === "string" ? r.icon_src : undefined,
      modalImageSrc: typeof r?.modal_image_src === "string" ? r.modal_image_src : undefined,
      pillStatuses: (r?.pill_statuses ?? []) as any,
    })
  );

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/services", { method: "GET", cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          setServiceCards(fallbackCards);
          return;
        }

        const services = Array.isArray(json?.services) ? (json.services as any[]) : [];
        const mapped: ServiceCard[] = services
          .slice()
          .sort((a, b) => (Number(a?.sort_order ?? 0) || 0) - (Number(b?.sort_order ?? 0) || 0))
          .map((r) => ({
            title: String(r?.title ?? ""),
            description: String(r?.description ?? ""),
            details: typeof r?.details === "string" ? r.details : undefined,
            iconSrc: typeof r?.icon_src === "string" ? r.icon_src : undefined,
            modalImageSrc: typeof r?.modal_image_src === "string" ? r.modal_image_src : undefined,
            pillStatuses: (r?.pill_statuses ?? []) as any,
          }))
          .filter((c) => Boolean(c.title) && Boolean(c.description));

        setServiceCards(mapped.length ? mapped : fallbackCards);
      } catch {
        setServiceCards(fallbackCards);
      }
    };

    run();
  }, []);

  useEffect(() => {
    const el = marqueeWrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setMarqueeVisible(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="services"
      className=" border-t border-slate-100 bg-slate-50/50 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-6 py-14">


        {/* marquee */}
        <div
          ref={marqueeWrapRef}
          className={`w-full flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between transition-opacity duration-1000 ${
            marqueeVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-visible">
            <DirectionalMarquee speedPxPerSecond={110}>
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Image
                    key={`g1-${i}`}
                    src="/supplies&services.svg"
                    alt="Services"
                    width={700}
                    height={700}
                    className="mx-8 shrink-0"
                    priority={i === 0}
                  />
                ))}
              </div>
            </DirectionalMarquee>
          </div>
        </div>

        <div className="-mt-8">
          <div className="mx-auto max-w-6xl px-6">
            <SCarousel cards={serviceCards} twoRows />
          </div>
        </div>
      </div>
    </section>
  );
}