// ponytail: single source of truth for brand entity data
// Every schema, metadata export, and page references this file.

const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://kairosartifex.site";
};

export const SITE_URL = getSiteUrl();

export const BRAND = {
  name: "Kairos.Artifex",
  positioning: "Strategy, Design and Engineering working as one.",
  category: "Premium creative development agency",
  email: "kairosartifex@gmail.com",
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
    "Creative Development",
    "Motion Design",
    "Three.js Experiences",
    "Next.js Development",
    "SaaS Design",
    "Product Design",
    "AI Integrations",
    "Web Applications",
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
