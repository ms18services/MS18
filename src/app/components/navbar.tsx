'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = ['home', 'services', 'about', 'contact'];
    const observers: IntersectionObserver[] = [];

    setActiveSection('home'); // Default to home on load

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(section);
            }
          },
          { threshold: 0.2, rootMargin: '-50px 0px -50px 0px' }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const linkClasses = (section: string) =>
    `text-sm font-medium ${
      activeSection === section ? 'text-purple-600 font-bold' : 'text-slate-600'
    } hover:text-slate-900`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-slate-900">
          <Image
            src="/ms18logo.svg"
            alt="Computer Servicing"
            width={60}
            height={60}
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#home" className={linkClasses('home')}>
              Home
            </Link>
            <Link href="/#services" className={linkClasses('services')}>
              Services
            </Link>
            <Link href="/#about" className={linkClasses('about')}>
              About
            </Link>
            <Link href="/#contact" className={linkClasses('contact')}>
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-50"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-50"
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6l-2-2H1" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
