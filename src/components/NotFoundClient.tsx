'use client';

import Link from 'next/link';
import AsciiTextReveal from '@/components/AsciiTextReveal';

const dottedBtnClasses =
  'relative border border-dotted border-foreground/40 hover:border-foreground focus-visible:border-foreground px-5 py-3 cursor-pointer transition-all duration-300 ease-out select-none outline-none uppercase text-[0.85rem] font-secondary tracking-wider inline-flex items-center gap-2 text-foreground group';

export default function NotFoundClient() {
  return (
    <div className="flex flex-wrap gap-4 items-center pt-2">
      <Link href="/" className={dottedBtnClasses}>
        <span className="text-accent group-hover:-translate-x-1 transition-transform">←</span>
        <AsciiTextReveal text="Return to Homepage" />
      </Link>
      <button
        onClick={() => typeof window !== 'undefined' && window.history.back()}
        className={`${dottedBtnClasses} bg-transparent text-muted hover:text-foreground`}
      >
        <AsciiTextReveal text="Go Back" />
      </button>
    </div>
  );
}
