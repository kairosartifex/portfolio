// Markdown content negotiation API route handler
// Serves text/markdown variants of all pages for AI agents
import { NextRequest, NextResponse } from 'next/server';
import { BRAND, SITE_URL } from '@/lib/constants';
import { caseStudies } from '@/lib/data/work';
import { readFile } from 'fs/promises';
import { join } from 'path';

function generateHomepageMarkdown(): string {
  // Use the existing llms.txt as the homepage markdown - it's already the
  // canonical LLM-friendly representation of the site.
  // Fallback to a generated version if the file can't be read (edge runtime).
  return [
    `# ${BRAND.name}`,
    '',
    `> ${BRAND.positioning}`,
    '',
    `${BRAND.name} is a ${BRAND.category.toLowerCase()} based in ${BRAND.location.city}, ${BRAND.location.country}.`,
    'We design brands, build digital products, and engineer experiences that are simple, purposeful, and memorable.',
    '',
    '## Services & Disciplines',
    '',
    ...BRAND.disciplines.map((d) => `- ${d}`),
    '',
    '## Selected Work',
    '',
    ...caseStudies.map(
      (s) => `- [${s.title}](${SITE_URL}/work/${s.slug}) - ${s.description.slice(0, 150)}… (${s.year})`
    ),
    '',
    '## Founders',
    '',
    ...BRAND.founders.map(
      (f) => `- **${f.name}** - ${f.roles.join(', ')}. [Website](${f.website}), [GitHub](${f.github})`
    ),
    '',
    '## Contact',
    '',
    `- Email: [${BRAND.email}](mailto:${BRAND.email})`,
    `- Dribbble: [${BRAND.socials.dribbble}](${BRAND.socials.dribbble})`,
    `- Instagram: [${BRAND.socials.instagram}](${BRAND.socials.instagram})`,
    `- Twitter/X: [${BRAND.socials.x}](${BRAND.socials.x})`,
    '',
    '## Machine-Readable Resources',
    '',
    `- [llms.txt](${SITE_URL}/llms.txt) - LLM-optimized summary`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt) - Full context for AI agents`,
    `- [sitemap.xml](${SITE_URL}/sitemap.xml) - XML sitemap`,
    '',
  ].join('\n');
}

function generateCaseStudyMarkdown(slug: string): string | null {
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return null;

  return [
    `# ${study.title}`,
    '',
    `> ${BRAND.name} Case Study (${study.year})`,
    '',
    study.description,
    '',
    '## Project Details',
    '',
    `- **Date**: ${study.date}`,
    `- **Last Updated**: ${study.metadata.lastUpdated}`,
    `- **Dimensions**: ${study.metadata.dimensions}`,
    '',
    ...(study.links
      ? [
          '## Links',
          '',
          ...study.links.map((l) => `- [${l.label}](${l.url})`),
          '',
        ]
      : [`- [View Project](${study.projectUrl})`, '']),
    '## Images',
    '',
    ...study.images.map((img) => `- ${img.title} (${img.year})`),
    '',
    '---',
    '',
    `← [Back to ${BRAND.name}](${SITE_URL})`,
    '',
  ].join('\n');
}

function generateAboutMarkdown(): string {
  return [
    `# About ${BRAND.name}`,
    '',
    `> ${BRAND.positioning}`,
    '',
    `${BRAND.name} is a ${BRAND.category.toLowerCase()} based in ${BRAND.location.city}, ${BRAND.location.region}, ${BRAND.location.country}. We design brands, build digital products, and engineer web experiences that are simple, purposeful, and memorable.`,
    '',
    'We work with startups, SaaS companies, AI companies, founders, and growing brands worldwide - delivering end-to-end creative solutions from brand strategy through to production-ready code.',
    '',
    '## Services',
    '',
    ...BRAND.disciplines.map((d) => `- ${d}`),
    '',
    '## Founders',
    '',
    ...BRAND.founders.map(
      (f) =>
        `### ${f.name}\n${f.roles.join(', ')}. [Website](${f.website}) · [GitHub](${f.github})`
    ),
    '',
    '## Location',
    '',
    `Based in ${BRAND.location.city}, ${BRAND.location.region}, ${BRAND.location.country}. Serving clients worldwide.`,
    '',
  ].join('\n');
}

