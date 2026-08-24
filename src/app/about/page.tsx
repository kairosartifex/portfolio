import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, SITE_URL } from "@/lib/constants";
import Header from "@/components/Header";
import ShaderBackground from "@/components/ShaderBackground";
import InteractiveGrid from "@/components/InteractiveGrid";
import FooterWidgets from "@/components/FooterWidgets";

export const metadata: Metadata = {
  title: `About ${BRAND.name}`,
  description: `${BRAND.name} is a ${BRAND.category.toLowerCase()} based in ${BRAND.location.city}, ${BRAND.location.country}. ${BRAND.positioning} Learn about our team, services, and approach.`,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `About ${BRAND.name}`,
    description: `${BRAND.category}. ${BRAND.positioning}`,
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
  };

  return (
    <div className="page-content-wrapper flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <ShaderBackground />
      <InteractiveGrid />
      <Header />
      <FooterWidgets />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="relative z-10 w-full flex-1 px-10 max-md:px-6 py-36">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-16 text-[0.8rem] font-secondary uppercase tracking-wider text-muted select-none"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <span>/</span>
            <li className="text-foreground truncate" aria-current="page">About</li>
          </ol>
        </nav>

        {/* Page header */}
        <section className="relative w-full flex flex-col justify-between mb-24 select-none">
          <div className="w-full grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
            <div className="col-span-4 flex flex-col gap-1">
              <span className="font-primary font-medium text-lg leading-tight text-foreground uppercase">
                About
              </span>
              <span className="text-muted uppercase font-mono text-[0.8rem]">Who We Are</span>
            </div>
            <div className="col-start-5 col-span-4 flex flex-col gap-1.5">
              <span className="font-primary text-[0.9rem] text-foreground font-medium uppercase tracking-wider">
                Location
              </span>
              <span className="text-muted text-[0.85rem]">
                {BRAND.location.city}, {BRAND.location.region}, {BRAND.location.country}
              </span>
            </div>
            <div className="col-start-9 col-span-4 text-muted text-[0.9rem] leading-relaxed font-primary">
              {BRAND.positioning} We design brands, build digital products, and engineer experiences that are simple, purposeful, and memorable.
            </div>
          </div>

          <h1 className="w-full font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-light uppercase leading-[0.95] tracking-tight m-0 mt-20 select-none text-foreground">
            {BRAND.name}
          </h1>
        </section>

        {/* Content sections */}
        <div className="grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-12 mt-16">
          {/* Agency overview */}
          <div className="col-span-8 col-start-1 max-md:col-span-12">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              The Agency
            </h2>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary mb-6">
              {BRAND.name} is a {BRAND.category.toLowerCase()} based in {BRAND.location.city}, {BRAND.location.country}.
              We work with {BRAND.verticals.join(', ').toLowerCase()} - delivering end-to-end creative
              solutions from brand strategy through to production-ready code. Our approach eliminates the
              friction between design and engineering by keeping both disciplines under one roof.
            </p>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary">
              Every project starts with strategy. We research the market, understand the audience, and define
              a clear direction before any pixel is placed or line of code is written. This ensures that what
              we build is not just visually compelling, but purposeful and measurable.
            </p>
          </div>

          {/* Disciplines list */}
          <div className="col-span-4 col-start-9 max-md:col-span-12">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Disciplines
            </h2>
            <ul className="flex flex-col gap-2 text-muted text-[0.85rem] font-mono">
              {BRAND.disciplines.map((d) => (
                <li key={d} className="border-b border-dotted border-border-muted/20 pb-2">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Founders section */}
        <div className="grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-8 mt-32">
          <div className="col-span-12">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-10">
              Founders
            </h2>
          </div>
          {BRAND.founders.map((founder, idx) => (
            <div key={founder.name} className={`col-span-6 max-md:col-span-12 ${idx === 1 ? 'col-start-7' : ''}`}>
              <h3 className="font-primary text-lg font-medium text-foreground mb-2">
                {founder.name}
              </h3>
              <p className="text-muted text-[0.85rem] font-mono uppercase tracking-wider mb-4">
                {founder.roles.join(' · ')}
              </p>
              <div className="flex gap-4 text-[0.8rem] font-secondary uppercase">
                <a
                  href={founder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-foreground transition-colors"
                >
                  Website
                </a>
                <a
                  href={founder.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-dotted border-border-muted/30 pt-8 mt-32 flex justify-between items-center font-secondary text-[0.8rem] uppercase">
          <Link href="/" className="text-accent hover:text-foreground transition-colors font-mono tracking-wider">
            ← Return to Homepage
          </Link>
          <span className="text-muted/50 font-mono text-[0.75rem]">
            {BRAND.name} (C) 2026
          </span>
        </footer>
      </main>
    </div>
  );
}
