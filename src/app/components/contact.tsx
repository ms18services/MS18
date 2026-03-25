'use client';

export default function Contact() {
  return (
    <section id="contact" className="border-t border-slate-900/60 bg-[#060012] scroll-mt-24 mt-5">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="ml-30 flex flex-col items-start gap-6">
          <h2 className="text-7xl font-bold tracking-tight text-white md:text-7xl">
            You have a problem?
          </h2>

          <a
            href="/contact"
            className="inline-flex ml-150 h-16 items-center justify-center rounded-none border-2 border-fuchsia-500 px-10 text-3xl font-small text-fuchsia-400 transition hover:bg-fuchsia-500/10"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-400">Get in touch</h3>
            <div className="mt-5 flex flex-col gap-4">
              <a
                href="tel:+64099991199"
                className="inline-flex w-fit items-center rounded-full border border-fuchsia-500 px-5 py-2 text-sm text-fuchsia-300 hover:bg-fuchsia-500/10"
              >
                (032) 253-5602
              </a>
              <a
                href="tel:+64099991199"
                className="inline-flex w-fit items-center rounded-full border border-fuchsia-500 px-5 py-2 text-sm text-fuchsia-300 hover:bg-fuchsia-500/10"
              >
                (032) 236-0042
              </a>
              <a
                href="mailto:ms18@demo.com"
                className="inline-flex w-fit items-center rounded-full border border-fuchsia-500 px-5 py-2 text-sm text-fuchsia-300 hover:bg-fuchsia-500/10"
              >
                ms18@demo.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400">Main Office</h3>
            <p className="mt-5 max-w-xs text-xs leading-5 text-slate-400">
              M2 Bayanihan Village, Quiot, Cebu City, Philippines
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400">Menu</h3>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a href="#home" className="w-fit text-slate-300 hover:text-white">Home</a>
              <a href="#services" className="w-fit text-slate-300 hover:text-white">Services</a>
              <a href="#about" className="w-fit text-slate-300 hover:text-white">About</a>
              <a href="/journal" className="w-fit text-slate-300 hover:text-white">Blog</a>
              <a href="#contact" className="w-fit text-slate-300 hover:text-white">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400">Legal</h3>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a href="#" className="w-fit text-slate-300 hover:text-white">Privacy Policy</a>
              <a href="#" className="w-fit text-slate-300 hover:text-white">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}