import Link from "next/link";
import Image from "next/image";
import Services from "./components/services";
import About from "./components/about";
import Contact from "./components/contact";

export default function Home() {
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
        
        <div className="relative z-10 flex -mt-20 pt-10 mx-auto grid max-w-6xl grid-cols-1 items-center justify-center gap-10 px-6 md:grid-cols-[1fr_1.25fr]  h-170">
          <div className="pt-5">
            
            <h1 className="-mt-25 w-[200%] text-[clamp(4.2rem,5.6vw,3.75rem)] font-bold leading-[0.92] tracking-tighter text-slate-900  ">
              <span className="block  text-[#404040] pt-2 bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%]  text-transparent bg-clip-text ">
                <span className="font-miama font-thin inline-block align-baseline text-[2.9em] leading-[0.55]">W</span>
                <span className="-ml-1">e</span>
                <span className="ml-2">Focus on</span>
              </span>
               
              <span className="block -mt-[0.20em]">
                <span className="text-[#522BC9]">your</span>
                
                <span className="text-blue-600"> Computers</span>
              </span>
              <span className="block mt-[0.15em] text-blue-700">Needs.</span>
            </h1>

            <div className="mt-8 flex flex-col items-start gap-3">
              <p className="mt-9 font-semibold max-w-xl text-lg leading-8 text-[#404040] bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] inline-block text-transparent bg-clip-text">
            MS18 Computer Supplies & Services</p>
              
              <Link
                href="/contact"
                className="opacity-65 hover:opacity-100 group inline-flex h-7 items-center justify-center gap-1 rounded-full border border-black bg-white px-3 text-xs font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                <span>Find out more below.</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-[#404040]"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.7a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
           </div>
          </div>

          {/* Image Right */}

          <div className="relative w-[135%] h-[80%] -translate-y-19 -translate-x-5  ">
            <div className="absolute -inset-0rounded-[40px]" />
            <div className=" relative mx-auto w-full max-w-[960px] md:max-w-[920px]">
            
              <Image
                src="/computerhome.svg"
                alt="Computer Servicing"
                width={550}
                height={550}
                className="h-auto w-full object-contain"
                priority
              />

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
