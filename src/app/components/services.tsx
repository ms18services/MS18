"use client";

import Image from "next/image";
import SCarousel, { type ServiceCard } from "./ServicesCarousel"; // same folder

export default function Services() {
  const serviceCards: ServiceCard[] = [
    {
      title: "Hardware Repair",
      description: "Diagnostics, part replacement, overheating fixes, and more.",
      
    },
    {
      title: "Software Setup",
      description: "OS installs, drivers, cleanup, and performance tuning.",
    
    },
    {
      title: "Data Recovery",
      description: "Recover important files from disks, SSDs, and flash storage.",
      
    },
    {
      title: "Security & Virus Removal",
      description: "Clean infections, lock down your system, and keep it protected.",
     
    },
  ];

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

                    <div className="mt-20">
            <div className="mx-auto max-w-6xl px-6">
                <SCarousel cards={serviceCards} />
            </div>
            </div>
      </div>
    </section>
  );
}