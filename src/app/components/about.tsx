'use client';

import BitsSplitText from './BitsSplitText';
import GradualBlur from './GradualBlur';
import LinkedTextType from './LinkedTextType';
import MeetTheTeam from './meettheteam';
import IPartners from './partners';
import TheJournal from './thejournal';
import WavesBackground from './WavesBackground';

export default function About() {
  return (
    <section id="about" className="border-t border-slate-100 bg-white scroll-mt-15 -mt-2">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative grid grid-cols-[1fr_10fr] gap-1 overflow-visible rounded-3xl bg-white px-1 py-1">
          <WavesBackground fullBleedX bleedY={10} lineCount={15} showGlow={true} amplitude={15}
          
          
          className="z-0 opacity-90" />

          <div className="relative z-10 h-[21em] w-full translate-x-[-20px] font-bold leading-[0.9] tracking-[-0.1em]">
            <BitsSplitText
              as="h2"
              text="About"
              className="text-[10em] bg-gradient-to-r from-[#4873FF] via-[#1629A6] to-[#142699] via-30% to-100% bg-clip-text text-transparent"
            />
            <BitsSplitText
              as="h2"
              text="Us."
              wrapperClassName="ml-70"
              className="text-[10em] bg-gradient-to-r from-[#9A42E6] to-[#562580] via-30% to-100% bg-clip-text text-transparent"
            />
          </div>

          <GradualBlur
            blur={22}
            y={72}
            start="top 86%"
            duration={0.85}
            delay={0.55}
            scrub={false}
            className="pointer-events-none absolute left-0 top-1 mt-10 z-[100] h-[550px] w-fit overflow-hidden"
          >
            <img src="/about-imageleft.png" alt="" className="block h-full w-auto object-contain" />
          </GradualBlur>

          <div className="relative z-10">
            <BitsSplitText
              as="p"
              text="GET TO KNOW US."
              wrapperClassName="mx-auto mt-12 -mb-25 block"
              className="bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% bg-clip-text text-[3.8em] font-bold text-transparent"
            />

            <div className="mt-3 -mb-20 flex flex-wrap items-center justify-center gap-x-2 text-[1.2em] font-bold -tracking-[0.01em]">
              <BitsSplitText
                as="span"
                text={'" We Focus on your'}
                className="bg-gradient-to-b from-[#9A42E6] to-[#562580] from-20% to-100% bg-clip-text text-transparent"
              />
              <BitsSplitText
                as="span"
                text="Computers Needs"
                className="bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% bg-clip-text text-transparent"
              />
              <BitsSplitText
                as="span"
                text={'"'}
                className="bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% bg-clip-text text-transparent"
              />
            </div>

            <div className="mt-25 grid h-80 max-w-2xl grid-cols-2 gap-5 font-medium text-slate-600">
              <LinkedTextType
                typingSpeed={3}
                startDelay={180}
                cursorCharacter=""
                resetOnExit
                outroSpeed={8}
                blocks={[
                  {
                    as: 'h1',
                    className: 'text-justify text-[0.9em] indent-7',
                    segments: [
                      {
                        text: 'MS18 Computer Supplies & Services',
                        className:
                          'bg-gradient-to-b from-[#9A42E6] to-[#562580] from-20% to-100% bg-clip-text font-bold text-transparent',
                      },
                      { text: ' (formerly known as ' },
                      {
                        text: 'M&S MINI COMPUTER SUPPLIES',
                        className:
                          'bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% bg-clip-text font-bold text-transparent',
                      },
                      {
                        text:
                          ') was established in August 2003. The company was formed by siblings having vivid experience and wide exposure to Information Technology. Since then, the company has steadily grown by delivering reliable products.',
                      },
                    ],
                  },
                  {
                    as: 'p',
                    className: 'text-justify text-[0.9em]',
                    segments: [
                      {
                        text:
                          'The resource personnel working in the company have been consistently providing reliable support services. The bottom line of the company is building a ',
                      },
                      {
                        text: 'Long-term Business Partnership',
                        className:
                          'bg-gradient-to-b from-[#9A42E6] to-[#562580] from-20% to-100% bg-clip-text font-bold text-transparent',
                      },
                      {
                        text:
                          ' with its clients where interpersonal relationships, reliability, assured quality and target oriented in ',
                      },
                      {
                        text: 'Modern Technology.',
                        className:
                          'bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% bg-clip-text font-bold text-transparent',
                      },
                    ],
                  },
                ]}
              />
            </div>  

            <div className='mt-1'>

            <GradualBlur
              blur={18}
              y={40}
              start="top 92%"
              duration={0.75}
              delay={0.12}
              scrub={false}
              className="-mt-23 mb-20 max-w-2xl"
            >
              <div className="group relative h-40 overflow-hidden rounded-[20px] bg-purple-500 text-slate-600">
                <div className="h-40 w-full overflow-hidden rounded-[20px] bg-purple-500">
                  <img src="/1.jpg" alt="MS18 computer supplies and services" className="h-full w-full object-cover" />
                </div>
                  
                <div className="pointer-events-none absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <button
                  type="button"
                  className="absolute bottom-4 right-4 inline-flex translate-y-6 items-center rounded-full px-5 py-2 text-sm font-semibold text-white opacity-0 shadow-sm ring-1 ring-white transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Learn more
                </button>

               
              </div>
            </GradualBlur>


            <GradualBlur
              blur={18}
              y={40}
              start="top 92%"
              duration={0.75}
              delay={0.12}
              scrub={false}
              className="-mt-73 pointer-events-none  mb-20 max-w-2xl"
            >
              <div className="group relative  rounded-[20px]  text-slate-600">
                <div className=" h-full w-full rounded-[20px] opacity-100 ">
                  <img src="/image.png" alt="MS18 computer supplies and services" className="h-full w-full  " />
                </div>
                  
                <div className="pointer-events-none absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-300 " />

                <button
                  type="button"
                  className="absolute bottom-4 right-4 inline-flex translate-y-6 items-center rounded-full px-5 py-2 text-sm font-semibold text-white opacity-0 shadow-sm ring-1 ring-white transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Learn more
                </button>

               
              </div>
            </GradualBlur>

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
      </div>
    </section>
  );
}
