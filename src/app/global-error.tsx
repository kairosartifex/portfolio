'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import localFont from 'next/font/local';
import './globals.css';
import ShaderBackground from '@/components/ShaderBackground';
import InteractiveGrid from '@/components/InteractiveGrid';
import Header from '@/components/Header';
import FooterWidgets from '@/components/FooterWidgets';
import AsciiTextReveal from '@/components/AsciiTextReveal';

const layGrotesk = localFont({
  src: [
    { path: "../../public/fonts/laygrotesk-trial-regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/laygrotesk-trial-medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/laygrotesk-trial-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-primary",
  display: "swap",
});

const spaceMono = localFont({
  src: "../../public/fonts/SpaceMono-Regular.ttf",
  variable: "--font-secondary",
  display: "swap",
});

const tronicaMono = localFont({
  src: "../../public/fonts/Tronica-Mono.otf",
  variable: "--font-tertiary",
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error('Critical root layout exception:', error);
  }, [error]);

  const handleRetry = () => {
    if (typeof unstable_retry === 'function') {
      unstable_retry();
    } else if (typeof reset === 'function') {
      reset();
    }
  };

  const dottedBtnClasses =
    'relative border border-dotted border-foreground/40 hover:border-foreground focus-visible:border-foreground px-5 py-3 cursor-pointer transition-all duration-300 ease-out select-none outline-none uppercase text-[0.85rem] font-secondary tracking-wider inline-flex items-center gap-2 text-foreground group';

  return (
    <html
      lang="en"
      className={`${layGrotesk.variable} ${spaceMono.variable} ${tronicaMono.variable} antialiased js-enabled ready`}
    >
      <body className="min-h-screen bg-background text-foreground font-primary">
        <div className="page-content-wrapper flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
          {/* WebGL Hero Gradient Shader Background */}
          <ShaderBackground />

          {/* Dotted Grid Overlay */}
          <InteractiveGrid />

          {/* Navigation Header */}
          <Header />

          {/* Footer Widgets */}
          <FooterWidgets />

          <main className="relative z-10 w-full flex-1 flex flex-col justify-between">
            <section
              className="relative w-full h-dvh max-md:h-screen px-10 max-md:px-6 py-24 max-md:pt-28 max-md:pb-16 box-border overflow-hidden flex flex-col justify-between"
              id="hero"
            >
              {/* Info row */}
              <div className="absolute top-0 left-10 right-10 max-md:relative max-md:left-auto max-md:right-auto max-md:top-auto pt-24 max-md:pt-0 grid grid-cols-12 max-md:flex max-md:flex-col gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
                <div className="col-span-4 font-primary font-medium text-lg leading-tight text-foreground uppercase max-md:hidden">
                  <span className="text-accent font-mono text-[0.8rem] block mb-1">// CRITICAL ERROR</span>
                  Global Layout Exception
                </div>
                <div className="col-start-5 col-span-4 text-muted max-md:hidden">
                  <span className="text-foreground/80 font-mono text-[0.8rem] block mb-1">DIGEST</span>
                  {error.digest ? error.digest : 'ROOT_LAYOUT_FAILURE'}
                </div>
                <div className="col-start-9 col-span-4 text-muted max-md:w-full">
                  A root layout error was encountered. Recover execution or navigate back to the main homepage.
                </div>
              </div>

              {/* Headline display */}
              <div className="absolute bottom-24 left-10 right-10 max-md:relative max-md:bottom-auto max-md:left-auto max-md:right-auto flex flex-col gap-8">
                <h1 className="font-primary text-[clamp(3rem,10vw,9rem)] max-md:text-[3.5rem] font-light uppercase leading-[0.9] tracking-tight m-0 select-none text-foreground">
                  Critical.
                  <br />
                  System Error.
                </h1>

                {/* Buttons matching site text/button link aesthetic */}
                <div className="flex flex-wrap gap-4 items-center pt-2">
                  <button onClick={handleRetry} className={dottedBtnClasses}>
                    <span className="text-accent group-hover:rotate-180 transition-transform duration-500">↻</span>
                    <AsciiTextReveal text="Try Again" />
                  </button>
                  <Link href="/" className={`${dottedBtnClasses} bg-transparent text-muted hover:text-foreground`}>
                    <AsciiTextReveal text="Return to Homepage" />
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
