'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section 
      className="relative w-full h-dvh max-md:h-screen px-10 max-md:px-6 py-24 max-md:pt-28 max-md:pb-16 box-border overflow-hidden flex flex-col justify-between" 
      id="hero"
    >
      {/* Huge title: flows first on mobile, absolutely positioned at bottom on desktop */}
      <h1 className="absolute bottom-16 left-10 right-10 max-md:relative max-md:bottom-auto max-md:left-auto max-md:right-auto font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-light uppercase leading-[0.95] tracking-tight m-0 select-none text-foreground">
        Ideas.
        <br />
        Designed to Last.
        <br />
        Built to Scale.
      </h1>

      {/* Info row: absolute at top on desktop, flows second on mobile at bottom of flex container */}
      <div className="absolute top-0 left-10 right-10 max-md:relative max-md:left-auto max-md:right-auto max-md:top-auto pt-24 max-md:pt-0 grid grid-cols-12 max-md:flex max-md:flex-col gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
        <span className="col-span-4 font-primary font-medium text-lg leading-tight text-foreground max-md:hidden">
          Design &amp;<br />
          Development
        </span>
        <span className="col-start-5 col-span-4 text-muted max-md:hidden">
          Building brands.
          <br />
          Engineering experiences.
        </span>
        <span className="col-start-9 col-span-4 text-muted max-md:w-full">
          We create thoughtful digital products, memorable brand identities, and
          scalable technology that help ambitious businesses stand out.
        </span>
      </div>
    </section>
  );
}
