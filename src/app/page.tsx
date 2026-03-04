import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white" id="home">
      <section className="relative overflow-visible">
        <div className="mr-2 -mt-18 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[1fr_1.25fr] md:py-24">
          <div>
            
            <h1 className="mt-6 text-[clamp(3.9rem,5.6vw,3.75rem)] font-bold leading-[0.92] tracking-tight text-slate-900">
              <span className="block text-purple-600">
                <span className="font-miama font-thin inline-block align-baseline text-[2.6em] leading-[0.55]">W</span>
                <span className="-ml-1">e</span>
                <span className="ml-2">Focus on</span>
              </span>
              <span className="block -mt-[0.20em]">
                <span className="text-purple-600">your</span>
                <span className="text-blue-600"> Computers</span>
              </span>
              <span className="block mt-[0.15em] text-blue-700">Needs.</span>
            </h1>

            <div className="mt-8 flex flex-col items-start gap-3">
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            MS18 Computer Supplies & Services</p>
              
              <Link
                href="/contact"
                className="group inline-flex h-8 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                <span>Find out more below.</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-700"
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

          <div className="relative">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-purple-100 via-white to-blue-100 blur-2xl" />
            <div className="relative mx-auto w-full max-w-[920px] md:max-w-[920px]">
            
              <Image
                src="/computerhome.svg"
                alt="Computer Servicing"
                width={900}
                height={700}
                className="h-auto w-full object-contain"
                priority
              />

            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-slate-100 bg-slate-50/50 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Services</h2>
              <p className="mt-2 text-sm text-slate-600">Everything you need to keep your computer running like new.</p>
            </div>
            <Link href="/#contact" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Get a quote
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Hardware Repair</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Diagnostics, part replacement, overheating fixes, and more.</p>
                <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
                  <li>Component replacement (RAM, HDD, SSD, GPU)</li>
                  <li>Motherboard and power supply checks</li>
                  <li>LCD screen and keyboard fixes</li>
                  <li>Cooling / fan servicing</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Software Setup</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">OS installs, drivers, cleanup, and performance tuning.</p>
                <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
                  <li>Windows / macOS / Linux installation</li>
                  <li>App setup and configuration</li>
                  <li>Startup cleanup and optimization</li>
                  <li>Driver updates and compatibility checks</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Data Recovery</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Recover important files from disks, SSDs, and flash storage.</p>
                <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
                  <li>Deleted file restoration</li>
                  <li>Drive health check &amp; cloning</li>
                  <li>SSD / flash recovery</li>
                  <li>Basic RAID troubleshooting</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Security &amp; Virus Removal</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Clean infections, lock down your system, and keep it protected.</p>
                <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
                  <li>Malware scanning and removal</li>
                  <li>Antivirus setup</li>
                  <li>Browser cleanup</li>
                  <li>Security hardening recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-t border-slate-100 bg-white scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 px-8 py-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">About</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Friendly, professional computer servicing with fast turnaround and clear communication.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">
              <p className="text-sm leading-7 text-slate-600">
                Welcome to Computer Servicing, your trusted partner for all your computer repair and maintenance needs. With over 10 years of experience in the industry, we have helped thousands of customers keep their devices running smoothly.
              </p>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                Our team focuses on practical solutions: clear diagnostics, honest recommendations, and quality parts. Whether you need a quick tune-up or a full system rebuild, we’ve got you covered.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Why choose us</h3>
              <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
                <li>Certified technicians</li>
                <li>Clear pricing</li>
                <li>Fast turnaround</li>
                <li>Warranty on repairs</li>
                <li>Free basic diagnostics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-slate-100 bg-slate-50/50 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 px-8 py-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Contact</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Tell us what you need help with. We’ll reply with availability and a quick estimate.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Get In Touch</h3>
              <p className="mt-2 text-slate-600">Have a question or need service? Contact us today!</p>
              <div className="mt-6 space-y-2 text-slate-600">
                <p>
                  <strong className="text-slate-900">Phone:</strong> (123) 456-7890
                </p>
                <p>
                  <strong className="text-slate-900">Email:</strong> info@computerservicing.com
                </p>
                <p>
                  <strong className="text-slate-900">Address:</strong> 123 Tech Street, Computer City, CC 12345
                </p>
              </div>
            </div>

            <form className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700" htmlFor="name">Name</label>
                <input type="text" id="name" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-300 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                <input type="email" id="email" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-300 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700" htmlFor="message">Message</label>
                <textarea id="message" rows={4} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-300 focus:ring-2 focus:ring-purple-100"></textarea>
              </div>
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
