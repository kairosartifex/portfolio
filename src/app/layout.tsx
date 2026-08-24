import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BRAND, SITE_URL, SAME_AS } from "@/lib/constants";
import InteractiveShell from "@/components/InteractiveShell";
import PageTransition from "@/components/PageTransition";
import BgmPlayer from "@/components/BgmPlayer";
import LenisProvider from "@/components/LenisProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ponytail: primary font - LayGrotesk with all 5 weights
const layGrotesk = localFont({
  src: [
    { path: "../../public/fonts/laygrotesk-trial-regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/laygrotesk-trial-medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/laygrotesk-trial-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-primary",
  display: "swap",
});

// ponytail: secondary font - Space Mono
const spaceMono = localFont({
  src: "../../public/fonts/SpaceMono-Regular.ttf",
  variable: "--font-secondary",
  display: "swap",
});

// ponytail: tertiary font - Tronica Mono
const tronicaMono = localFont({
  src: "../../public/fonts/Tronica-Mono.otf",
  variable: "--font-tertiary",
  display: "swap",
});

const seoTitle = `${BRAND.name} - Premium UI/UX Design, Branding & Web Development Agency`;
const seoDescription = `${BRAND.name} is a premium creative agency based in ${BRAND.location.city}, ${BRAND.location.country} specializing in ${BRAND.disciplines.slice(0, 8).join(", ")}, and more. We craft thoughtful brands, digital products, and scalable web experiences for ${BRAND.verticals.join(", ").toLowerCase()}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  title: {
    default: seoTitle,
    template: `%s | ${BRAND.name}`,
  },
  description: seoDescription,
  keywords: [...BRAND.keywords],
  alternates: { canonical: "/" },
  authors: BRAND.founders.map((f) => ({ name: f.name, url: f.website })),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: seoTitle,
    description: `${BRAND.category}. ${BRAND.positioning}`,
    url: SITE_URL,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: `${BRAND.category}. ${BRAND.positioning}`,
    site: "@kairosartifex",
    creator: "@kairosartifex",
  },
};

// ponytail: Organization JSON-LD, injected once in root layout
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: `${BRAND.name} is a ${BRAND.category.toLowerCase()} based in ${BRAND.location.city}, ${BRAND.location.country}. ${BRAND.positioning}`,
  sameAs: SAME_AS,
  contactPoint: {
    "@type": "ContactPoint",
    email: BRAND.email,
    contactType: "customer service",
  },
  founders: BRAND.founders.map((f) => ({
    "@type": "Person",
    name: f.name,
    jobTitle: f.roles.join(", "),
    url: f.website,
    sameAs: [f.github],
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: BRAND.location.city,
    addressRegion: BRAND.location.region,
    addressCountry: BRAND.location.country,
  },
};

// ProfessionalService schema - helps rank for "agency" / "studio" service queries
const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: BRAND.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}/opengraph-image.png`,
  description: seoDescription,
  email: BRAND.email,
  sameAs: [...SAME_AS],
  address: {
    "@type": "PostalAddress",
    addressLocality: BRAND.location.city,
    addressRegion: BRAND.location.region,
    addressCountry: BRAND.location.country,
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 19.076,
      longitude: 72.8777,
    },
    geoRadius: "50000",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Creative Services",
    itemListElement: BRAND.disciplines.map((d, i) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: d,
      },
      position: i + 1,
    })),
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND.name,
  url: SITE_URL,
  publisher: { "@type": "Organization", name: BRAND.name },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${layGrotesk.variable} ${spaceMono.variable} ${tronicaMono.variable} antialiased js-enabled`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('js-enabled');
                const saved = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', saved);
              })();
            `,
          }}
        />
        {/* acceptmarkdown.com: alternate link for markdown content negotiation */}
        <link rel="alternate" type="text/markdown" href="/index.md" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-primary">
        <InteractiveShell />
        <PageTransition />
        <BgmPlayer />
        <LenisProvider>
          {children}
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </body>
    </html>
  );
}
