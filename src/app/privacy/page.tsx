import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, SITE_URL } from "@/lib/constants";
import Header from "@/components/Header";
import ShaderBackground from "@/components/ShaderBackground";
import InteractiveGrid from "@/components/InteractiveGrid";
import FooterWidgets from "@/components/FooterWidgets";

export const metadata: Metadata = {
  title: `Privacy Policy`,
  description: `Privacy policy for ${BRAND.name}. Learn how we handle data, cookies, and third-party services on ${SITE_URL}.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: `Privacy Policy - ${BRAND.name}`,
    description: `How ${BRAND.name} handles your data and privacy.`,
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Privacy", item: `${SITE_URL}/privacy` },
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
            <li className="text-foreground truncate" aria-current="page">Privacy</li>
          </ol>
        </nav>

        {/* Page header */}
        <section className="relative w-full flex flex-col justify-between mb-24 select-none">
          <div className="w-full grid grid-cols-12 max-md:flex max-md:flex-col gap-10 max-md:gap-6 font-mono text-[0.85rem] leading-relaxed items-start select-none">
            <div className="col-span-4 flex flex-col gap-1">
              <span className="font-primary font-medium text-lg leading-tight text-foreground uppercase">
                Legal
              </span>
              <span className="text-muted uppercase font-mono text-[0.8rem]">Last Updated: August 2026</span>
            </div>
            <div className="col-start-9 col-span-4 text-muted text-[0.9rem] leading-relaxed font-primary">
              This policy describes how {BRAND.name} collects and uses information when you visit our website.
            </div>
          </div>

          <h1 className="w-full font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-light uppercase leading-[0.95] tracking-tight m-0 mt-20 select-none text-foreground">
            Privacy Policy
          </h1>
        </section>

        {/* Policy content */}
        <div className="max-w-3xl">
          <section className="mb-16">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Information We Collect
            </h2>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary mb-4">
              We use Vercel Analytics and Vercel Speed Insights to collect anonymous, aggregated usage data.
              This includes page views, referrer URLs, browser type, device type, country of origin, and
              page load performance metrics. No personally identifiable information is collected through these
              analytics services. We do not track individual users across sessions or across different websites.
            </p>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary">
              If you contact us via email at{' '}
              <a href={`mailto:${BRAND.email}`} className="text-accent hover:text-foreground transition-colors">
                {BRAND.email}
              </a>,
              we will retain your email address and message content solely for the purpose of responding to your inquiry
              and maintaining our business correspondence.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Cookies &amp; Local Storage
            </h2>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary">
              This site stores a single local storage value for your theme preference (dark or light mode).
              This preference is stored entirely in your browser and is never transmitted to our servers.
              No tracking cookies, advertising cookies, or third-party cookies are set by this website.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Third-Party Services
            </h2>
            <div className="flex flex-col gap-4">
              <div className="border-b border-dotted border-border-muted/20 pb-4">
                <span className="text-foreground font-mono text-[0.85rem] block mb-1">Vercel</span>
                <p className="text-muted text-[0.85rem] leading-relaxed font-primary">
                  Website hosting, edge delivery, analytics, and performance monitoring.
                  See{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-foreground transition-colors"
                  >
                    Vercel Privacy Policy
                  </a>.
                </p>
              </div>
              <div className="border-b border-dotted border-border-muted/20 pb-4">
                <span className="text-foreground font-mono text-[0.85rem] block mb-1">Google Fonts</span>
                <p className="text-muted text-[0.85rem] leading-relaxed font-primary">
                  Custom fonts are self-hosted on our domain. No requests are made to external font services.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Data Retention
            </h2>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary">
              Analytics data is retained in aggregated, anonymized form by Vercel in accordance with their
              data retention policies. Email correspondence is retained for the duration of our business
              relationship and for a reasonable period thereafter.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Your Rights
            </h2>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary">
              You may request access to, correction of, or deletion of any personal data we hold about you.
              To exercise these rights, contact us at{' '}
              <a href={`mailto:${BRAND.email}`} className="text-accent hover:text-foreground transition-colors">
                {BRAND.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-primary text-[0.9rem] font-medium uppercase tracking-wider text-foreground mb-6">
              Changes to This Policy
            </h2>
            <p className="text-muted text-[0.95rem] leading-relaxed font-primary">
              We may update this privacy policy from time to time. Any changes will be posted on this page
              with an updated revision date. Continued use of the website after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>
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
