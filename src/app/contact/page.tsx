import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, SITE_URL } from "@/lib/constants";
import Header from "@/components/Header";
import ShaderBackground from "@/components/ShaderBackground";
import InteractiveGrid from "@/components/InteractiveGrid";
import FooterWidgets from "@/components/FooterWidgets";

export const metadata: Metadata = {
  title: `Contact ${BRAND.name}`,
  description: `Get in touch with ${BRAND.name}. Email ${BRAND.email} or connect via Dribbble, Instagram, and Twitter/X. Based in ${BRAND.location.city}, ${BRAND.location.country}, serving clients worldwide.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `Contact ${BRAND.name}`,
    description: `Reach out to discuss your next project. Based in ${BRAND.location.city}, serving clients worldwide.`,
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
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
            <li className="text-foreground truncate" aria-current="page">Contact</li>
          </ol>
        </nav>

        {/* Page header */}
        <section className="relative w-full flex flex-col justify-between mb-24 select-none">
          <div className="w-full grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
            <div className="col-span-4 flex flex-col gap-1">
              <span className="font-primary font-medium text-lg leading-tight text-foreground uppercase">
                Contact
              </span>
              <span className="text-muted uppercase font-mono text-[0.8rem]">Get in Touch</span>
            </div>
            <div className="col-start-5 col-span-4 flex flex-col gap-1.5">
              <span className="font-primary text-[0.9rem] text-foreground font-medium uppercase tracking-wider">
                Response Time
              </span>
              <span className="text-muted text-[0.85rem]">
                Within 24 hours
              </span>
            </div>
            <div className="col-start-9 col-span-4 text-muted text-[0.9rem] leading-relaxed font-primary">
              Have a project in mind? We would love to hear about it. Reach out through any of the channels below and we will get back to you promptly.
            </div>
          </div>

          <h1 className="w-full font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-light uppercase leading-[0.95] tracking-tight m-0 mt-20 select-none text-foreground">
            Let&apos;s Talk
          </h1>
        </section>

        {/* Contact details */}
        <div className="grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-12 mt-16">
          {/* Email - primary contact */}
          <div className="col-span-6 col-start-1 max-md:col-span-12">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Email
            </h2>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-foreground font-primary text-lg hover:text-accent transition-colors duration-300 border-b border-dotted border-border-muted/30 pb-2 inline-block"
            >
              {BRAND.email}
            </a>
            <p className="text-muted text-[0.85rem] leading-relaxed font-primary mt-4">
              For project inquiries, collaboration proposals, or general questions about our services.
              We review every message and respond within one business day.
            </p>
          </div>

          {/* Location */}
          <div className="col-span-4 col-start-9 max-md:col-span-12">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Location
            </h2>
            <p className="text-foreground font-primary text-lg mb-2">
              {BRAND.location.city}, {BRAND.location.region}
            </p>
            <p className="text-muted text-[0.85rem] font-mono uppercase tracking-wider">
              {BRAND.location.country}
            </p>
            <p className="text-muted text-[0.85rem] leading-relaxed font-primary mt-4">
              Based in Mumbai, serving clients worldwide. We collaborate remotely with teams across all time zones.
            </p>
          </div>
        </div>

        {/* Social links */}
        <div className="grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-8 mt-32">
          <div className="col-span-12">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-10">
              Connect
            </h2>
          </div>

          {[
            { name: 'Dribbble', url: BRAND.socials.dribbble, description: 'View our portfolio and design explorations.' },
            { name: 'Instagram', url: BRAND.socials.instagram, description: 'Behind-the-scenes process and project updates.' },
            { name: 'Twitter/X', url: BRAND.socials.x, description: 'Design thoughts, project launches, and industry commentary.' },
          ].map((social, idx) => (
            <div key={social.name} className={`col-span-4 max-md:col-span-12 ${idx > 0 ? `col-start-${idx * 4 + 1}` : ''}`}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-primary text-lg hover:text-accent transition-colors duration-300 block mb-2"
              >
                {social.name}
              </a>
              <p className="text-muted text-[0.85rem] leading-relaxed font-primary">
                {social.description}
              </p>
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
