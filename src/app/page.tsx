import Header from '@/components/Header';
import FooterWidgets from '@/components/FooterWidgets';
import InteractiveGrid from '@/components/InteractiveGrid';
import ShaderBackground from '@/components/ShaderBackground';
import ScrollDeformedCanvas from '@/components/ScrollDeformedCanvas';

import HeroSection from '@/components/HeroSection';
import Bio from '@/components/Bio';
import WorkGrid from '@/components/WorkGrid';
import CursorShowcase from '@/components/CursorShowcase';
import ContactFooter from '@/components/ContactFooter';

import { BRAND, SITE_URL } from '@/lib/constants';
import { caseStudies } from '@/lib/data/work';

export default function Home() {
  return (
    <div className="page-content-wrapper flex flex-col min-h-screen">
      {/* Background WebGL Shader Waves & Pixel mouse trail */}
      <ShaderBackground />

      {/* WebGL scroll image deformation canvas */}
      <ScrollDeformedCanvas />

      {/* Interactive dotted grid overlay */}
      <InteractiveGrid />

      {/* Site Navigation Header */}
      <Header />

      {/* Bottom corner widgets (Clock, Coordinates, Globe) */}
      <FooterWidgets />

      {/* Main scroll content */}
      <main className="relative z-10 w-full flex-1">
        {/* Full-screen Hero from source */}
        <HeroSection />

        {/* Full-width interactive sections */}
        <Bio />
        <WorkGrid />

        {/* Full-width scroll sequence and footer */}
        <CursorShowcase />
        <ContactFooter />

        {/* Server-rendered structured content for AI crawlers and agents */}
        <section className="sr-only" aria-label="Kairos Artifex overview for agents">
          <h2>{BRAND.name} - {BRAND.category}</h2>
          <p>
            {BRAND.name} is a {BRAND.category.toLowerCase()} based in {BRAND.location.city}, {BRAND.location.region}, {BRAND.location.country}.
            {' '}{BRAND.positioning} We design brands, build digital products, and engineer experiences that are simple,
            purposeful, and memorable. Serving {BRAND.verticals.join(', ').toLowerCase()} worldwide.
          </p>

          <h3>Services &amp; Disciplines</h3>
          <ul>
            {BRAND.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <h3>Selected Work</h3>
          <ul>
            {caseStudies.map((study) => (
              <li key={study.slug}>
                <a href={`${SITE_URL}/work/${study.slug}`}>
                  {study.title} ({study.year}) - {study.description}
                </a>
              </li>
            ))}
          </ul>

          <h3>Founders</h3>
          <ul>
            {BRAND.founders.map((f) => (
              <li key={f.name}>
                {f.name} - {f.roles.join(', ')}. Website: <a href={f.website}>{f.website}</a>.
                GitHub: <a href={f.github}>{f.github}</a>.
              </li>
            ))}
          </ul>

          <h3>Contact</h3>
          <p>
            Email: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
            Based in {BRAND.location.city}, {BRAND.location.country}. Serving clients worldwide.
          </p>
          <ul>
            <li><a href={BRAND.socials.dribbble}>Dribbble</a></li>
            <li><a href={BRAND.socials.instagram}>Instagram</a></li>
            <li><a href={BRAND.socials.x}>Twitter/X</a></li>
          </ul>

          <h3>Machine-Readable Resources</h3>
          <ul>
            <li><a href={`${SITE_URL}/llms.txt`}>llms.txt</a></li>
            <li><a href={`${SITE_URL}/llms-full.txt`}>llms-full.txt</a></li>
            <li><a href={`${SITE_URL}/sitemap.xml`}>sitemap.xml</a></li>
          </ul>
        </section>
      </main>
    </div>
  );
}

