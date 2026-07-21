'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ShortcutPopup from '@/components/ShortcutPopup';
import AsciiTextReveal from '@/components/AsciiTextReveal';

export default function Header() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // ponytail: read initial settings from localStorage synchronously on mount to avoid unnecessary timers
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    const savedMuted = localStorage.getItem('muted');
    if (savedMuted === null) {
      localStorage.setItem('muted', 'false');
      setIsMuted(false);
    } else {
      setIsMuted(savedMuted === 'true');
    }

    // Event handlers to sync with other components/keyboard shortcuts
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };

    const handleSoundChange = () => {
      setIsMuted(localStorage.getItem('muted') === 'true');
    };

    window.addEventListener('theme-toggled', handleThemeChange);
    window.addEventListener('sound-toggled', handleSoundChange);

    return () => {
      window.removeEventListener('theme-toggled', handleThemeChange);
      window.removeEventListener('sound-toggled', handleSoundChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('theme-toggled'));
  };

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('muted', String(newMuted));
    window.dispatchEvent(new Event('sound-toggled'));
  };

  const handleNavClick = (section: 'work' | 'contact') => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).lenis) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).lenis.scrollTo(`#${section}`);
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const dottedBtnClasses =
    'relative border border-dotted border-transparent hover:border-foreground focus-visible:border-foreground px-1.5 py-1 cursor-pointer transition-all duration-300 ease-out select-none outline-none uppercase text-[0.85rem]';

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 font-secondary text-[0.85rem] text-foreground select-none"
      id="site-header"
    >
      {/* Top Header Row */}
      <div className="flex justify-between items-center p-4 md:px-10 md:py-6">
        <Link
          href="/"
          className="font-primary font-bold uppercase text-[1.1rem] tracking-wider -ml-1.5 px-1.5 py-1 border border-dotted border-transparent hover:border-foreground transition-all duration-300 ease-out select-none outline-none"
        >
          Kairos.Artifex
        </Link>

        <div
          className="relative lg:w-1/3 w-auto flex justify-end"
          onMouseOver={(e) => {
            const target = (e.target as HTMLElement).closest(
              '.theme-toggle, .sound-toggle, #shortcut-popup'
            );
            setIsPopupVisible(!!target);
          }}
          onMouseOut={(e) => {
            const related = e.relatedTarget as HTMLElement;
            if (
              !related ||
              !related.closest('.theme-toggle, .sound-toggle, #shortcut-popup')
            ) {
              setIsPopupVisible(false);
            }
          }}
        >
          <nav className="grid grid-cols-4 w-full max-lg:flex max-lg:gap-3 max-sm:gap-2 max-lg:w-auto font-tertiary" aria-label="Main Navigation">
            <button
              className={`${dottedBtnClasses} justify-self-center text-center max-lg:hidden`}
              id="nav-work-btn"
              onClick={() => handleNavClick('work')}
            >
              <AsciiTextReveal text="Work" />
            </button>
            <button
              className={`${dottedBtnClasses} justify-self-center text-center max-lg:hidden`}
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')}
            >
              <AsciiTextReveal text="Contact" />
            </button>
            <button
              className={`${dottedBtnClasses} justify-self-center text-center theme-toggle`}
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <AsciiTextReveal text={`Theme[${theme === 'dark' ? 'D' : 'L'}]`} />
            </button>
            <button
              className={`${dottedBtnClasses} justify-self-center text-center sound-toggle`}
              id="sound-toggle-btn"
              onClick={toggleSound}
              aria-label="Toggle sound"
            >
              <AsciiTextReveal text={`SOUND[${isMuted ? '-' : '\\'}]`} />
            </button>
          </nav>

          {/* Shortcut Typewriter Overlay Popup */}
          <ShortcutPopup isVisible={isPopupVisible} />
        </div>
      </div>
    </header>
  );
}
