'use client'

import JournalCarousel from './JournalCarousel'
import Link from 'next/link'
import ShinyText from './ShinyText'

export default function TheJournal() {
    const dateLabel = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date())

    return (
        <section className="w-full mx-auto overflow-visible overflow-x-hidden py-7 md:py-3">
       
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center gap-1 md:grid md:grid-cols-[1fr_auto] md:items-start md:gap-6">
              <Link
                href="/journal"
                className="group relative mt-2 min-w-0 overflow-hidden text-center text-[3.6rem] font-bold leading-[0.92] tracking-tight md:grid md:justify-start md:text-left md:text-[5.5em] md:-tracking-[6px]"
              >
                <ShinyText>
                  <span className="relative z-20 inline-block bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] bg-clip-text p-1 text-transparent md:grid md:grid-cols-2 md:p-2">
                    The
                  </span>
                
                
                  <span className="relative z-20 bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text">
                    Journal.
                  </span>
                </ShinyText>
              </Link>

              <div className="h-auto whitespace-nowrap pt-1 text-center text-[11px] font-bold tracking-normal text-black/55 md:h-20 md:translate-y-31 md:pr-1 md:text-right md:text-[25px] md:-tracking-[1px]">
                {dateLabel}
              </div>
            </div>

            <JournalCarousel className="mt-2" dotsPosition="belowHeader" />
            
          </div>
        </section>
    )
}
