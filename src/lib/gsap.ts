'use client';

import {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  Draggable,
  MotionPathPlugin,
  Flip,
  Observer,
} from 'gsap/all';

// Register all plugins that ship with the public NPM `gsap` package.
// (Bonus/Club GreenSock plugins are not included here.)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable, MotionPathPlugin, Flip, Observer);
}

export { gsap, ScrollTrigger, ScrollToPlugin, Draggable, MotionPathPlugin, Flip, Observer };