function generateContactMarkdown(): string {
  return [
    `# Contact ${BRAND.name}`,
    '',
    `Reach out to discuss your next project. We work with clients worldwide from our base in ${BRAND.location.city}, ${BRAND.location.country}.`,
    '',
    '## Get in Touch',
    '',
    `- **Email**: [${BRAND.email}](mailto:${BRAND.email})`,
    `- **Dribbble**: [${BRAND.socials.dribbble}](${BRAND.socials.dribbble})`,
    `- **Instagram**: [${BRAND.socials.instagram}](${BRAND.socials.instagram})`,
    `- **Twitter/X**: [${BRAND.socials.x}](${BRAND.socials.x})`,
    '',
    '## Location',
    '',
    `${BRAND.location.city}, ${BRAND.location.region}, ${BRAND.location.country}`,
    '',
  ].join('\n');
}

function generatePrivacyMarkdown(): string {
  return [
    `# Privacy Policy - ${BRAND.name}`,
    '',
    `Last updated: August 2026`,
    '',
    `This privacy policy describes how ${BRAND.name} ("we", "us") collects and uses information when you visit ${SITE_URL}.`,
    '',
    '## Information We Collect',
    '',
    'We use Vercel Analytics and Vercel Speed Insights to collect anonymous, aggregated usage data including page views, referrers, browser type, and performance metrics. No personally identifiable information is collected through these services.',
    '',
    '## Cookies',
    '',
    'This site uses a local storage preference for theme selection (dark/light mode). No tracking cookies are set.',
    '',
    '## Third-Party Services',
    '',
    '- **Vercel**: Hosting and analytics ([Vercel Privacy Policy](https://vercel.com/legal/privacy-policy))',
    '',
    '## Contact',
    '',
    `For privacy-related inquiries, email [${BRAND.email}](mailto:${BRAND.email}).`,
    '',
  ].join('\n');
}

function generate404Markdown(requestedPath: string): string {
  return [
    '# 404 - Page Not Found',
    '',
    `The path \`${requestedPath}\` does not exist on ${BRAND.name}.`,
    '',
    '## Valid Pages',
    '',
    `- [Homepage](${SITE_URL})`,
    `- [About](${SITE_URL}/about)`,
    `- [Contact](${SITE_URL}/contact)`,
    `- [Privacy](${SITE_URL}/privacy)`,
    ...caseStudies.map((s) => `- [${s.title}](${SITE_URL}/work/${s.slug})`),
    '',
    '## Machine-Readable Resources',
    '',
    `- [llms.txt](${SITE_URL}/llms.txt)`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt)`,
    `- [sitemap.xml](${SITE_URL}/sitemap.xml)`,
    '',
  ].join('\n');
}

export async function GET(req: NextRequest) {
  const path =
    req.headers.get('x-negotiated-path') ||
    req.nextUrl.searchParams.get('path') ||
    new URL(req.url).searchParams.get('path') ||
    '/';
  let markdown: string;
  let status = 200;

  // Route to the correct markdown generator
  if (path === '/' || path === '/index') {
    // Try to serve the existing llms.txt file first (richer content)
    try {
      const llmsPath = join(process.cwd(), 'public', 'llms.txt');
      markdown = await readFile(llmsPath, 'utf-8');
    } catch {
      markdown = generateHomepageMarkdown();
    }
  } else if (path.startsWith('/work/')) {
    const slug = path.replace('/work/', '');
    const result = generateCaseStudyMarkdown(slug);
    if (result) {
      markdown = result;
    } else {
      markdown = generate404Markdown(path);
      status = 404;
    }
  } else if (path === '/about') {
    markdown = generateAboutMarkdown();
  } else if (path === '/contact') {
    markdown = generateContactMarkdown();
  } else if (path === '/privacy') {
    markdown = generatePrivacyMarkdown();
  } else {
    markdown = generate404Markdown(path);
    status = 404;
  }

  return new NextResponse(markdown, {
    status,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
    },
  });
}
