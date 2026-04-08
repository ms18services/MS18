"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrambleTextPlugin, ScrollTrigger);

type TextAnimationProps = {
  target: React.RefObject<HTMLElement | null>;
  onComplete?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
};

export function TextAnimation({ target, onComplete, onEnter, onLeave }: TextAnimationProps) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;

    let split: SplitText | null = null;
    let tl: gsap.core.Timeline | null = null;
    let st: ScrollTrigger | null = null;
    let cancelled = false;
    let completed = false;

    const rafId = window.requestAnimationFrame(() => {
      if (cancelled) return;

      split = new SplitText(el, { type: "words", wordsClass: "split-word" });

      for (const word of split.words as HTMLElement[]) {
        const parent = word.parentElement;
        if (!parent) continue;

        const bgImage = window.getComputedStyle(parent).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          word.style.backgroundImage = bgImage;
          word.style.backgroundClip = 'text';
          (word.style as any).webkitBackgroundClip = 'text';
          word.style.color = 'transparent';
          (word.style as any).webkitTextFillColor = 'transparent';
        }
      }

      tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (completed) return;
          completed = true;
          onComplete?.();
        },
      });

      tl.from(split.words, {
        y: -80,
        opacity: 0,
        rotation: "random(-80, 80)",
        duration: 0.7,
        ease: "back",
        stagger: 0.15,
      });

      st = ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 25%",
        onEnter: () => {
          tl?.play();
          onEnter?.();
        },
        onLeave: () => {
          tl?.reverse();
          onLeave?.();
        },
        onEnterBack: () => {
          tl?.play();
          onEnter?.();
        },
        onLeaveBack: () => {
          tl?.reverse();
          onLeave?.();
        },
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);

      if (st) st.kill();
      if (tl) tl.kill();
      if (split) split.revert();
    };
  }, [target, onComplete, onEnter, onLeave]);

  return null;
}