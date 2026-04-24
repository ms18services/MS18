'use client'

import Services from "./components/services";
import About from "./components/about";
import Contact from "./components/contact";
import Image from "next/image";
import { TextAnimation } from "./components/TextAnimation";
import Hero3D from "./components/Hero3D";
import GradualBlur from "./components/GradualBlur";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {

  const headRef = useRef<HTMLHeadingElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const autoScrollFrameRef = useRef<number | null>(null);

  const cancelAutoScroll = useCallback(() => {
    if (autoScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
  }, []);

  const handleTextAnimationComplete = useCallback(() => {
    setCtaVisible(true);
  }, []);

  const handleFindOutMoreClick = useCallback(() => {
    cancelAutoScroll();

    const pixelsPerSecond = 220;
    let previousTime: number | null = null;

    const step = (currentTime: number) => {
      const root = document.documentElement;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const currentY = window.scrollY || window.pageYOffset || 0;

      if (currentY >= maxScroll - 1) {
        autoScrollFrameRef.current = null;
        window.scrollTo({ top: maxScroll, behavior: "auto" });
        return;
      }

      if (previousTime === null) {
        previousTime = currentTime;
      }

      const deltaSeconds = Math.min((currentTime - previousTime) / 1000, 0.05);
      previousTime = currentTime;
      const nextY = Math.min(currentY + pixelsPerSecond * deltaSeconds, maxScroll);

      window.scrollTo({ top: nextY, behavior: "auto" });
      autoScrollFrameRef.current = window.requestAnimationFrame(step);
    };

    autoScrollFrameRef.current = window.requestAnimationFrame(step);
  }, [cancelAutoScroll]);

  useEffect(() => {
    const handleWheel = () => cancelAutoScroll();
    const handleTouchStart = () => cancelAutoScroll();
    const handleKeyDown = (event: KeyboardEvent) => {
      const interruptKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        "Space",
      ];

      if (interruptKeys.includes(event.code) || interruptKeys.includes(event.key)) {
        cancelAutoScroll();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAutoScroll();
    };
  }, [cancelAutoScroll]);
  


  return (
    <div className="bg-white">
        
      {/* Hero Section */}
{/* 
      <div className="relativepointer-events-none absolute inset-0 z-10  -translate-x-79 translate-y-85 ">
        <Image
          src="/lines2.svg"
          alt=""
          width={600}
          height={600}
          className="object-contain"
        />
      </div> */}

      <section className="relative overflow-visible w-[100%]" id="home">
        {/* <div className="pointer-events-none absolute inset-0 z-0 -translate-y-15 -translate-x-15">
          <Image
            src="/background.svg"
            alt=""
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div> */}
        
        <div className="  flex  pt-25 mx-auto grid max-w-6xl grid-cols-1 items-center justify-center gap-2 px-6 grid-cols-[1fr_1.25fr]  h-150">
          <h1 ref={headRef} className="pt-18 z-20 size-5  w-140 h-100 size-20 -ml-10">
            
            <div  className="-mt-25 w-[200%] text-[clamp(5rem,5.6vw,3.75rem)] font-bold leading-[0.92] tracking-tighter text-slate-900  ">
              <span className="block  text-[#522BC9] pt-2  ">
                <span className="font-miama font-thin inline-block align-baseline text-[2.9em] leading-[0.55] ">W</span>
                <span className="-ml-1 text-[#522BC9]">e</span>
                <span className="ml-2 text-[#522BC9] inline-block ">Focus on</span>
              </span>
               
              <span className="block -mt-[0.20em]">
                <span className="text-[#522BC9] ">your</span>
                
                <span className="text-[#2767BC]"> Computers</span>
              </span>
              <span className="block mt-[0.15em] bg-gradient-to-br from-[#2767BC] to-[#142699] bg-clip-text text-transparent py-1">Needs.</span>
            </div>

            
          
            <div className="mt-2 flex flex-col items-start gap-1">
              <p className="mt-9 font-semibold max-w-xl text-lg leading-8 text-[#404040] bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] inline-block text-transparent bg-clip-text">
            MS18 Computer Supplies & Services</p>
              
              {ctaVisible ? (
                <GradualBlur
                  blur={18}
                  y={18}
                  duration={0.7}
                  delay={0.05}
                  scrub={false}
                  className="inline-flex"
                >
                  <button
                    type="button"
                    onClick={handleFindOutMoreClick}
                    className="group inline-flex h-7 items-center justify-center gap-1 rounded-full border border-black bg-white px-3 text-xs font-medium text-slate-900 opacity-65 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:opacity-100"
                  >
                    <span>Find out more below.</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 text-[#404040] transition-transform duration-300 group-hover:translate-y-0.5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.7a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </GradualBlur>
              ) : null}

              
           </div>
           
      
          </h1>
           <TextAnimation target={headRef} onComplete={handleTextAnimationComplete} />
          {/* Image Right */}

          <div className="relative -mt-4  ">

                <div className="absolute inset-0 flex items-center pointer-events-none justify-center z-9 w-220 mt-17 -ml-30">
                  <div>
                  <Image
                    src="/homepagebackground.svg"
                    alt="Computer Servicing"
                    width={550}
                    height={550}
                    className="h-auto w-full object-contain bg-intro-float2"
                    priority
                  />
                  </div>
                
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-9 w-50 -mt-90 ml-20">
                  <div>
                  <img
                    src="/cd-windows.gif"
                    alt="Computer Servicing"
                    width={500}
                    height={500}
                    className="h-auto w-full object-contain gif-intro-float"
                    
                  />
                  </div>
                
              </div>



              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 w-35  -mb-65 ml-25">
                  <div>
                  <img
                    src="/dino.gif"
                    alt="Computer Servicing"
                    width={500}
                    height={500}
                    className="h-auto w-full object-contain gif-intro-float"
                    
                  />
                  </div>
                
              </div>


              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 w-30  -mb-50 ml-102">
                  <div>
                  <img
                    src="/mouse_clicker.svg"
                    alt="Computer Servicing"
                    width={500}
                    height={500}
                    className="h-auto w-full object-contain gif-intro-float"
                    
                  />
                  </div>
                
              </div>



              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 w-23 -mt-100 ml-109">
                  <div>
                  <img
                    src="/microsoft-computer.gif"
                    alt="Computer Servicing"
                    width={500}
                    height={500}
                    className="h-auto w-full object-contain gif-intro-float"
                    
                  />
                  </div>
                
              </div>


            <div className="absolute z-10" />
            <div className=" absolute z-11 mx-auto w-190 h-150 -translate-x-10 -mt-96 ">
              <Hero3D />

              

            </div>

          </div>
        </div>
      </section>

      <div>
          
          <Services />

      </div>

      <div>
          
          <About />

      </div>

      <div>
          
          <Contact />

      </div>
     
    </div>
  );
}
