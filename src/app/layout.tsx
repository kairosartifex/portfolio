import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { BRAND, SITE_URL, SAME_AS } from "@/lib/constants";
import InteractiveShell from "@/components/InteractiveShell";
import PageTransition from "@/components/PageTransition";
import BgmPlayer from "@/components/BgmPlayer";
import LenisProvider from "@/components/LenisProvider";

// ponytail: primary font — LayGrotesk with all 5 weights
const layGrotesk = localFont({
  src: [
    { path: "../../public/fonts/laygrotesk-trial-regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/laygrotesk-trial-medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/laygrotesk-trial-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-primary",
  display: "swap",
});

// ponytail: secondary font — Space Mono
const spaceMono = localFont({
  src: "../../public/fonts/SpaceMono-Regular.ttf",
  variable: "--font-secondary",
  display: "swap",
});

// ponytail: tertiary font — Tronica Mono
const tronicaMono = localFont({
  src: "../../public/fonts/Tronica-Mono.otf",
  variable: "--font-tertiary",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND.name,
  description: `${BRAND.name} is a ${BRAND.category.toLowerCase()} specializing in ${BRAND.disciplines.slice(0, 5).join(", ")}, and more. We work with ${BRAND.verticals.join(", ").toLowerCase()}.`,
  alternates: { canonical: "/" },
  authors: BRAND.founders.map((f) => ({ name: f.name, url: f.website })),
  openGraph: {
    title: BRAND.name,
    description: `${BRAND.category}. ${BRAND.positioning}`,
    url: SITE_URL,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: `${BRAND.category}. ${BRAND.positioning}`,
  },
};

// ponytail: Organization + WebSite JSON-LD, injected once in root layout
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: `${BRAND.name} is a ${BRAND.category.toLowerCase()}. ${BRAND.positioning}`,
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
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND.name,
  url: SITE_URL,
  publisher: { "@type": "Organization", name: BRAND.name },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${layGrotesk.variable} ${spaceMono.variable} ${tronicaMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="js-enabled"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-enabled')`,
          }}
        />
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', saved);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-primary">
        <InteractiveShell />
        <PageTransition />
        <BgmPlayer />
        <LenisProvider>
          {children}
        </LenisProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </body>
    </html>
  );
}
