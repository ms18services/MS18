'use client'
import Image from 'next/image'

export default function License() {
    return (
        
            <section className="marquee-speed-license w-full mx-auto py-15 mt-15 overflow-visible">
              <div className="mx-auto max-w-8xl px-6">
                        {/* window */}
                    

                <h1 className="relative translate-x-[30%] text-[5em] -tracking-[8px] font-bold">
                 
                 <span className="relative z-20 ml-42 bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] text-transparent bg-clip-text">
                  Licenses & Permits.
                  </span>
                  <img src="/windowpc.svg" alt="Window PC" className="scale-59 absolute right-30 -top-28 z-10" />

                </h1>
              </div>
        

            
              <div className="marquee-pausable marquee-fade mt-10 relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
                <div className="marquee-track">
                  <div className="marquee-group gap-20 px-10">
                    {[...Array(8)].map((_, i) => {
                      const isGlobe = (i + 1) % 2 === 0;
                      return (
                        <Image
                          key={`p1-${i}`}
                          src={isGlobe ? "/computerhome.svg" : "/ms18logofull.svg"}
                          alt={isGlobe ? "Partners" : ""}
                          width={100}
                          height={100}
                          className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                          priority={i === 0}
                        />
                      );
                    })}
                  </div>
                  <div className="marquee-group gap-20 px-10" aria-hidden="true">
                    {[...Array(8)].map((_, i) => {
                      const isGlobe = (i + 1) % 2 === 0;
                      return (
                        <Image
                          key={`p2-${i}`}
                          src={isGlobe ? "/computerhome.svg" : "/ms18logofull.svg"}
                          alt=""
                          width={100}
                          height={100}
                          className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
        
              <div className="marquee-pausable marquee-fade mt-8 relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
                <div className="marquee-track-reverse">
                  <div className="marquee-group gap-20 px-10">
                    {[...Array(8)].map((_, i) => {
                      const isGlobe = i % 2 === 0;
                      return (
                        <Image
                          key={`p3-${i}`}
                          src={isGlobe ? "/computerhome.svg" : "/ms18logofull.svg"}
                          alt={isGlobe ? "Partners" : ""}
                          width={200}
                          height={200}
                          className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      );
                    })}
                  </div>
                  <div className="marquee-group gap-20 px-10" aria-hidden="true">
                    {[...Array(8)].map((_, i) => {
                      const isGlobe = i % 2 === 0;
                      return (
                        <Image
                          key={`p4-${i}`}
                          src={isGlobe ? "/computerhome.svg" : "/ms18logofull.svg"}
                          alt=""
                          width={200}
                          height={200}
                          className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

            </section>
           
    );
}