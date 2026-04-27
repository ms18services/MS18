'use client';

import { useState } from "react";

import LogoLoop, { type LogoItem } from "./LogoLoop";

type PartnerLogoSource = {
  src: string;
  title: string;
  width: number;
  height: number;
  logoScale?: number;
};

const partnerLogoSources: readonly PartnerLogoSource[] = [
  { src: "/Partners/banbros.png", title: "Banbros", width: 891, height: 280 },
  { src: "/Partners/cvs.png", title: "cvs", width: 506, height: 493 },
  { src: "/Partners/gt logo-eng.png", title: "gt", width: 1342, height: 237 },
  { src: "/Partners/joyo.png", title: "joyo", width: 871, height: 286 },
  { src: "/Partners/logo.png", title: "Trinity", width: 170, height: 129 },
  { src: "/Partners/metor.png", title: "metro", width: 551, height: 322 },
  { src: "/Partners/synergy.png", title: "Synergy", width: 500, height: 500, logoScale: 1.25 },
  { src: "/Partners/WS.svg", title: "WS", width: 127, height: 86 },
];

const createPartnerLogos = (): LogoItem[] =>
  Array.from({ length: 8 }, (_, i) => {
    const logo = partnerLogoSources[i % partnerLogoSources.length];

    return {
      src: logo.src,
      alt: "",
      title: logo.title,
      width: logo.width,
      height: logo.height,
      logoScale: logo.logoScale,
    };
  });

const smallPartnerLogos = createPartnerLogos();
const largePartnerLogos = createPartnerLogos();

export default function IPartners() {
  const [isLoopHovered, setIsLoopHovered] = useState(false);

  return (  
  
    <section className="marquee-speed-partners w-full mx-auto -mt-13 py-5  scale-60">
      <div className="mx-auto max-w-8xl px-6">
        <h1 className="mx-auto w-max grayscale whitespace-nowrap text-center text-[30px] -tracking-[2px] font-semibold bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-5% via-50% to-100% bg-clip-text text-transparent cursor-default hover:grayscale-0 transition-all duration-300 ">
          MS18 Computer <span className="  bg-gradient-to-br from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] bg-clip-text text-transparent "> Supplies & Services </span> Partners are:
        </h1>
      </div>

      <div
        onMouseEnter={() => setIsLoopHovered(true)}
        onMouseLeave={() => setIsLoopHovered(false)}
      >
        <div className="blur-[2px] [transform:scaleX(-1)] marquee-fade mt-15 relative left-1/2 w-[119vw] -translate-x-1/2 overflow-x-hidden overflow-y-visible py-4 opacity-70">
          <LogoLoop
            logos={smallPartnerLogos}
            direction="right"
            speed={40}
            gap={48}
            logoHeight={80}
            pauseOnHover
            isHovered={isLoopHovered}
            scaleOnHover
            ariaLabel="Partners"
            className="[&_img]:shrink-0 [&_img]:grayscale [&_img]:transition-all [&_img]:duration-300 [&_li:hover_img]:grayscale-0"
          />
        </div>

        <div className="marquee-fade -mt-10 relative left-1/2 w-[110vw] -translate-x-1/2 overflow-x-hidden overflow-y-visible py-5">
          <LogoLoop
            logos={largePartnerLogos}
            direction="right"
            speed={54}
            gap={48}
            logoHeight={120}
            pauseOnHover
            isHovered={isLoopHovered}
            scaleOnHover
            ariaLabel="Partners"
            className="[&_img]:shrink-0 [&_img]:grayscale [&_img]:transition-all [&_img]:duration-300 [&_li:hover_img]:grayscale-0"
          />
        </div>
      </div>
    </section>
    
)


}
