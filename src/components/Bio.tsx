'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignatureSVG from './SignatureSVG';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Bio() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const maskEl = svgEl.querySelector('#sig-mask');
    if (!maskEl) return;

    const paths = maskEl.querySelectorAll<SVGPathElement>('.sig-path');
    
    // Set dash offset properties natively
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
    });

    // Create GSAP ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgEl,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    paths.forEach((path, idx) => {
      const delay = idx === 0 ? 0 : idx === 1 ? 0.45 : 1.45;
      const duration = idx === 0 ? 0.75 : idx === 1 ? 1.15 : 0.2;

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: duration,
          ease: 'power1.inOut',
        },
        delay
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="bio-section grid grid-cols-12 max-md:flex max-md:flex-col items-center gap-8 py-24 max-md:py-16 px-10 max-md:px-6 w-full">
      {/* Signature container */}
      <div className="col-span-4 max-md:w-[60%] max-md:mx-auto relative w-full">
        <SignatureSVG ref={svgRef} className="w-full h-auto" />
      </div>
      {/* Text block container */}
      <div className="col-span-8 flex flex-col gap-8 w-full">
        <p className="text-[clamp(1.8rem,3.8vw,3.5rem)] max-md:text-[1.8rem] font-medium leading-[1.1] tracking-tight text-foreground select-none">
          We design brands, build digital products, and engineer experiences that are simple, purposeful, and memorable.
        </p>
        {/* SEO: keyword-rich description for search engine crawlers */}
        <p className="sr-only">
          Kairos Artifex is a premium creative agency and design studio offering UI/UX design services, web development, branding and brand identity design, graphic design, video editing, motion design, and creative development. We serve startups, SaaS companies, AI companies, founders, and growing brands worldwide from Mumbai, India.
        </p>
      </div>
    </section>
  );
}
