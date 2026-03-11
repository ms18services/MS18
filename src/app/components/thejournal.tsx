'use client'

import JournalCard from './JournalCard'
import JournalCard2 from './JournalCard2'

export default function TheJournal() {
    return (
        <section className="w-full mx-auto py-5 mt-5 overflow-visible">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-[1fr_auto] items-start gap-6">
              <h1 className="relative min-w-0 grid justify-start text-left text-[5em] leading-[0.9] -tracking-[6px] font-bold">
                <span className="relative z-20 bg-gradient-to-r from-[#984CD3] via-[#522BC9] to-[#411563] to-[90%] text-transparent bg-clip-text">
                  The
                </span>
                <span className="relative z-20 bg-gradient-to-br from-[#4873FF] via-[#1629A6] to-[#142699] from-10% via-100% to-100% text-transparent bg-clip-text">
                  Journal.
                </span>
              </h1>

              <div className="pt-5 text-right text-[20px] font-bold -tracking-[1px] text-[#616161] translate-y-20 pr-20 whitespace-nowrap">March 03, 2026</div>
            </div>

            <JournalCard />

            <div className="mt-10">
              <JournalCard2 />
            </div>
          </div>
        </section>
    )
}