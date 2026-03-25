'use client'
import Image from 'next/image'

export default function License() {
    return (
        
            <section className="marquee-speed-license w-full mx-auto py-5 -mt-7 overflow-visible">
              <div className="mx-auto max-w-8xl px-6">
                        {/* window */}
                    

                <h1 className="text-center text-[1.8em]  -tracking-[1px] font-bold">
                 
                 <span className="relative z-20 bg-gradient-to-r from-[#984CD3] via-[#522BC9] grayscale opacity-70 to-[#411563] to-[90%] text-transparent bg-clip-text hover:grayscale-0 transition-all duration-300 cursor-default hover:opacity-100">
                  Licenses & Permits.
                  </span>
                 
                </h1>

                <div className="mt-10 grid grid-cols-1 gap-1 sm:grid-cols-3 scale-120">
                  
                        <img src="/license&permit.svg" alt="License 1" />
                        <img src="/license&permit.svg" alt="License 1" />
                        <img src="/license&permit.svg" alt="License 1" />
                 
                </div>

              </div>
        

            
              

            </section>
           
    );
}