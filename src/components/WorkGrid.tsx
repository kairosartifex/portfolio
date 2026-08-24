'use client';

import React from 'react';
import Link from 'next/link';
import { workGridProjects } from '@/lib/data/work';
import HalftoneHoverImage from './HalftoneHoverImage';

export default function WorkGrid() {
  return (
    <section className="w-full px-10 max-md:px-4 pt-36 pb-24 select-none" id="work">
      <div className="mb-20 flex flex-col gap-6 max-w-xl">
        <h2 className="font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[3.2rem] font-light uppercase leading-[0.95] tracking-tight text-foreground m-0">
          Selected Work
        </h2>
        <p className="font-mono text-[0.85rem] leading-relaxed text-muted m-0">
          A collection of brands, products, and digital experiences we&apos;ve crafted
          across identity, web, mobile, and emerging technologies.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-20 max-md:gap-10">
        {workGridProjects.map((project, idx) => {
          const content = (
            <div className="group block w-full">
              <div className="relative w-full aspect-[1.5] overflow-hidden">
                {project.badge && (
                  <span className="absolute top-0 right-0 z-10 bg-accent text-(--selection-text) font-mono text-[0.7rem] px-2 py-0.5 uppercase tracking-wider select-none">
                    {project.badge}
                  </span>
                )}
                <HalftoneHoverImage
                  primarySrc={project.image}
                  secondarySrc={project.secondaryImage}
                  alt={project.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="scroll-deformed-image"
                  preload={project.preload}
                  loading={project.loading}
                  fetchPriority={project.fetchPriority}
                />
              </div>
              <div className="mt-4 flex justify-between items-center text-[0.85rem] uppercase font-secondary">
                <span className="font-medium tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </span>
                <span className="font-mono text-muted">{project.year}</span>
              </div>
            </div>
          );

          return (
            <article key={idx} className={project.gridClass}>
              {project.slug ? (
                <Link href={`/work/${project.slug}`} className="block w-full cursor-pointer">
                  {content}
                </Link>
              ) : (
                <div className="block w-full cursor-default">
                  {content}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
