'use client'

import JournalCarousel from './JournalCarousel'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ShinyText from './ShinyText'

export default function TheJournal() {
    const [dateLabel, setDateLabel] = useState('')

    useEffect(() => {
      const now = new Date()
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }).format(now)
      setDateLabel(formatted)
    }, [])

    return (
        <section className="w-full mx-auto py-3  overflow-x-hidden overflow-visible ">
       
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-[1fr_auto] items-start gap-6">
              <Link
                href="/journal"
                className="group mt-2 relative min-w-0 grid justify-start overflow-hidden text-left text-[5.5em] leading-[0.9] -tracking-[6px] font-bold"
              >
                <ShinyText>
                  <span className="flex grid grid-cols-2 relative z-20 bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] p-2 text-transparent bg-clip-text">
                    The
                  </span>
                
                
                  <span className="relative z-20 bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text">
                    Journal.
                  </span>
                </ShinyText>
              </Link>

              <div className="pt-2 text-right text-[25px] font-bold -tracking-[1px] h-20 text-black/55 translate-y-31 pr-1 whitespace-nowrap">
                {dateLabel}
              </div>
            </div>

            <JournalCarousel className="mt-2" dotsPosition="belowHeader" />
            
          </div>
        </section>
    )
}
