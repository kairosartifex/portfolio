import Link from 'next/link';
import Header from '@/components/Header';
import FooterWidgets from '@/components/FooterWidgets';
import InteractiveGrid from '@/components/InteractiveGrid';
import ShaderBackground from '@/components/ShaderBackground';
import NotFoundClient from '@/components/NotFoundClient';
import { BRAND, SITE_URL } from '@/lib/constants';
import { caseStudies } from '@/lib/data/work';

export default function NotFound() {
  return (
    <div className="page-content-wrapper flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background WebGL Shader Waves & Pixel mouse trail */}
      <ShaderBackground />

      {/* Interactive dotted grid overlay */}
      <InteractiveGrid />

      {/* Site Navigation Header */}
      <Header />

      {/* Bottom corner widgets */}
      <FooterWidgets />

      {/* Main scroll content */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-between">
        <section
          className="relative w-full h-dvh max-md:h-screen px-10 max-md:px-6 py-24 max-md:pt-28 max-md:pb-16 box-border overflow-hidden flex flex-col justify-between"
          id="hero"
        >
          {/* Info row at top matching site grid placement */}
          <div className="absolute top-0 left-10 right-10 max-md:relative max-md:left-auto max-md:right-auto max-md:top-auto pt-24 max-md:pt-0 grid grid-cols-12 max-md:flex max-md:flex-col gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
            <div className="col-span-4 font-primary font-medium text-lg leading-tight text-foreground uppercase max-md:hidden">
              <span className="text-accent font-mono text-[0.8rem] block mb-1">// ERROR 404</span>
              Route Not Found
            </div>
            <div className="col-start-5 col-span-4 text-muted max-md:hidden">
              <span className="text-foreground/80 font-mono text-[0.8rem] block mb-1">STATUS</span>
              Digital Vacuum / Out of Bounds
            </div>
            <div className="col-start-9 col-span-4 text-muted max-md:w-full">
              The requested resource could not be located in this matrix. Verify the URL or return to known coordinates.
            </div>
          </div>

          {/* Huge display headline matching HeroSection */}
          <div className="absolute bottom-24 left-10 right-10 max-md:relative max-md:bottom-auto max-md:left-auto max-md:right-auto flex flex-col gap-8">
            <h1 className="font-primary text-[clamp(3rem,10vw,9rem)] max-md:text-[3.5rem] font-light uppercase leading-[0.9] tracking-tight m-0 select-none text-foreground">
              404.
              <br />
              Page Not Found.
            </h1>

            {/* Action buttons - client component for onClick handler */}
            <NotFoundClient />
          </div>
        </section>

        {/* Agent-readable recovery content (hidden visually, visible to crawlers/agents) */}
        <section className="sr-only" aria-label="404 recovery links for agents">
          <h2>Page Not Found - 404</h2>
          <p>
            The requested page does not exist on {BRAND.name} ({SITE_URL}).
            Below are valid pages and machine-readable resources to help you navigate.
          </p>
          <h3>Machine-Readable Resources</h3>
          <ul>
            <li><Link href="/sitemap.xml">Sitemap (XML)</Link></li>
            <li><Link href="/llms.txt">llms.txt - LLM-optimized summary</Link></li>
            <li><Link href="/llms-full.txt">llms-full.txt - Full context for AI agents</Link></li>
            <li><Link href="/robots.txt">robots.txt</Link></li>
          </ul>
          <h3>Valid Pages</h3>
          <ul>
            <li><Link href="/">Homepage - {BRAND.positioning}</Link></li>
            <li><Link href="/about">About {BRAND.name}</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            {caseStudies.map((study) => (
              <li key={study.slug}>
                <Link href={`/work/${study.slug}`}>{study.title} - {study.description.slice(0, 120)}…</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
