'use client';

import { useEffect, useRef, useState } from 'react';
import DitherBackground from './DitherBackground';

const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'ms18@demo.com';

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mousePositionRef = useRef({ x: -10, y: -10 });
  const modalAnimationFrameRef = useRef<number | null>(null);
  const modalCloseTimeoutRef = useRef<number | null>(null);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [form, setForm] = useState<ContactFormState>(initialForm);

  useEffect(() => {
    if (!isModalMounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModalMounted]);

  useEffect(() => {
    return () => {
      if (modalAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(modalAnimationFrameRef.current);
      }
      if (modalCloseTimeoutRef.current !== null) {
        window.clearTimeout(modalCloseTimeoutRef.current);
      }
    };
  }, []);

  const openModal = () => {
    if (modalCloseTimeoutRef.current !== null) {
      window.clearTimeout(modalCloseTimeoutRef.current);
      modalCloseTimeoutRef.current = null;
    }
    if (modalAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(modalAnimationFrameRef.current);
    }
    setSubmitError('');
    setSubmitSuccess('');
    setIsModalMounted(true);
    modalAnimationFrameRef.current = window.requestAnimationFrame(() => {
      setIsModalVisible(true);
      modalAnimationFrameRef.current = null;
    });
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalVisible(false);
    if (modalCloseTimeoutRef.current !== null) {
      window.clearTimeout(modalCloseTimeoutRef.current);
    }
    modalCloseTimeoutRef.current = window.setTimeout(() => {
      setIsModalMounted(false);
      modalCloseTimeoutRef.current = null;
    }, 320);
  };

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();

    mousePositionRef.current = {
      x: (event.clientX - rect.left) / Math.max(rect.width, 1),
      y: 1 - (event.clientY - rect.top) / Math.max(rect.height, 1),
    };
  };

  const handleSectionPointerLeave = () => {
    mousePositionRef.current = { x: -10, y: -10 };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSubmitError(payload?.error ?? 'We could not send your message right now.');
        return;
      }

      setSubmitSuccess('Your message has been sent. The team should receive it in the company inbox.');
      setForm(initialForm);
    } catch {
      setSubmitError('Something went wrong while sending your message. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="relative mt-5 overflow-hidden scroll-mt-24 border-t border-slate-900/60 bg-[#060012] "
        onPointerMove={handleSectionPointerMove}
        onPointerLeave={handleSectionPointerLeave}
      >
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <DitherBackground
            waveSpeed={0.2}
            waveFrequency={2}
            waveAmplitude={0.3}
            colorIntensity={2}
            waveColor={[0.31, 0.21 , 0.81]}
            colorNum={4}
            pixelSize={3}
            enableMouseInteraction
            mouseRadius={0.3} 
            mousePositionRef={mousePositionRef}
            
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(190,24,93,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(76,29,149,0.32),_transparent_36%),linear-gradient(180deg,_rgba(6,0,18,0.5),_rgba(6,0,18,0.92))]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col items-start gap-6 md:ml-30">
            <h2 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
              You have a problem?
            </h2>

            <button
              type="button"
              onClick={openModal}
              className="inline-flex h-16 items-center justify-center border-2 border-fuchsia-500  px-8 text-xl font-light text-fuchsia-400 transition hover:bg-[#060012] md:ml-150 md:px-10 md:text-3xl"
            >
              Contact Us
            </button>
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
                  href={`mailto:${companyEmail}`}
                  className="inline-flex w-fit items-center rounded-full border border-fuchsia-500 px-5 py-2 text-sm text-fuchsia-300 hover:bg-fuchsia-500/10"
                >
                  {companyEmail}
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

      {isModalMounted ? (
        <div
          className={`fixed inset-0 z-[90] flex items-center justify-center px-4 py-8 backdrop-blur-sm transition-[background-color,backdrop-filter,opacity] duration-300 ease-out ${
            isModalVisible ? 'bg-slate-950/70 opacity-100' : 'bg-slate-950/0 opacity-0'
          }`}
        >
          <button
            type="button"
            aria-label="Close contact modal"
            className="absolute inset-0 cursor-default"
            onClick={closeModal}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className={`relative z-[91] w-full max-w-2xl overflow-hidden rounded-3xl bg-[#060012] text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isModalVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-8 scale-[0.96] opacity-0'
            }`}
          >
            <div className="bg-[radial-gradient(circle_at_top_left,_rgba(217,70,239,0.22),_transparent_48%),linear-gradient(135deg,_rgba(24,4,44,1),_rgba(8,2,18,1))] px-6 py-5 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300/80">
                    Contact Request
                  </p>
                  <h3 id="contact-modal-title" className="mt-2 text-3xl font-semibold tracking-tight">
                    Tell us what you need
                  </h3>
                  <p className="mt-3 max-w-lg text-sm text-slate-300">
                    Fill out the form and we will send it to <span className="text-fuchsia-300">{companyEmail}</span>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-fuchsia-200 transition hover:bg-fuchsia-500/10"
                  aria-label="Close"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M6 6l8 8" />
                    <path d="M14 6l-8 8" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6 md:px-8 md:py-8">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Name
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="h-12 border border-fuchsia-500/20 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400"
                    placeholder="Juan Dela Cruz"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Email
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="h-12 border border-fuchsia-500/20 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Contact Number
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className="h-12 border border-fuchsia-500/20 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400"
                  placeholder="+63 900 000 0000"
                  autoComplete="tel"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Message
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className="min-h-36 resize-y border border-fuchsia-500/20 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400"
                  placeholder="Tell us about the issue, service you need, or the best time to reach you."
                  required
                />
              </label>

              {submitError ? (
                <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </div>
              ) : null}

              {submitSuccess ? (
                <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {submitSuccess}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-fuchsia-500/15 pt-2 md:flex-row md:items-center md:justify-between">
                <p className="text-xs text-slate-400">
                  Submissions are delivered through the site email integration.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center border border-fuchsia-500 px-6 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
