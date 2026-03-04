import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist_Mono, M_PLUS_2 } from "next/font/google";
import "./globals.css";

const mPlus2 = M_PLUS_2({
  variable: "--font-mplus-2",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Computer Servicing",
  description: "Professional computer repair, maintenance, and upgrade services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mPlus2.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
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
                <Link href="/#home" className="text-sm font-medium text-slate-600 hover:text-slate-900">Home</Link>
                <Link href="/#services" className="text-sm font-medium text-slate-600 hover:text-slate-900">Services</Link>
                <Link href="/#about" className="text-sm font-medium text-slate-600 hover:text-slate-900">About</Link>
                <Link href="/#contact" className="text-sm font-medium text-slate-600 hover:text-slate-900">Contact</Link>
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

        <main className="min-h-[calc(100vh-80px)] bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
