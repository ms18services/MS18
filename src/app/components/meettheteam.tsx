"use client";
import BlurText from "./BlurText";
import GradualBlur from "./GradualBlur";
import TeamCarousel3D, { type TeamCard } from "./TeamCarousel3D";

export default function MeetTheTeam() {
  const teamCards: TeamCard[] = [
    {
      name: "Alex Tan",
      role: "Hardware Specialist",
      imageSrc: "/face/final/angie.jpg",
    },
    {
      name: "Mika Lim",
      role: "Software & Setup",
      imageSrc: "/face/final/cindy.jpg",
    },
    {
      name: "Jordan Lee",
      role: "Diagnostics",
      imageSrc: "/face/final/romeo.jpg",
    },
    {
      name: "Sam Chen",
      role: "Data Recovery",
      imageSrc: "/face/final/benjie.jpg",
    },
    {
      name: "Aisha Noor",
      role: "Security",
      imageSrc: "/face/final/anjun.jpg",
    },
    
  ];

  return (
    <section className="-mt-20">
      <div className="mx-auto max-w-6xl px-6 mt-40">
        <div className="relative flex items-center justify-center py-10">
          <div className="pointer-events-none absolute  flex items-center justify-center">
            <div className="-translate-y-55 bg-gradient-to-r from-[#4873FF] via-[#1629A6] to-[#142699] from-5% via-50% to-100% bg-clip-text text-transparent opacity-100">
              <BlurText
                as="h2"
                text="Meet The Team."
                className="text-center text-[clamp(3.5rem,10vw,8rem)] font-bold tracking-tighter leading-[0.9]"
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
