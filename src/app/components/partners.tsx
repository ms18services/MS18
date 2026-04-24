'use client';

import { useState } from "react";

import LogoLoop, { type LogoItem } from "./LogoLoop";

const partnerLogoSources = [
  { src: "/computerhome.svg", title: "Computer Home" },
  { src: "/ms18logofull.svg", title: "MS18 Computer Supplies & Services" },
] as const;

const createPartnerLogos = (size: number): LogoItem[] =>
  Array.from({ length: 8 }, (_, i) => {
    const logo = partnerLogoSources[i % partnerLogoSources.length];

    return {
      src: logo.src,
      alt: "",
      title: logo.title,
      width: size,
      height: size,
    };
  });

const smallPartnerLogos = createPartnerLogos(80);
const largePartnerLogos = createPartnerLogos(120);

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
        <div className="blur-[2px] [transform:scaleX(-1)] marquee-fade mt-15 relative left-1/2 w-[119vw] -translate-x-1/2 overflow-hidden opacity-70">
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

        <div className="marquee-fade -mt-10 relative left-1/2 w-[110vw] -translate-x-1/2 overflow-hidden">
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
