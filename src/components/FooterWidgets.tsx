'use client';

// ponytail: consolidated Clock, Coordinates, and Globe widgets into a single footer file to remove 3 files and boilerplate imports

import { useState, useEffect, useRef } from 'react';

function ClockWidget() {
  const [timeStr, setTimeStr] = useState('--:--:--');

  useEffect(() => {
    const updateClock = () => {
      setTimeStr(
        new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="font-secondary text-[0.85rem] uppercase -ml-1.5 px-1.5 py-1 text-muted"
      id="clock-widget"
    >
      IST Mumbai {timeStr}
    </span>
  );
}

function CoordinatesWidget() {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (elRef.current) {
        const x = String(e.clientX).padStart(4, '0');
        const y = String(e.clientY).padStart(4, '0');
        elRef.current.textContent = `${x} X ${y} Y`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <span
      ref={elRef}
      className="hidden md:inline-block absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto font-secondary text-[0.85rem] uppercase px-1.5 py-1 text-muted"
      id="coordinates-widget"
    >
      0000 X 0000 Y
    </span>
  );
}

function GlobeWidget() {
  const offsets = [0, -433.333, -866.667, -1300, -1733.333, -2166.667];

  return (
    <div className="flex items-center justify-end pointer-events-auto" id="globe-widget">
      <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-12 h-6 text-foreground opacity-80 hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer"
      >
        <ellipse
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          cx="24"
          cy="12"
          rx="22"
          ry="11"
        />
        <path stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M2 12H46" />
        {offsets.map((begin, i) => (
          <g key={i} transform="translate(24 12)">
            <g>
              <animateTransform
                attributeName="transform"
                type="scale"
                dur="2600ms"
                repeatCount="indefinite"
                values="1 1;-1 1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.42 0 0.58 1"
                begin={`${begin}ms`}
              />
              <path
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                d="M24 23C11.8497 23 2 18.0751 2 12C2 5.92487 11.8497 1 24 1"
                transform="translate(-24 -12)"
              />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function FooterWidgets() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full pointer-events-none z-50 hidden md:flex justify-between items-center p-4 md:px-10 md:py-6"
      id="site-footer-widgets"
    >
      <ClockWidget />
      <CoordinatesWidget />
      <GlobeWidget />
    </div>
  );
}
