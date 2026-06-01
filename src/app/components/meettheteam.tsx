"use client";
import BlurText from "./BlurText";
import GradualBlur from "./GradualBlur";
import TeamCarousel3D, { type TeamCard } from "./TeamCarousel3D";
import useIsMobile from "./useIsMobile";

export default function MeetTheTeam() {
  const isMobile = useIsMobile();
  const teamCards: TeamCard[] = [
    {
      name: "Angela S. Medina",
      role: "Sales/Operations Manager",
      imageSrc: "/face/final/angie.jpg",
    },
    {
      name: "Teresita Pable",
      role: "Accounting In-charge",
      imageSrc: "/face/final/cindy.jpg",
    },
    {
      name: "Romeo Sastellas",
      role: "Logistics",
      imageSrc: "/face/final/romeo.jpg",
    },
    {
      name: "Benjaming Singcol Sr.",
      role: "IT Department",
      imageSrc: "/face/final/benjie.jpg",
    },
    {
      name: "Ricardo Singcol Sr.",
      role: "IT Department Head",
      imageSrc: "/face/final/anjun.jpg",
    },
    
  ];

  if (isMobile) {
    return (
      <section className="mt-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-[340px]">
            <h2 className="text-left text-[3.8rem] font-bold leading-[0.9] tracking-tight text-[#4B82F1]">
              Meet The Team.
            </h2>

            <div className="mt-6">
              <TeamCarousel3D cards={teamCards} className="mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-2 md:-mt-20">
      <div className="mx-auto mt-30 max-w-6xl px-6 md:mt-40">
        <div className="relative flex items-center justify-center py-10">
          <div className="pointer-events-none absolute flex items-center justify-center">
            <div className="-translate-y-39 bg-gradient-to-r from-[#4873FF] via-[#1629A6] to-[#142699] from-5% via-50% to-100% bg-clip-text text-transparent opacity-100 md:-translate-y-55">
              <BlurText
                as="h2"
                text="Meet The Team."
                className="text-center text-[clamp(3.8rem,14vw,8rem)] font-bold tracking-tighter leading-[0.9]"
                duration={0.9}
                stagger={0.12}
              />
            </div>
          </div>

          <div className="relative z-10 w-full">
            <GradualBlur
              blur={18}
              y={56}
              duration={0.9}
              delay={0.22}
              scrub={false}
              className="mx-auto"
            >
              <TeamCarousel3D cards={teamCards} className="mx-auto" />
            </GradualBlur>
          </div>
        </div>
      </div>
    </section>
  );
}
