'use client';

import Image from "next/image";

export default function IPartners() {
  return (  
  
    <section className="w-full h-[100vh] mx-auto py-15 overflow-visible">
      <div className="mx-auto max-w-8xl px-6">
        <h1 className="translate-x-[-10%] text-[8em] -tracking-[6px] font-extrabold text-black bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-5% via-50% to-100% bg-clip-text text-transparent  ">
          Industry Partners
        </h1>
      </div>

      <div className="mt-25 relative left-1/2 w-screen -translate-x-1/2">
        <div className="marquee-track">
          <div className="marquee-group">
            {[...Array(4)].map((_, i) => (
              <Image
                key={`p1-${i}`}
                src="/supplies&services.svg"
                alt="Partners"
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
                key={`p2-${i}`}
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

      <div className="mt-20 relative left-1/2 w-screen -translate-x-1/2">
        <div className="marquee-track-reverse">
          <div className="marquee-group">
            {[...Array(4)].map((_, i) => (
              <Image
                key={`p3-${i}`}
                src="/supplies&services.svg"
                alt="Partners"
                width={700}
                height={700}
                className="mx-8 shrink-0"
              />
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {[...Array(4)].map((_, i) => (
              <Image
                key={`p4-${i}`}
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
    </section>
    
)


}