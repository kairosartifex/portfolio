// ponytail: single source of truth for brand entity data
// Every schema, metadata export, and page references this file.

const getSiteUrl = () => {
  let url = "";
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    url = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`;
  } else {
    url = "https://www.kairosartifex.site";
  }
  // Strip trailing slash to prevent double-slash in URL concatenation
  return url.replace(/\/+$/, "");
};

export const SITE_URL = getSiteUrl();

export const BRAND = {
  name: "Kairos Artifex",
  legalName: "Kairos.Artifex",
  positioning: "Strategy, Design and Engineering working as one.",
  category: "Premium creative development agency",
  email: "kairosartifex@gmail.com",
  location: {
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
  },
  socials: {
    dribbble: "https://dribbble.com/kairosagency-work",
    instagram: "https://www.instagram.com/kairos.artifex",
    x: "https://x.com/kairosartifex",
  },
  disciplines: [
    "Brand Strategy",
    "Brand Identity",
    "UI/UX Design",
    "Website Design",
    "Web Development",
    "Creative Development",
    "Motion Design",
    "Graphic Design",
    "Video Editing",
    "Three.js Experiences",
    "Next.js Development",
    "SaaS Design",
    "Product Design",
    "AI Integrations",
    "Web Applications",
  ],
  // Target SEO keywords - used in meta tags, descriptions, and llms.txt
  keywords: [
    "kairos",
    "kairos artifex",
    "kairos agency",
    "artifex",
    "ui/ux agency",
    "uiux agency",
    "UI UX design agency",
    "web dev agency",
    "web development agency",
    "video editing agency",
    "graphic design agency",
    "branding agency",
    "creative agency",
    "creative agency India",
    "creative agency Mumbai",
    "brand identity design",
    "website design agency",
    "premium design studio",
    "digital agency India",
  ],
  verticals: [
    "Startups",
    "SaaS Companies",
    "AI Companies",
    "Founders",
    "Tech Businesses",
    "Growing Brands",
  ],
  founders: [
    {
      name: "Ankit Bhavarthe",
      roles: ["Graphic Design", "UI/UX Design", "Full Stack Developer"],
      github: "https://github.com/Ankit-2563",
      website: "https://ankitbhavarthe.xyz",
    },
    {
      name: "Satyam Bhosale",
      roles: ["UI/UX Design", "Full Stack Developer"],
      github: "https://github.com/SatyamBhosale",
      website: "https://www.testsatyam.online/",
    },
  ],
} as const;

export const SAME_AS = [
  BRAND.socials.dribbble,
  BRAND.socials.instagram,
  BRAND.socials.x,
] as const;
