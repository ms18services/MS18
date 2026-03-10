"use client";

import TeamCarousel3D, { type TeamCard } from "./TeamCarousel3D";

export default function MeetTheTeam() {
  const teamCards: TeamCard[] = [
    {
      name: "Alex Tan",
      role: "Hardware Specialist",
      imageSrc: "/about-image.jpg",
    },
    {
      name: "Mika Lim",
      role: "Software & Setup",
      imageSrc: "/about-image.jpg",
    },
    {
      name: "Jordan Lee",
      role: "Diagnostics",
      imageSrc: "/about-image.jpg",
    },
    {
      name: "Sam Chen",
      role: "Data Recovery",
      imageSrc: "/about-image.jpg",
    },
    {
      name: "Aisha Noor",
      role: "Security",
      imageSrc: "/about-image.jpg",
    },
    
  ];

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-6xl px-6 mt-40">
        <div className="relative flex items-center justify-center py-10">
          <div className="pointer-events-none absolute  flex items-center justify-center">
            <div className="-translate-y-55 bg-gradient-to-r from-[#4873FF] via-[#1629A6] to-[#142699] from-5% via-50% to-100% bg-clip-text text-transparent opacity-100">
              <h2 className="text-center text-[clamp(3.5rem,10vw,8rem)] font-bold tracking-tighter leading-[0.9] ">
                Meet The Team.
              </h2>
            </div>
          </div>

          <div className="relative z-10 w-full">
            <TeamCarousel3D cards={teamCards}  className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}