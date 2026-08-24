import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/data/work";
import { BRAND, SITE_URL } from "@/lib/constants";
import Header from "@/components/Header";
import ShaderBackground from "@/components/ShaderBackground";
import ScrollDeformedCanvas from "@/components/ScrollDeformedCanvas";
import InteractiveGrid from "@/components/InteractiveGrid";
import FooterWidgets from "@/components/FooterWidgets";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return {};
  }

  const title = `${study.title} | ${BRAND.name} Case Study`;
  const description = study.description;
  const canonicalUrl = `${SITE_URL}/work/${study.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: `${SITE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": study.title,
        "item": `${SITE_URL}/work/${study.slug}`
      }
    ]
  };

  // Article / Product Schema (demonstrates EEAT & Experience)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": study.title,
    "description": study.description,
    "publisher": {
      "@type": "Organization",
      "name": BRAND.name,
      "logo": `${SITE_URL}/icon.png`
    },
    "author": {
      "@type": "Organization",
      "name": BRAND.name
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/work/${study.slug}`
    }
  };

  return (
    <div className="page-content-wrapper flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
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

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Main scroll content */}
      <main className="relative z-10 w-full flex-1 px-10 max-md:px-6 py-36">
        {/* Breadcrumb Navigation at the top */}
        <nav aria-label="Breadcrumb" className="mb-16 text-[0.8rem] font-secondary uppercase tracking-wider text-muted select-none">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <span>/</span>
            <li className="text-foreground truncate" aria-current="page">
              {study.title}
            </li>
          </ol>
        </nav>

        {/* Project Hero Header (Placements match HeroSection / ContactFooter style) */}
        <section className="relative w-full flex flex-col justify-between mb-24 select-none">
          {/* Info row */}
          <div className="w-full grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
            {/* Column 1: Date & Year */}
            <div className="col-span-4 flex flex-col gap-1">
              <span className="font-primary font-medium text-lg leading-tight text-foreground uppercase">
                {study.year}
              </span>
              <span className="text-muted uppercase font-mono text-[0.8rem]">{study.date}</span>
            </div>
            
            {/* Column 2: Client / Project URL */}
            <div className="col-start-5 col-span-4 flex flex-col gap-1.5">
              <span className="font-primary text-[0.9rem] text-foreground font-medium uppercase tracking-wider">
                Project Link
              </span>
              {study.links ? (
                study.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-foreground transition-colors text-[0.85rem]"
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                <a
                  href={study.projectUrl.startsWith('http') ? study.projectUrl : `https://${study.projectUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline hover:text-foreground transition-colors text-[0.85rem]"
                >
                  dribble
                </a>
              )}
            </div>

            {/* Column 3: Description paragraph */}
            <div className="col-start-9 col-span-4 text-muted text-[0.9rem] leading-relaxed font-primary">
              {study.description}
            </div>
          </div>

          {/* Massive Title at the bottom of the section */}
          <h1 className="w-full font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-light uppercase leading-[0.95] tracking-tight m-0 mt-20 select-none text-foreground">
            {study.title}
          </h1>
        </section>

        {/* Project Images Bento Grid (hooks into ScrollDeformedCanvas) */}
        <div className="grid grid-cols-12 gap-10 max-md:gap-6 mt-16">
          {study.images.map((image, idx) => (
            <article key={idx} className={image.gridClass}>
              <div className="group block w-full">
                <div className="relative w-full aspect-[1.5] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="scroll-deformed-image object-cover transition-all duration-500 ease-out"
                    data-src={image.src}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center text-[0.85rem] uppercase font-secondary">
                  <span className="font-medium tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
                    {image.title}
                  </span>
                  <span className="font-mono text-muted">{image.year}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Project Page Footer (incorporating the moved Metadata and return links) */}
        <footer className="w-full border-t border-dotted border-border-muted/30 pt-8 mt-32 flex flex-col gap-8 font-secondary text-[0.8rem] uppercase">
          {/* Row 1: Metadata details */}
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 text-muted">
            <div>
              <span className="font-mono text-muted/65 mr-2">LAST UPDATED:</span>
              <span className="text-foreground font-medium">{study.metadata.lastUpdated}</span>
            </div>
            <div>
              <span className="font-mono text-muted/65 mr-2">DIMENSIONS:</span>
              <span className="text-foreground font-medium">{study.metadata.dimensions}</span>
            </div>
            <div>
              <span className="font-mono text-muted/65 mr-2">CHARACTERS:</span>
              <span className="text-foreground font-medium">{study.metadata.characters}</span>
            </div>
          </div>

          {/* Row 2: Links Columns */}
          <div className="flex justify-between items-start pt-6 border-t border-dotted border-border-muted/20 max-md:flex-col max-md:gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-muted/65 mb-1">PROJECT LINKS</span>
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <Link href="/#work" className="hover:text-accent transition-colors">Work</Link>
              <Link href="/#contact" className="hover:text-accent transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="font-mono text-muted/65 mb-1">CONNECT</span>
              <a href="https://x.com/kairosartifex" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter/X</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
              <a href="https://figma.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Figma</a>
            </div>
          </div>

          {/* Row 3: Return Back to Homepage and Copyright */}
          <div className="flex justify-between items-center pt-8 border-t border-dotted border-border-muted/20">
            <Link href="/" className="text-accent hover:text-foreground transition-colors font-mono tracking-wider">
              ← Return to Homepage
            </Link>
            <span className="text-muted/50 font-mono text-[0.75rem]">
              {BRAND.name} (C) 2026
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
