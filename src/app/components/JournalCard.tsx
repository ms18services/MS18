'use client'

type JournalCardProps = {
  className?: string
}

export default function JournalCard({ className }: JournalCardProps) {
  return (
    <div className={className}>
      <div className="relative mt-5 mx-auto w-full max-w-4xl overflow-visible">
        <div className="absolute left-0 top-1/2 z-10 h-[200px] w-[500px] -translate-x-[30%] -translate-y-1/2 rounded-[22px] bg-[#3A0F4B] md:h-[190px] md:w-[250px]" />

        <div className="relative w-full min-h-[290px] overflow-hidden rounded-[28px] shadow-xl ring-1 ring-black/5">
          <div className="absolute right-6 top-6 h-2.5 w-15 rounded-full bg-[#7A2DD6]" />

          <div className="flex flex-col gap-6 p-5 md:flex-row md:items-start md:gap-10 md:p-7">
            <div className="flex shrink-0 items-center gap-6">
              <div className="ml-40 translate-y-5 h-[200px] w-[160px] rounded-[22px] bg-[#3A0F4B] md:h-[190px] md:w-[176px]" />
            </div>

            <div className="min-w-0">
              <div className="text-[14px] translate-y-1 -tracking-[1px] font-bold bg-gradient-to-br from-[#2767BC]  to-[#070D33]  bg-clip-text text-transparent">For the People</div>
              <div className="mt-1 text-[28px] font-bold leading-[1.05] -tracking-[1px]">
                <span className="bg-gradient-to-b from-[#9A42E6]  to-[#562580] from-20% to-100% bg-clip-text text-transparent text-[2.5rem] -tracking-[3px]">Since 2003</span>
              </div>
              <div className="mt-1 text-[1.2em] font-bold text-[#616161] -tracking-[1px]">The Perseverance of Technician</div>

              <div className="mt-5 mr-10 space-y-2 font-semibold text-[11px] leading-[1.2] text-slate-500">
                <p>
                  We provide reliable computer repair services focused on fixing broken components, replacing faulty parts, and
                  restoring your device’s performance. Our goal is to deliver honest, efficient solutions that keep your
                  technology running smoothly, whether for work, study, or everyday use.
                </p>
                <p>
                  We provide reliable computer repair services focused on fixing broken components, replacing faulty parts, and
                  restoring your device’s performance. Our goal is to deliver honest, efficient solutions that keep your
                  technology running smoothly, whether for work, study, or everyday use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
