'use client';

import { useState, useEffect } from 'react';

const FULL_TEXT =
  'Press [L] for light mode, [D] for dark mode, [A] for auto mode, or click THEME. Press [S] to pause or resume background music, or click SOUND; your choice is saved in this browser. [T] scroll to top, [B] scroll to bottom.';

interface ShortcutPopupProps {
  isVisible: boolean;
}

export default function ShortcutPopup({ isVisible }: ShortcutPopupProps) {
  const [browserName, setBrowserName] = useState('Browser');
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) setBrowserName('Firefox');
    else if (ua.includes('Edg/')) setBrowserName('Edge');
    else if (ua.includes('Chrome')) setBrowserName('Chrome');
    else if (ua.includes('Safari')) setBrowserName('Safari');
  }, []);

  // ponytail: native setInterval typewriter animation replacing external GSAP
  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(FULL_TEXT.substring(0, index + 1));
      index++;
      if (index >= FULL_TEXT.length) {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [isVisible]);


  return (
    <div
      className={`hidden md:block absolute top-[calc(100%+0.5rem)] right-0 w-112.5 max-w-[calc(100vw-2rem)] bg-background border border-dotted border-border-muted p-5 rounded-none font-tertiary text-[0.8rem] text-muted leading-normal z-100 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] box-border ${
        isVisible
          ? 'pointer-events-auto opacity-100 translate-y-0'
          : 'pointer-events-none opacity-0 -translate-y-2.5'
      }`}
      id="shortcut-popup"
    >
      <div className="mb-5 text-left">
        <p className="relative">
          {/* Hidden spacer to reserve full height */}
          <span className="invisible" aria-hidden="true">
            {FULL_TEXT}
          </span>
          {/* Typewriter text overlaid on top */}
          <span className="absolute top-0 left-0 right-0">{displayText}</span>
        </p>
        <br />
        <div className="flex justify-between border-t border-dotted border-border-muted pt-3 text-[0.75rem] text-foreground">
          <span>{browserName}</span>
        </div>
      </div>
    </div>
  );
}
