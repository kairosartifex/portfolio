'use client';

import { useState, useEffect } from 'react';
import Loader from './Loader';

export default function InteractiveShell() {
  const [isLoading, setIsLoading] = useState(true);



  // Keyboard listener and theme restoration
  useEffect(() => {
    // Initial theme setup on mount
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'l') {
        localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
        window.dispatchEvent(new Event('theme-toggled'));
      } else if (key === 'd') {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        window.dispatchEvent(new Event('theme-toggled'));
      } else if (key === 'a') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const targetTheme = systemDark ? 'dark' : 'light';
        localStorage.setItem('theme', targetTheme);
        document.documentElement.setAttribute('data-theme', targetTheme);
        window.dispatchEvent(new Event('theme-toggled'));
      } else if (key === 's') {
        const currentMuted = localStorage.getItem('muted') === 'true';
        localStorage.setItem('muted', String(!currentMuted));
        window.dispatchEvent(new Event('sound-toggled'));
      } else if (key === 't') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (key === 'b') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return isLoading ? (
    <Loader
      onRevealStart={() => {
        document.documentElement.classList.add('loader-complete');
        window.dispatchEvent(new Event('loader-complete'));
      }}
      onComplete={() => {
        setIsLoading(false);
      }}
    />
  ) : null;
}
