'use client';
import License from './license';
import MeetTheTeam from './meettheteam';
import IPartners from './partners';
import TheJournal from './thejournal';

export default function About() {
  return (

    //about us
    <section id="about" className=" border-t border-slate-100 bg-white scroll-mt-15">
        
        <div className="mx-auto max-w-6xl px-6 ">
            {/* <div className="ml-235  mt-44 absolute z-25">
              <img src="/cloud.svg" alt="" className="h-40 w-40 object-contain opacity-100" />
            </div> */}

          <div className="grid  grid-cols-[1fr_10fr] gap-1 rounded-3xl bg-white px-1 py-1">
            <div className="font-bold translate-x-[-20px] h-[21em] w-full bg-gradient-to-r from-[#4873FF] via-[#1629A6] to-[#142699] via-30%  to-100% bg-clip-text text-transparent">
              <h2 className="text-[10em]  -tracking-[10px] ">About</h2>            
              <h2 className="text-[10em]  -tracking-[10px] leading-[0.2] ml-70">Us.</h2>
                {/* Image left */}
           <div className="relative w-full h-[500px] overflow-hidden  bottom-38 ">
                 <img 
                        src="/about-imageleft.png" 
                        className="absolute left-0 bottom-0 h-full object-contain  [clip-path:inset(0_0_50px_0)]"
                        />
              </div>
            </div>

            <div>

                
           

          
                {/* text right */}

                <p className='bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text font-bold -mb-25   mt-12 -tracking-[0.08em] text-[4em] text-center'>
                GET TO KNOW US.
                </p>

                <p className='bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text font-bold -mb-20   mt-22 -tracking-[0.01em] text-[1.2em] text-center'>
                <span className="font-bold bg-gradient-to-b from-[#9A42E6]  to-[#562580] from-20% to-100% bg-clip-text text-transparent">" We Focus on your </span> <span className='font-bold bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text'> Computers Needs </span> "  
                </p>

           <div className=" h-80 font-medium grid grid-cols-2 gap-5  max-w-2xl text-slate-600 mt-25 ">
             <h1 className="text-justify text-[0.9em] indent-7 -tracking-[0.07 em] ">
             <span className="">  <span className='font-bold bg-gradient-to-b from-[#9A42E6]  to-[#562580] from-20% to-100% bg-clip-text text-transparent'> MS18  COMPUTER SUPPLIES & SERVICES </span> (formerly known as <span className='font-bold bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text'>M&S MINI COMPUTER SUPPLIES </span> )</span> was established in August 2003. The company was formed by siblings having vivid experience and wide exposure to Information Technology. Since then, the company has steadily grown by delivering reliable computer products.<br /> <br />  
             </h1>

              <p className='text-justify text-[0.9em]'> The resource personnel working in the company have been consistently providing reliable support services. The bottom line of the company is building a  <span className="font-bold bg-gradient-to-b from-[#9A42E6]  to-[#562580] from-20% to-100% bg-clip-text text-transparent"> Long-term Business Partnership</span> with its clients where interpersonal relationships, reliability, assured quality and target oriented in <span className='font-bold bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text'> Modern Technology.</span></p>

             {/* <p className="text-justify text-[0.9em]">
                We are genuinely client focused and continually seeking improvement in our products. We are determined to succed and draw inspiration from challenges. <br /> <br /> <span className="font-bold">MS18 COMPUTER SUPPLIES & SERVICES</span> provides professional service and orientation. All our staff is highly trained and has many years of experience, and they are always available for all your queries and service requests.
             </p> */}

             
                  {/* Image right */}

            </div> 
            <div className="group relative rounded-[20px] bg-purple-500 h-40   max-w-2xl text-slate-600 -mt-23 mb-20 overflow-hidden">
                    <div className="rounded-[20px] w-full h-40 bg-purple-500 overflow-hidden">
                        <img 
                        src="/about-image.jpg" 
                        className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <button
                      type="button"
                      className="absolute bottom-4 right-4 inline-flex items-center rounded-full px-5 py-2   text-sm font-semibold text-white shadow-sm ring-1 ring-white translate-y-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      Learn more
                    </button>
            </div>
            

             
            

</div>

          </div>

        <div>
          <MeetTheTeam />
        </div>

         <div>
          <IPartners />
        </div>

        <div>
          <TheJournal />
        </div>
        <div>
          <License />
        </div>

        
        </div>
      </section>
  );
}






