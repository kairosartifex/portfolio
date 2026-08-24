'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function BgmPlayer() {
  useEffect(() => {
    let mounted = true;
    let unlocked = false;
    let playLock = false;

    const TARGET_VOLUME = 0.45;

    let bgm: HTMLAudioElement | null = null;

    const getAudio = (): HTMLAudioElement => {
      if (!bgm) {
        bgm = new Audio('/audio/bgm.mp3');
        bgm.loop = true;
        bgm.volume = 0.0;
        bgm.preload = 'none';
      }
      return bgm;
    };

    const fadeAudio = (toVolume: number, onComplete?: () => void) => {
      const audio = getAudio();
      gsap.to(audio, {
        volume: toVolume,
        duration: 1,
        ease: 'power1.inOut',
        onComplete,
        overwrite: 'auto',
      });
    };

    const tryPlay = () => {
      if (!mounted || playLock) return;
      const isMuted = localStorage.getItem('muted') === 'true';
      if (isMuted) return;
      const audio = getAudio();
      if (!audio.paused) return;
      playLock = true;
      audio.volume = 0.0;
      audio.play()
        .then(() => {
          playLock = false;
          unlocked = true;
          if (mounted) {
            fadeAudio(TARGET_VOLUME);
            removeGestureListeners();
          }
        })
        .catch(() => {
          playLock = false;
          // Silently swallowed - gesture listeners will retry
        });
    };


    const syncBgm = () => {
      if (!mounted) return;
      const isMuted = localStorage.getItem('muted') === 'true';
      const audio = getAudio();
      if (isMuted) {
        fadeAudio(0, () => audio.pause());
      } else if (audio.paused) {
        tryPlay();
      } else {
        fadeAudio(TARGET_VOLUME);
      }
    };

    const onUserGesture = () => {
      const isMuted = localStorage.getItem('muted') === 'true';
      const audio = getAudio();
      if (!isMuted && audio.paused) {
        tryPlay();
      } else if (isMuted || unlocked) {
        removeGestureListeners();
      }
    };

    const addGestureListeners = () => {
      document.addEventListener('mousedown', onUserGesture, { capture: true });
      document.addEventListener('pointerdown', onUserGesture, { capture: true });
      document.addEventListener('keydown', onUserGesture, { capture: true });
      document.addEventListener('touchstart', onUserGesture, { capture: true });
    };

    const removeGestureListeners = () => {
      document.removeEventListener('mousedown', onUserGesture, true);
      document.removeEventListener('pointerdown', onUserGesture, true);
      document.removeEventListener('keydown', onUserGesture, true);
      document.removeEventListener('touchstart', onUserGesture, true);
    };

    window.addEventListener('sound-toggled', syncBgm);

    // Defer the initial playback check until 2.5 seconds after mount
    // to avoid blocking critical initial page load assets (LCP).
    // Gesture listeners will still respond immediately if the user interacts earlier.
    const initTimeout = setTimeout(() => {
      tryPlay();
    }, 2500);

    addGestureListeners();

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
      if (bgm) {
        gsap.killTweensOf(bgm);
        bgm.pause();
      }
      window.removeEventListener('sound-toggled', syncBgm);
      removeGestureListeners();
    };
  }, []);

  return null;
}
