import type { Metadata } from "next";
import { Geist_Mono, M_PLUS_2, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Providers from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("bg-white", "font-sans", inter.variable)}>
      <body className={`${mPlus2.variable} ${geistMono.variable} antialiased bg-white text-slate-900 overflow-x-hidden`}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-80px)] bg-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
