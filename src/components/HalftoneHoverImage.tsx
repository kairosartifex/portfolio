'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HalftoneHoverImageProps {
  primarySrc: string;
  secondarySrc?: string;
  alt: string;
  sizes?: string;
  preload?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low';
  className?: string;
}

/**
 * HalftoneHoverImage - Canvas-based halftone dot mask reveal on hover.
 *
 * Renders primary image and secondary image on a 2D canvas using
 * destination-out (punch holes in primary) followed by destination-over (fill behind holes with secondary).
 */
export default function HalftoneHoverImage({
  primarySrc,
  secondarySrc,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  preload,
  loading,
  fetchPriority,
  className = '',
}: HalftoneHoverImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryImgRef = useRef<HTMLImageElement | null>(null);
  const secondaryImgRef = useRef<HTMLImageElement | null>(null);

  const animFrameRef = useRef<number>(0);
  const progressRef = useRef(0); // 0 = primary visible, 1 = secondary visible
  const targetRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const cssWidthRef = useRef(0);
  const cssHeightRef = useRef(0);

  /** Draw image centered with object-cover fit */
  const drawImageObjectCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number,
  ) => {
    const imgW = img.naturalWidth || img.width || 1;
    const imgH = img.naturalHeight || img.height || 1;
    const imgAspect = imgW / imgH;
    const canvasAspect = w / h;
    let sx: number, sy: number, sw: number, sh: number;

    if (imgAspect > canvasAspect) {
      sh = imgH;
      sw = sh * canvasAspect;
      sx = (imgW - sw) / 2;
      sy = 0;
    } else {
      sw = imgW;
      sh = sw / canvasAspect;
      sx = 0;
      sy = (imgH - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  };

  /** Render composition on 2D canvas and punch halftone holes on hover */
  const renderCanvas = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = cssWidthRef.current || 300;
      const h = cssHeightRef.current || 200;
      if (w <= 0 || h <= 0) return;

      const primaryImg = primaryImgRef.current;
      const secondaryImg = secondaryImgRef.current;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      // 1. If progress >= 1 or no primary image, draw secondary image directly
      if (progress >= 1 && secondaryImg && secondaryImg.complete && secondaryImg.naturalWidth > 0) {
        drawImageObjectCover(ctx, secondaryImg, w, h);
        canvas.dataset.ready = 'true';
        return;
      }

      if (!primaryImg || !primaryImg.complete || primaryImg.naturalWidth === 0) {
        if (secondaryImg && secondaryImg.complete && secondaryImg.naturalWidth > 0) {
          drawImageObjectCover(ctx, secondaryImg, w, h);
          canvas.dataset.ready = 'true';
        }
        return;
      }

      // 2. Draw primary image (source-over)
      drawImageObjectCover(ctx, primaryImg, w, h);

      // 3. If progress > 0 and secondary image exists, punch halftone holes and render secondary behind
      if (progress > 0 && secondaryImg && secondaryImg.complete && secondaryImg.naturalWidth > 0) {
        // Step A: Punch halftone holes in primary image via destination-out
        ctx.globalCompositeOperation = 'destination-out';

        const pSize = w < 300 ? 6 : 10;
        const maxDotRadius = pSize * 0.78;
        const cols = Math.ceil(w / pSize);
        const rows = Math.ceil(h / pSize);
        const centerX = w / 2;
        const centerY = h / 2;
        const maxDist = Math.hypot(centerX, centerY) || 1;

        ctx.fillStyle = '#000';
        const S = 0.45;

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const px = c * pSize + pSize / 2;
            const py = r * pSize + pSize / 2;

            const dist = Math.hypot(px - centerX, py - centerY);
            const normDist = dist / maxDist;

            const localProgress = Math.max(
              0,
              Math.min(1, (progress - normDist * S) / (1 - S)),
            );

            const dotRadius = maxDotRadius * localProgress;

            if (dotRadius > 0.3) {
              ctx.beginPath();
              ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Step B: Draw secondary image BEHIND the primary image holes via destination-over
        ctx.globalCompositeOperation = 'destination-over';
        drawImageObjectCover(ctx, secondaryImg, w, h);

        ctx.globalCompositeOperation = 'source-over';
      }

      // Mark canvas as ready and dirty for WebGL CanvasTexture consumption
      if (primaryImg && primaryImg.complete && primaryImg.naturalWidth > 0) {
        canvas.dataset.ready = 'true';
        canvas.dataset.dirty = 'true';
      }
    },
    [],
  );

  /** Animation loop for smooth transition */
  const animate = useCallback(() => {
    const target = targetRef.current;
    const current = progressRef.current;
    const diff = target - current;

    const next = Math.abs(diff) < 0.004 ? target : current + diff * 0.045;
    progressRef.current = next;

    renderCanvas(next);

    if (Math.abs(next - target) > 0.001) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      isAnimatingRef.current = false;
      progressRef.current = target;
      renderCanvas(target);
    }
  }, [renderCanvas]);

  const startAnimation = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  /** Preload primary and secondary images & setup canvas sizing */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio, 2);
      const cssW = rect.width;
      const cssH = rect.height;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      cssWidthRef.current = cssW;
      cssHeightRef.current = cssH;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderCanvas(progressRef.current);
    };

    const pImg = new window.Image();
    pImg.onload = () => {
      primaryImgRef.current = pImg;
      resize();
    };
    pImg.src = primarySrc;
    if (pImg.complete && pImg.naturalWidth > 0) {
      primaryImgRef.current = pImg;
      resize();
    }

    if (secondarySrc) {
      const sImg = new window.Image();
      sImg.onload = () => {
        secondaryImgRef.current = sImg;
        resize();
      };
      sImg.src = secondarySrc;
      if (sImg.complete && sImg.naturalWidth > 0) {
        secondaryImgRef.current = sImg;
        resize();
      }
    }

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [primarySrc, secondarySrc, renderCanvas]);

  const handleMouseEnter = () => {
    if (!secondarySrc) return;
    targetRef.current = 1;
    startAnimation();
  };

  const handleMouseLeave = () => {
    if (!secondarySrc) return;
    targetRef.current = 0;
    startAnimation();
  };

  // If no secondary image, render standard Next.js Image with scroll-deformed-image
  if (!secondarySrc) {
    return (
      <Image
        src={primarySrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`scroll-deformed-image object-cover object-center transition-all duration-500 ease-out ${className}`}
        data-src={primarySrc}
        preload={preload}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto scroll-deformed-image ${className}`}
      data-src={primarySrc}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-label={alt}
      />
    </div>
  );
}
