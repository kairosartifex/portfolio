import { BRAND } from '@/lib/constants';
import AsciiTextReveal from '@/components/AsciiTextReveal';

export default function ContactFooter() {

  return (
    <section 
      className="relative w-full h-screen px-10 max-md:px-6 pb-12 max-md:pb-8 pt-24 flex flex-col justify-between font-secondary text-[0.85rem]" 
      id="contact"
    >
      {/* Centered container with max-w matching the page grid content width */}
      <div className="flex-1 flex items-center w-full max-w-6xl mx-auto">
        <h2 className="w-full flex flex-col uppercase leading-[0.95] tracking-tight text-left text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-primary font-light text-foreground m-0 select-none">
          {/* Line 1: Let's (Left) and Create (Right) */}
          <div className="flex justify-between w-full">
            <span>Let&apos;s</span>
            <span>Create</span>
          </div>
          {/* Line 2: Something (Left aligned, slightly indented like reference) */}
          <div className="text-left pl-8 max-md:pl-0">
            <span>Something</span>
          </div>
          {/* Line 3: Remarkable. (Right aligned) */}
          <div className="text-right">
            <span>Remarkable.</span>
          </div>
        </h2>
      </div>

      {/* Bottom footer rows (Row-by-Row Layout matching reference screenshot) */}
      <div className="w-full border-t border-dotted border-border-muted/30 pt-8 mt-auto flex flex-col gap-2 font-tertiary tracking-wider text-[0.8rem] uppercase select-none">
        {/* Row 1: Email (Left) & Social Links (Right) */}
        <div className="flex justify-between items-center w-full max-md:flex-col max-md:items-start max-md:gap-4">
          <a
            href={`mailto:${BRAND.email}`}
            className="border border-dotted border-transparent hover:border-foreground px-1.5 py-1 transition-all duration-300 text-left outline-none -ml-1.5"
          >
            <AsciiTextReveal text={BRAND.email} />
          </a>

          <div className="flex gap-4 text-right max-md:text-left items-center">
            <a
              href={BRAND.socials.dribbble}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dotted border-transparent hover:border-foreground px-1.5 py-1 transition-all duration-300 outline-none"
            >
              <AsciiTextReveal text="Dribbble" />
            </a>
            <a
              href={BRAND.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dotted border-transparent hover:border-foreground px-1.5 py-1 transition-all duration-300 outline-none"
            >
              <AsciiTextReveal text="Instagram" />
            </a>
            <a
              href={BRAND.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dotted border-transparent hover:border-foreground px-1.5 py-1 transition-all duration-300 outline-none -mr-1.5 max-md:mr-0"
            >
              <AsciiTextReveal text="Twitter/X" />
            </a>
          </div>
        </div>

        {/* Row 2: Copyright (Left) & Space for Globe Widget (Right) */}
        <div className="flex justify-between items-center w-full pt-4">
          <span className="text-muted/65 text-left">
            {BRAND.name} (C) 2026
          </span>
        </div>
      </div>

      {/* SEO: location-based content for local search queries */}
      <p className="sr-only">
        Kairos Artifex is a creative agency and design studio based in Mumbai, India. Contact us for UI/UX design, web development, branding, graphic design, video editing, and creative development services. Email: kairosartifex@gmail.com.
      </p>
    </section>
  );
}
