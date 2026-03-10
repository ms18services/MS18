'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (

    //about us
    <section id="about" className=" border-t border-slate-100 bg-white scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 ">
          <div className="grid  grid-cols-[1fr_10fr] gap-1 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-blue-50 px-1 py-1">
            <div className="font-bold translate-x-[-20px] h-[21em] w-full bg-gradient-to-r from-[#4873FF] via-[#1629A6] to-[#142699] via-30%  to-100% bg-clip-text text-transparent">
              <h2 className="text-[10em]  -tracking-[10px] ">About</h2>            
              <h2 className="text-[10em]  -tracking-[10px] leading-[0.2] ml-70">Us.</h2>
                {/* Image left */}
           <div className="relative w-full h-[500px] overflow-hidden  bottom-30 ">
                 <img 
                        src="/about-imageleft.png" 
                        className="absolute left-0 bottom-0 h-full object-contain  [clip-path:inset(0_0_50px_0)]"
                        />
              </div>
            </div>

            <div>

                {/* Image right */}
            <div className=" rounded-[20px] bg-purple-500 h-40   max-w-2xl text-slate-600 mt-28">
                    <div className="rounded-[20px] w-full h-40 bg-purple-500 overflow-hidden">
                        <img 
                        src="/about-image.jpg" 
                        className="w-full h-full object-cover"
                        />
                    </div>
            </div>
                {/* text right */}
           <div className=" grid grid-cols-2 gap-10 h-80  max-w-2xl text-slate-600 mt-6">
             <h1 className="text-justify text-[0.9em]">
              We provide reliable computer repair services focused on fixing broken components, replacing faulty parts, and restoring your device’s performance. Our goal is to deliver honest, efficient solutions that keep your technology running smoothly, whether for work, study, or everyday use.
             </h1>

             <p className="text-justify text-[0.9em]">
                We provide reliable computer repair services focused on fixing broken components, replacing faulty parts, and restoring your device’s performance. Our goal is to deliver honest, efficient solutions that keep your technology running smoothly, whether for work, study, or everyday use.
             </p>


            </div> 

</div>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-2">
              <p className="text-sm leading-7 text-slate-600">
                Welcome to Computer Servicing, your trusted partner for all your computer repair and maintenance needs. With over 10 years of experience in the industry, we have helped thousands of customers keep their devices running smoothly.
              </p>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                Our team focuses on practical solutions: clear diagnostics, honest recommendations, and quality parts. Whether you need a quick tune-up or a full system rebuild, we’ve got you covered.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"> <h3 className="text-sm font-semibold text-slate-900">Why choose us</h3> <ul className="mt-4 list-disc list-inside text-sm text-slate-600">
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
  );
}






