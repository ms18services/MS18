'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomeSmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const servicesRangeRef = useRef<{ top: number; bottom: number } | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    gsap.registerPlugin(ScrollTrigger);

    let rafId: number | null = null;
    let current = 0;
    let target = 0;

    const computeServicesRange = () => {
      const el = document.getElementById('services');
      if (!el) {
        servicesRangeRef.current = null;
        return;
      }

      const rect = el.getBoundingClientRect();
      const top = rect.top + (window.scrollY || window.pageYOffset || 0);
      const bottom = top + rect.height;
      servicesRangeRef.current = { top, bottom };
    };

    const setBodyHeight = () => {
      document.body.style.height = `${content.scrollHeight}px`;
    };

    const update = () => {
      const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);
      target = Math.min(maxScroll, window.scrollY || window.pageYOffset || 0);

      const servicesRange = servicesRangeRef.current;
      const insideServices = servicesRange ? target >= servicesRange.top && target <= servicesRange.bottom : false;

      if (insideServices) {
        // Disable smoothing in Services section so it feels like native scroll
        current = target;
      } else {
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.1) current = target;
      }

      gsap.set(content, { y: -current, force3D: true });
      ScrollTrigger.update();
      rafId = window.requestAnimationFrame(update);
    };

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === 'number') {
          window.scrollTo(0, value);
        }
        return window.scrollY || window.pageYOffset || 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        } as DOMRect;
      },
      pinType: 'transform',
    });

    const onResize = () => {
      setBodyHeight();
      computeServicesRange();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize, { passive: true });

    ScrollTrigger.addEventListener('refreshInit', setBodyHeight);
    ScrollTrigger.addEventListener('refreshInit', computeServicesRange);

    const ro = new ResizeObserver(() => {
      setBodyHeight();
      computeServicesRange();
      ScrollTrigger.refresh();
    });
    ro.observe(content);

    computeServicesRange();
    setBodyHeight();
    ScrollTrigger.refresh();
    rafId = window.requestAnimationFrame(update);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.removeEventListener('refreshInit', setBodyHeight);
      ScrollTrigger.removeEventListener('refreshInit', computeServicesRange);
      ro.disconnect();
      ScrollTrigger.scrollerProxy(document.body, {} as any);
      document.body.style.height = '';
      gsap.set(content, { clearProps: 'transform' });
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
