'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function PageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPathname = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synchronously run page transition on pathname change
  useIsomorphicLayoutEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    // Cancel any running transition frame to reset cleanly
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    prevPathname.current = pathname;
    setIsTransitioning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get current theme background color
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const bgColor = savedTheme === 'light' ? '#E6E6E6' : '#0A0A0A';

    // Synchronously set canvas size and draw solid color BEFORE paint
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Setup Halftone circle reveal animation
    const pSize = window.innerWidth < 768 ? 12 : 18;
    let radius = 0;
    const maxRadius = Math.max(canvas.width, canvas.height) * 1.5;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const bandSize = 400;
    const maxDotSize = pSize * 0.75;
    const grid = new Set<string>();

    ctx.globalCompositeOperation = 'destination-out';

    const render = () => {
      const targetRadius = maxRadius + bandSize;
      // Exactly matched to Loader.tsx reveal speed for uniform halftone visual effect
      radius += (targetRadius - radius) * 0.015 + 1.0;

      const cols = Math.ceil(canvas.width / pSize);
      const rows = Math.ceil(canvas.height / pSize);

      const startCol = Math.max(0, Math.floor((centerX - radius - bandSize) / pSize));
      const endCol = Math.min(cols, Math.ceil((centerX + radius + bandSize) / pSize));
      const startRow = Math.max(0, Math.floor((centerY - radius - bandSize) / pSize));
      const endRow = Math.min(rows, Math.ceil((centerY + radius + bandSize) / pSize));

      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          const key = `${c},${r}`;
          if (!grid.has(key)) {
            const px = c * pSize + pSize / 2;
            const py = r * pSize + pSize / 2;
            const dist = Math.hypot(px - centerX, py - centerY);
            const diff = radius - dist;

            if (diff > 0) {
              const dotRadius = Math.min((diff / bandSize) * maxDotSize, maxDotSize);
              ctx.beginPath();
              ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
              ctx.fill();

              if (dotRadius >= maxDotSize) {
                grid.add(key);
              }
            }
          }
        }
      }

      if (radius <= targetRadius) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        setIsTransitioning(false);
      }
    };

    // Run animation starting on the very next frame
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pathname]);

  return (
    <div
      className="fixed inset-0 z-100 pointer-events-none"
      style={{ display: isTransitioning ? 'block' : 'none' }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
