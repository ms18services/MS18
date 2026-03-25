'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const adminHref = status === 'authenticated' && session ? '/admin' : '/admin/login';

  const scrollToSection = (section: string) => (e: React.MouseEvent) => {
  if (pathname !== '/') return;
  e.preventDefault();

  const element = document.getElementById(section);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

  useEffect(() => {
    const sections = ['home', 'services', 'about', 'contact'];
    const observers: IntersectionObserver[] = [];

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
      pathname === '/' && activeSection === section ? 'text-purple-600 font-bold' : 'text-slate-600'
    } hover:text-slate-900`;

  const routeLinkClasses = (href: string) =>
    `text-sm font-medium ${pathname === href ? 'text-purple-600 font-bold' : 'text-slate-600'} hover:text-slate-900`;

  const scrollToTopIfOnRoute = (href: string) => (e: React.MouseEvent) => {
    if (pathname !== href) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="h-18 sticky top-0 z-50 bg-white/50 backdrop-blur border-slate-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex group items-center gap-3 font-semibold tracking-tight text-slate-900">
          <div className=' opacity-100 cursor-default group-hover:hidden absolute z-19 translate-y-4 -translate-x-6.5 transition-opacity  duration-500'>
          <Image
            src="/ms18logo.svg"
            alt="Computer Servicing"
            width={100}
            height={100}
            priority
          />
          </div>

          <div className='opacity-0 cursor-default group-hover:opacity-100 absolute z-20 translate-y-4 -translate-x-6.5 transition-opacity duration-500'>
            <Image
              src="/ms18logofull.svg"
              alt="Computer Servicing"
              width={100}
              height={100}
              priority
            />
          </div>

        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#home" onClick={scrollToSection("home")} className={linkClasses("home")}>
              Home
            </Link>

            <Link href="/#services" onClick={scrollToSection("services")} className={linkClasses("services")}>
              Services
            </Link>

            <Link href="/#about" onClick={scrollToSection("about")} className={linkClasses("about")}>
              About
            </Link>

          <Link href="/journal" onClick={scrollToTopIfOnRoute('/journal')} className={routeLinkClasses("/journal")}>
              Blog
            </Link>

            <Link href="/#contact" onClick={scrollToSection("contact")} className={linkClasses("contact")}>
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
            <Link
              href={adminHref}
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[#2F2F2F]"
              aria-label="Admin"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-slate-700 transition-colors duration-200 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
