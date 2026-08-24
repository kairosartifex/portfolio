export interface CaseStudyImage {
  src: string;
  gridClass: string;
  title: string;
  year: string;
}

export interface CaseStudyLink {
  label: string;
  url: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  date: string;
  year: string;
  description: string;
  projectUrl: string;
  links?: CaseStudyLink[];
  metadata: {
    lastUpdated: string;
    dimensions: string;
    characters: number;
  };
  images: CaseStudyImage[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "aakar",
    title: "Aakar",
    date: "July 20, 2025",
    year: "2025",
    description: "Aakar is a premium logo and visual identity concept designed around craftsmanship, natural materials, and architectural elegance. The custom symbol draws inspiration from organic wooden forms, creating a memorable brand mark that feels both artisanal and modern. Paired with a refined serif wordmark, the identity balances luxury, simplicity, and timeless appeal. Built as a comprehensive design system, it works seamlessly across branding, packaging, signage, digital products, and print applications to establish a cohesive brand presence.",
    projectUrl: "https://dribbble.com/shots/27485903-Aakar",
    links: [
      {
        label: "dribble",
        url: "https://dribbble.com/shots/27485903-Aakar"
      },
      {
        label: "twitter",
        url: "https://x.com/kairosartifex/status/2068008433048252770?s=20"
      }
    ],
    metadata: {
      lastUpdated: "July 20, 2025",
      dimensions: "1600×1200",
      characters: 476,
    },
    images: [
      {
        src: "/projects/aakar-primary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-7",
        title: "Aakar Identity & Concept Symbol",
        year: "2025",
      },
      {
        src: "/projects/aakar-secondary-img.webp",
        gridClass: "col-span-12 md:col-start-8 md:col-span-5",
        title: "Aakar Architectural Identity & Material System",
        year: "2025",
      },
      {
        src: "/projects/aakar-tertiary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-12",
        title: "Aakar Packaging & Brand Collateral Showcase",
        year: "2025",
      },
    ],
  },
  {
    slug: "dhankamya",
    title: "Dhankamya",
    date: "June 15, 2025",
    year: "2025",
    description: "Dhankamya is a luxury jewelry brand identity design specializing in natural stone ornaments that embody spiritual strength and elegance. The visual system combines minimal luxury aesthetics with a mandala-inspired floral emblem and modern serif typography, reflecting balance, sophistication, and authenticity. Tailored for high-end jewelry, wellness, and lifestyle branding, the design establishes a premium market position with a memorable and symbolic logo mark.",
    projectUrl: "https://dribbble.com/shots/26593544-Dhankamya-Luxury-Natural-Stone-Jewelry-Branding",
    links: [
      {
        label: "dribble",
        url: "https://dribbble.com/shots/26593544-Dhankamya-Luxury-Natural-Stone-Jewelry-Branding"
      },
      {
        label: "twitter",
        url: "https://x.com/kairosartifex/status/1970184618088517743?s=20"
      }
    ],
    metadata: {
      lastUpdated: "June 15, 2025",
      dimensions: "1600×1200",
      characters: 422,
    },
    images: [
      {
        src: "/projects/dhankamaya-primary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-7",
        title: "Dhankamya Visual Identity and Mandala Emblem",
        year: "2025",
      },
      {
        src: "/projects/dhankamya-secondary-img.webp",
        gridClass: "col-span-12 md:col-start-8 md:col-span-5",
        title: "Dhankamya Natural Stone Jewelry Collection",
        year: "2025",
      },
    ],
  },
  {
    slug: "lorive",
    title: "Lorive",
    date: "May 10, 2025",
    year: "2025",
    description: "L'Orivè is an artisanal premium perfume brand identity built on restraint, calm color palettes, and floral symbolism. The visual concept balances timeless elegance with contemporary minimalism, delivering an upscale brand experience for luxury fragrance packaging and digital products. Designed to evoke serenity, the identity uses custom typography and subtle graphic assets that align with modern premium design standards.",
    projectUrl: "https://dribbble.com/shots/26975968-Lorive-Premium-Artesanal-Perfumes",
    links: [
      {
        label: "dribble",
        url: "https://dribbble.com/shots/26975968-Lorive-Premium-Artesanal-Perfumes"
      },
      {
        label: "twitter",
        url: "https://x.com/kairosartifex/status/2010778153682383077?s=20"
      }
    ],
    metadata: {
      lastUpdated: "May 10, 2025",
      dimensions: "1600×1200",
      characters: 418,
    },
    images: [
      {
        src: "/projects/lorive-primary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-7",
        title: "Lorive Premium Perfume Branding",
        year: "2025",
      },
      {
        src: "/projects/lorive-secondary-img.webp",
        gridClass: "col-span-12 md:col-start-8 md:col-span-5",
        title: "Lorive Artesanal Fragrance Packaging System",
        year: "2025",
      },
      {
        src: "/projects/lorive-tertiary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-5",
        title: "Lorive Brand Identity & Visual Assets",
        year: "2025",
      },
      {
        src: "/projects/lorive-quaternary-img.webp",
        gridClass: "col-span-12 md:col-start-6 md:col-span-7",
        title: "Lorive Fragrance Product Showcase",
        year: "2025",
      },
    ],
  },
  {
    slug: "mechtech",
    title: "MechTech",
    date: "February 28, 2026",
    year: "2026",
    description: "MechTech Infrasolutions is a modern digital platform and interface design system engineered to reflect precision, scale, and trust. The project pairs a minimal corporate logo mark with a bold gradient-driven design system to represent innovation in infrastructure and engineering. Built with a focus on usability, clean hierarchy, and high-performance UI components, it delivers an intuitive user experience for industrial data visualization and engineering dashboards.",
    projectUrl: "https://dribbble.com/shots/26958402-Mechtech-Infrasolutions",
    links: [
      {
        label: "dribble",
        url: "https://dribbble.com/shots/26958402-Mechtech-Infrasolutions"
      },
      {
        label: "twitter",
        url: "https://x.com/kairosartifex/status/2008901151820042377?s=20"
      }
    ],
    metadata: {
      lastUpdated: "February 28, 2026",
      dimensions: "1920×1080",
      characters: 450,
    },
    images: [
      {
        src: "/projects/mechtech-primary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-7",
        title: "MechTech Digital Dashboard Interface",
        year: "2026",
      },
      {
        src: "/projects/mechtech-secondary-img.webp",
        gridClass: "col-span-12 md:col-start-8 md:col-span-5",
        title: "MechTech Brand Identity & Infrastructure System",
        year: "2026",
      },
    ],
  },
  {
    slug: "dhankamya-uiux",
    title: "Dhankamya",
    date: "June 28, 2025",
    year: "2025",
    description: "A refined and elegant landing page concept for a handcrafted stone jewelry brand. Designed with a minimalist editorial layout, premium product photography, soft neutral tones, and a sophisticated shopping experience that highlights the beauty and meaning behind natural gemstones. The design focuses on storytelling, product discovery, brand identity, and conversion-driven user experience while maintaining a clean luxury aesthetic.",
    projectUrl: "https://dribbble.com/shots/27450395-Luxury-Jewelry-E-Commerce-Landing-Page-UI",
    links: [
      {
        label: "dribble",
        url: "https://dribbble.com/shots/27450395-Luxury-Jewelry-E-Commerce-Landing-Page-UI"
      },
      {
        label: "twitter",
        url: "https://x.com/kairosartifex/status/2013909883779973545?s=20"
      }
    ],
    metadata: {
      lastUpdated: "June 28, 2025",
      dimensions: "1280×832",
      characters: 440,
    },
    images: [
      {
        src: "/projects/dhankamya-uiux-primary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-7",
        title: "Dhankamya Hero & Home Section UI",
        year: "2025",
      },
      {
        src: "/projects/dhankamya-uiux-secondary-img.webp",
        gridClass: "col-span-12 md:col-start-8 md:col-span-5",
        title: "Dhankamya About Us Section UI",
        year: "2025",
      },
      {
        src: "/projects/dhankamya-uiux-tertiary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-5",
        title: "Dhankamya Hot Products Showcase UI",
        year: "2025",
      },
      {
        src: "/projects/dhankamya-uiux-quaternary-img.webp",
        gridClass: "col-span-12 md:col-start-6 md:col-span-7",
        title: "Dhankamya Contact & Footer Section UI",
        year: "2025",
      },
    ],
  },
  {
    slug: "luxora",
    title: "Luxora",
    date: "June 12, 2025",
    year: "2025",
    description: "Luxora is a premium aesthetic candle brand website design concept. Built with a focus on editorial typography, high-contrast layouts, and seamless transitions, the concept presents an immersive shopping environment that communicates sensory luxury. The design integrates static layout structures with modern web performance optimizations, prioritizing visual storytelling, luxury brand positioning, and elegant visual hierarchy.",
    projectUrl: "https://dribbble.com/shots/26592618-Luxora-Luxury-Candle-Brand-Website",
    links: [
      {
        label: "dribble",
        url: "https://dribbble.com/shots/26592618-Luxora-Luxury-Candle-Brand-Website"
      },
      {
        label: "twitter",
        url: "https://x.com/kairosartifex/status/1971255767216071022?s=20"
      }
    ],
    metadata: {
      lastUpdated: "June 12, 2025",
      dimensions: "1440×1024",
      characters: 450,
    },
    images: [
      {
        src: "/projects/luxora-ui-primary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-7",
        title: "Luxora Landing & Hero Section UI",
        year: "2025",
      },
      {
        src: "/projects/luxora-ui-secondary-img.webp",
        gridClass: "col-span-12 md:col-start-8 md:col-span-5",
        title: "Luxora Contact Section UI",
        year: "2025",
      },
      {
        src: "/projects/luxora-ui-tertiary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-5",
        title: "Luxora Featured Products Section UI",
        year: "2025",
      },
      {
        src: "/projects/luxora-ui-quaternary-img.webp",
        gridClass: "col-span-12 md:col-start-6 md:col-span-7",
        title: "Luxora Our Story Section UI",
        year: "2025",
      },
      {
        src: "/projects/luxora-ui-quinary-img.webp",
        gridClass: "col-span-12 md:col-start-1 md:col-span-12",
        title: "Luxora FAQ Section UI",
        year: "2025",
      },
    ],
  },
];

