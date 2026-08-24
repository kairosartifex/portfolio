'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Scroll to top on every route change (works with Lenis smooth scroll)
  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis as Lenis | undefined;
    if (lenis) lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,             // Increased from 0.04 - snappier, removes perceived lag
      wheelMultiplier: 0.9,  // Increased from 0.5 - natural scroll distance per tick
      touchMultiplier: 1.8,  // Balanced touch multiplier for responsive but controlled touch scrolling
      smoothWheel: true,
      syncTouch: true,       // Mimics touch device scroll while allowing for scroll synchronization
      syncTouchLerp: 0.1,    // Slightly increased from 0.075 for more responsive touch inertia
      autoRaf: false,        // Rely on GSAP ticker RAF loop to prevent double scroll/render updates
    });

    // Connect Lenis scroll to ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Expose lenis globally for external component control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis = lenis;

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Sync Lenis animation frame updates with GSAP ticker
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).lenis = undefined;
      gsap.ticker.remove(tick);
    };
  }, []);

  return <>{children}</>;
}
