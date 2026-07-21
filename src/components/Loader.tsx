'use client';

import { useState, useEffect, useRef } from 'react';

interface LoaderProps {
  onComplete: () => void;
  onRevealStart?: () => void;
}

export default function Loader({ onComplete, onRevealStart }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRevealingRef = useRef(false);

  useEffect(() => {
    // ponytail: remove ready class on mount to ensure page content is hidden until canvas renders
    document.documentElement.classList.remove('ready');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas and fill it with solid background color
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // We only fill the solid color if the reveal sequence hasn't started
      if (!isRevealingRef.current) {
        // ponytail: read theme directly to prevent racing with document theme updates
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const bgColor = savedTheme === 'light' ? '#E6E6E6' : '#0A0A0A';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Canvas is now solid, safe to make the page content opacity 1 underneath
        document.documentElement.classList.add('ready');
      }
    };

    // Initial draw
    resize();
    window.addEventListener('resize', resize);

    let currentProgress = 0;
    let animationFrame: number;
    const grid = new Set<string>();

    let revealTimeout1: NodeJS.Timeout | null = null;
    let revealTimeout2: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Start Reveal Sequence with a longer delay so it feels deliberate
        revealTimeout1 = setTimeout(() => {
          setIsRevealing(true);
          isRevealingRef.current = true;
          if (onRevealStart) onRevealStart();
          // Wait for the bar to fade out a bit before punching the hole
          revealTimeout2 = setTimeout(startReveal, 300);
        }, 500);
      }
      setProgress(currentProgress);
    }, 80);

    const startReveal = () => {
      const pSize = window.innerWidth < 768 ? 12 : 18; // Smaller grid cell size for smaller circles
      let radius = 0;
      const maxRadius = Math.max(canvas.width, canvas.height) * 1.5;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const bandSize = 400; // Halftone transition edge width
      const maxDotSize = pSize * 0.75; // Ensures diagonal overlap

      // This makes future draw calls "erase" the existing canvas pixels
      ctx.globalCompositeOperation = 'destination-out';

      const render = () => {
        // We want the radius to eventually exceed maxRadius + bandSize.
        // We calculate distance to a target that is further away so it doesn't asymptote to 0 velocity.
        const targetRadius = maxRadius + bandSize;
        radius += (targetRadius - radius) * 0.015 + 1.0; // Buttery smooth and slower reveal

        const cols = Math.ceil(canvas.width / pSize);
        const rows = Math.ceil(canvas.height / pSize);

        // Optimize loop by only checking cells near the current radius boundary
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
                // Dot size grows from 0 to maxDotSize based on distance into the radius
                const dotRadius = Math.min((diff / bandSize) * maxDotSize, maxDotSize);

                ctx.beginPath();
                ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
                ctx.fill();

                if (dotRadius >= maxDotSize) {
                  // Fully erased, no need to redraw this grid cell in future frames
                  grid.add(key);
                }
              }
            }
          }
        }

        // We check against targetRadius so it cleanly finishes
        if (radius <= targetRadius) {
          animationFrame = requestAnimationFrame(render);
        } else {
          onComplete(); // Remove loader from DOM entirely
        }
      };

      render();
    };

    return () => {
      clearInterval(interval);
      if (revealTimeout1) clearTimeout(revealTimeout1);
      if (revealTimeout2) clearTimeout(revealTimeout2);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [onComplete, onRevealStart]);


  return (
    <div
      id="initial-loader"
      aria-hidden="true"
      className={`fixed inset-0 z-100 ${isRevealing ? 'pointer-events-none' : ''}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div
        id="loader-bar-wrapper"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ease-out ${
          isRevealing ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="relative overflow-hidden bg-border-muted/30 w-36 h-1.5 rounded-full">
          <div
            id="loader-bar"
            className="absolute top-0 bottom-0 left-0 bg-accent h-full rounded-full transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
