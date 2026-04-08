"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createSupabaseAnonClient } from "@/lib/supabase";
import SCarousel, { type ServiceCard } from "./ServicesCarousel"; // same folder
import DirectionalMarquee from "./DirectionalMarquee";

export default function Services() {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const marqueeWrapRef = useRef<HTMLDivElement | null>(null);
  const [marqueeVisible, setMarqueeVisible] = useState(false);

  const fallbackCards: ServiceCard[] = [
    {
      title: "Computer Repair",
      description: "Diagnostics and repair for desktops and laptops.",
      details: "Diagnostics and repair for desktops and laptops.",
      pillStatuses: ["available", "on_site"],
    },
    {
      title: "IT Support",
      description: "On-site and remote support for common IT issues.",
      details: "On-site and remote support for common IT issues.",
      pillStatuses: ["available", "remote"],
    },
    {
      title: "Network Setup",
      description: "Router, Wi‑Fi, and small office network setup.",
      details: "Router, Wi‑Fi, and small office network setup.",
      pillStatuses: ["available", "on_site"],
    },
  ];

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseAnonClient();
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, details, icon_src, modal_image_src, pill_statuses, sort_order")
        .order("sort_order", { ascending: true });

      if (error || !data) {
        setServiceCards(fallbackCards);
        return;
      }

      const mapped: ServiceCard[] = (data as any[]).map((r) => ({
        title: r.title,
        description: r.description,
        details: r.details ?? undefined,
        iconSrc: r.icon_src ?? undefined,
        modalImageSrc: r.modal_image_src ?? undefined,
        pillStatuses: (r.pill_statuses ?? []) as any,
      }));

      setServiceCards(mapped.length ? mapped : fallbackCards);
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