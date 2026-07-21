'use client';

import { useRef } from 'react';

const GLITCH = 'XX$$%%&&##@@++==??//\\*';

interface Props { text: string; }

export default function AsciiTextReveal({ text }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef<number | null>(null);

  const scramble = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const chars = text.split('');
    let frame = 0;
    const tick = () => {
      if (!ref.current) return;
      const revealed = Math.floor(frame / 2);
      ref.current.textContent = chars
        .map((c, i) =>
          i < revealed ? c :
          i === revealed ? GLITCH[i % GLITCH.length] :
          '\u00A0'
        )
        .join('');
      if (++frame <= chars.length * 2) {
        raf.current = requestAnimationFrame(tick);
      } else {
        ref.current.textContent = text;
      }
    };
    tick();
  };

  return (
    <span
      ref={ref}
      className="inline-block whitespace-nowrap cursor-pointer"
      onMouseEnter={scramble}
    >
      {text}
    </span>
  );
}
