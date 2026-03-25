"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createSupabaseAnonClient } from "@/lib/supabase";
import SCarousel, { type ServiceCard } from "./ServicesCarousel"; // same folder

export default function Services() {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseAnonClient();
      const { data, error } = await supabase
        .from("services")
        .select("id, title, description, details, icon_src, modal_image_src, pill_statuses, sort_order")
        .order("sort_order", { ascending: true });

      if (error || !data) {
        setServiceCards([]);
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

      setServiceCards(mapped);
    };

    run();
  }, []);

  return (
    <section
      id="services"
      className=" border-t border-slate-100 bg-slate-50/50 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-6 py-14">


        {/* marquee */}
        <div className="w-full flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="marquee-track">
            <div className="marquee-group">
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
            <div className="marquee-group" aria-hidden="true">
              {[...Array(4)].map((_, i) => (
                <Image
                  key={`g2-${i}`}
                  src="/supplies&services.svg"
                  alt=""
                  width={700}
                  height={700}
                  className="mx-8 shrink-0"
                />
              ))}
            </div>
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