export interface WorkGridProject {
  title: string;
  year: string;
  image: string;
  secondaryImage?: string;
  badge?: string;
  gridClass: string;
  slug?: string;
  preload?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low';
}

export const workGridProjects: WorkGridProject[] = [
  {
    title: 'DHANKAMYA',
    year: '2025',
    image: '/projects/dhankamaya-primary-img.webp',
    secondaryImage: '/projects/dhankamya-secondary-img.webp',
    badge: 'BRANDING PROJECT',
    gridClass: 'col-span-3 md:col-start-2 md:col-span-2',
    slug: 'dhankamya',
    preload: true,
    fetchPriority: 'high',
  },
  {
    title: 'AAKAR',
    year: '2025',
    image: '/projects/aakar-primary-img.webp',
    secondaryImage: '/projects/aakar-secondary-img.webp',
    badge: 'BRANDING PROJECT',
    gridClass: 'col-span-3 md:col-start-1 md:col-span-1',
    slug: 'aakar',
  },
  {
    title: 'LORIVE',
    year: '2025',
    image: '/projects/lorive-primary-img.webp',
    secondaryImage: '/projects/lorive-secondary-img.webp',
    badge: 'BRANDING PROJECT',
    gridClass: 'col-span-3 md:col-start-2 md:col-span-1',
    slug: 'lorive',
  },
  {
    title: 'MECHTECH',
    year: '2026',
    image: '/projects/mechtech-primary-img.webp',
    secondaryImage: '/projects/mechtech-secondary-img.webp',
    badge: 'BRANDING PROJECT',
    gridClass: 'col-span-3 md:col-start-2 md:col-span-1',
    slug: 'mechtech',
  },
  {
    title: 'DHANKAMYA',
    year: '2025',
    image: '/projects/dhankamya-uiux-primary-img.webp',
    secondaryImage: '/projects/dhankamya-uiux-secondary-img.webp',
    badge: 'UI/UX PROJECT',
    gridClass: 'col-span-3 md:col-start-3 md:col-span-1',
    slug: 'dhankamya-uiux',
  },
  {
    title: 'LUXORA',
    year: '2025',
    image: '/projects/luxora-ui-primary-img.webp',
    secondaryImage: '/projects/luxora-ui-secondary-img.webp',
    badge: 'UI/UX PROJECT',
    gridClass: 'col-span-3 md:col-start-1 md:col-span-2',
    slug: 'luxora',
  },
];
