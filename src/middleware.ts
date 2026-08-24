// middleware.ts - acceptmarkdown.com content negotiation for AI agents
// Follows the official Next.js recipe: https://acceptmarkdown.com/recipes/nextjs
import { NextRequest, NextResponse } from 'next/server';

const PRODUCES = ['text/html', 'text/markdown'] as const;

type AcceptEntry = { type: string; q: number; specificity: number };

function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';').map((s) => s.trim());
      const type = parts[0].toLowerCase();
      let q = 1;
      for (const param of parts.slice(1)) {
        const [name, value] = param.split('=').map((s) => s.trim());
        if (name === 'q') {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }
      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
      return { type, q, specificity };
    });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

function preferredType(header: string | null): string | null {
  if (!header) return PRODUCES[0];
  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let bestType: string | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    const matchedQ: number = matched.q;
    if (matchedQ <= 0) continue; // explicit rejection

    if (matchedQ > bestQ || (matchedQ === bestQ && matchedPosition < bestPosition)) {
      bestQ = matchedQ;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

function appendVaryAccept(headers: Headers): void {
  const existing = headers.get('Vary');
  if (!existing) {
    headers.set('Vary', 'Accept');
    return;
  }
  const tokens = existing.split(',').map((s) => s.trim().toLowerCase());
  if (!tokens.includes('accept')) {
    headers.set('Vary', `${existing}, Accept`);
  }
}

// Skip static assets, Next.js internals, and known file extensions
const SKIP_RE = /^\/(_next|api\/(?!markdown)|favicon\.ico|icon\.png|opengraph|manifest|audio|fonts|model|projects)\b/;
const FILE_EXT_RE = /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|mjs|json|xml|txt|woff2?|otf|ttf|mp3|mp4|webm)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and internals
  if (SKIP_RE.test(pathname) || FILE_EXT_RE.test(pathname)) {
    return NextResponse.next();
  }

  // Explicit .md URL - always serve markdown regardless of Accept header.
  // Rewrite to the markdown API route with the .md stripped.
  if (pathname.endsWith('.md')) {
    const pagePath = pathname.slice(0, -3) || '/';
    const url = req.nextUrl.clone();
    url.pathname = '/api/markdown';
    url.searchParams.set('path', pagePath);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-negotiated-path', pagePath);
    const res = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    appendVaryAccept(res.headers);
    return res;
  }

  // Content negotiation on page routes
  const accept = req.headers.get('accept');
  const preferred = preferredType(accept);

  // 406 Not Acceptable: client explicitly rejects everything we produce
  if (preferred === null) {
    return new NextResponse('Not Acceptable. This server produces text/html and text/markdown.', {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Vary': 'Accept',
      },
    });
  }

  // Markdown requested - rewrite to the markdown API route
  if (preferred === 'text/markdown') {
    const url = req.nextUrl.clone();
    url.pathname = '/api/markdown';
    url.searchParams.set('path', pathname);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-negotiated-path', pathname);
    const res = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
    appendVaryAccept(res.headers);
    return res;
  }

  // HTML - pass through, but ensure Vary: Accept is set
  // Use response headers to add Vary: Accept. Next.js may add its own Vary
  // for RSC headers. We set our Vary via middleware response which gets merged.
  const res = NextResponse.next();
  res.headers.set('x-middleware-override-vary', 'Accept');
  appendVaryAccept(res.headers);
  return res;
}

export const config = {
  matcher: [
    // Match all paths except _next/static, _next/image, and static files
    '/((?!_next/static|_next/image).*)',
  ],
};
