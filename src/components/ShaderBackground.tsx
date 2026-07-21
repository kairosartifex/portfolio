'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_theme; // 0.0 for dark, 1.0 for light

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
  }

  void main() {
      // Normalize coordinates
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 st = uv;
      
      // Keep aspect ratio uniform for landscape/portrait to prevent stretching
      if (u_resolution.x > u_resolution.y) {
          st.x *= u_resolution.x / u_resolution.y;
      } else {
          st.y *= u_resolution.y / u_resolution.x;
      }

      // Calm, smooth time
      float t = u_time * 0.042;

      // Double domain-warp layer for rich but calmer liquid flow
      vec2 q = vec2(
        snoise(st * 0.38 + t * 0.3),
        snoise(st * 0.38 + t * 0.2)
      );

      vec2 r = vec2(
        snoise(st * 0.25 + q * 0.5 + t * 0.15),
        snoise(st * 0.25 + q * 0.5 + t * 0.1)
      );

      // Final noise sample (calmer, larger wave patterns)
      float f = snoise(st * 0.18 + r * 0.4);

      // Map from roughly [-1, 1] to [0, 1]
      f = f * 0.5 + 0.5;

      // Dark Mode Palette: Slightly muted, elegant royal blue (no neon harshness)
      vec3 dBase = vec3(0.02, 0.05, 0.20); // Soft deep navy
      vec3 dMid = vec3(0.08, 0.20, 0.70);  // Muted royal blue
      vec3 dHigh = vec3(0.15, 0.35, 0.85); // Soft electric blue highlight

      // Ultra-soft, fully overlapping blending so there are absolutely no sharp bands
      vec3 darkColor = mix(dBase, dMid, smoothstep(0.0, 0.7, f));
      darkColor = mix(darkColor, dHigh, smoothstep(0.3, 1.0, f));

      // Light Mode Palette: Slightly more muted and dreamy
      vec3 lBase = vec3(0.70, 0.88, 1.0);  // Soft sky blue
      vec3 lMid = vec3(0.94, 0.96, 1.0);   // Glowing soft white
      vec3 lHigh = vec3(0.98, 0.95, 0.90); // Creamy muted highlight

      // Ultra-soft blending for light mode
      vec3 lightColor = mix(lBase, lMid, smoothstep(0.0, 0.7, f));
      lightColor = mix(lightColor, lHigh, smoothstep(0.3, 1.0, f));

      // Interpolate themes
      vec3 color = mix(darkColor, lightColor, u_theme);

      // Ultra-soft vignette that doesn't crush colors to black
      float dist = length(uv - vec2(0.5));
      
      // Weaker vignette to keep the colors popping
      float vignetteDark = smoothstep(1.5, 0.4, dist); 
      float vignetteLight = smoothstep(1.5, 0.2, dist) * 0.15 + 0.85;
      
      color *= mix(vignetteDark, vignetteLight, u_theme);

      gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface Particle {
  x: number;
  y: number;
  life: number;
  state: 'in' | 'out';
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const fadeBgRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');
  const [isReady, setIsReady] = useState(false);

  const targetThemeRef = useRef(0.0);
  const currentThemeRef = useRef(0.0);

  const isHeroVisibleRef = useRef(true);
  const loopRunningRef = useRef(false);

  // Decoupled theme state tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    targetThemeRef.current = savedTheme === 'light' ? 1.0 : 0.0;
    currentThemeRef.current = savedTheme === 'light' ? 1.0 : 0.0;

    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem('theme') || 'dark';
      setTheme(updatedTheme);
      targetThemeRef.current = updatedTheme === 'light' ? 1.0 : 0.0;
    };

    window.addEventListener('theme-toggled', handleThemeChange);
    return () => window.removeEventListener('theme-toggled', handleThemeChange);
  }, []);

  // Track loader completion
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (document.documentElement.classList.contains('loader-complete')) {
      setIsReady(true);
      return;
    }

    const handleLoader = () => setIsReady(true);
    window.addEventListener('loader-complete', handleLoader);
    return () => window.removeEventListener('loader-complete', handleLoader);
  }, []);

  // WebGL Fluid Background Lifecycle & Smart Viewport Resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Compile Shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    // Create Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Create Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const themeLocation = gl.getUniformLocation(program, 'u_theme');

    const isMobileDevice = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    let lastWidth = window.innerWidth;

    // Smart Resize Handler (Avoids rebuilds on minor height changes like mobile URL bar hides)
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Cap resolution to 1.5 on high-DPI desktop, and lock to 1.0 on mobile to optimize GPU fragment filling
      const dpr = isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

      const widthChanged = width !== lastWidth;
      const heightChangedSignificant = Math.abs(height - (canvas.height / dpr)) > 80;

      if (widthChanged || heightChangedSignificant) {
        lastWidth = width;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const startTime = Date.now();

    // Render loop
    const render = () => {
      if (!loopRunningRef.current) return;

      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, currentTime);

      // Smooth theme transitions
      currentThemeRef.current += (targetThemeRef.current - currentThemeRef.current) * 0.05;
      gl.uniform1f(themeLocation, currentThemeRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (loopRunningRef.current) return;
      loopRunningRef.current = true;
      render();
    };

    const stopLoop = () => {
      if (!loopRunningRef.current) return;
      loopRunningRef.current = false;
      cancelAnimationFrame(animationFrameId);
    };

    // Intersection Observer to suspend WebGL frame generation when Hero is scrolled out of viewport
    let observer: IntersectionObserver | null = null;
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isHeroVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.0 }
      );
      observer.observe(heroElement);
    } else {
      // Fallback: start loop if Hero element is not yet found
      startLoop();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      stopLoop();
      if (observer) {
        observer.disconnect();
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  // HTML5 Canvas Pixel mouse trail (Disabled on touch devices for zero event overhead)
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;

    const isMobileOrTablet = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    if (isMobileOrTablet) {
      // Hide and skip rendering completely on mobile/tablets to preserve processor capacity
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const gridSize = 18; // Size of grid blocks
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let currentMousePos = { x: -1000, y: -1000 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target && target.closest('#site-header')) {
        currentMousePos = { x: -1000, y: -1000 };
        lastMouseX = -1000;
        lastMouseY = -1000;
        return;
      }

      currentMousePos = { x: mouseX, y: mouseY };

      if (lastMouseX === -1000) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }

      const distance = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      const steps = Math.max(1, Math.ceil(distance / gridSize));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = lastMouseX + (mouseX - lastMouseX) * t;
        const y = lastMouseY + (mouseY - lastMouseY) * t;

        const gridX = Math.floor(x / gridSize) * gridSize;
        const gridY = Math.floor(y / gridSize) * gridSize;

        const existing = particles.find((p) => p.x === gridX && p.y === gridY);
        if (existing) {
          existing.state = 'in';
        } else {
          particles.push({ x: gridX, y: gridY, life: 0.0, state: 'in' });
        }
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const style = getComputedStyle(document.body);
      const accentColor = style.getPropertyValue('--accent').trim() || style.getPropertyValue('--color-accent').trim() || '#C6FD50';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.state === 'in') {
          p.life += 0.15; // Quick responsive fade in
          if (p.life >= 1.0) {
            p.life = 1.0;
            p.state = 'out';
          }
        } else {
          p.life -= 0.05; // Fade out trailing blocks
        }

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          // Cubic ease-out interpolation
          const easeLife = p.life * p.life * (3 - 2 * p.life);

          ctx.globalAlpha = easeLife;
          ctx.fillStyle = accentColor;

          const size = gridSize * easeLife;
          const offset = (gridSize - size) / 2;

          ctx.fillRect(p.x + offset, p.y + offset, size, size);
        }
      }

      // Keep pixel under cursor at 100% visibility
      if (currentMousePos.x !== -1000) {
        const currentGridX = Math.floor(currentMousePos.x / gridSize) * gridSize;
        const currentGridY = Math.floor(currentMousePos.y / gridSize) * gridSize;
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 1.0;
        ctx.fillRect(currentGridX, currentGridY, gridSize, gridSize);
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP ScrollTrigger to fade overlays when scrolling past Hero section to content sections
  useEffect(() => {
    if (!isReady) return;

    let anim1: gsap.core.Tween;
    let anim2: gsap.core.Tween;

    // Small delay to ensure DOM and other components are fully painted
    const timer = setTimeout(() => {
      const bioSection = document.querySelector('.bio-section');

      if (bioSection) {
        if (fadeBgRef.current) {
          anim1 = gsap.to(fadeBgRef.current, {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: bioSection,
              start: 'top 90%', // Fade in as soon as bio top enters viewport
              end: 'top 0%',    // Fully solid color background when top of bio hits top of screen
              scrub: 0.5,
            },
          });
        }
        if (overlayRef.current) {
          anim2 = gsap.to(overlayRef.current, {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: bioSection,
              start: 'top 90%',
              end: 'top 0%',
              scrub: 0.5,
            },
          });
        }
      }

      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (anim1) anim1.kill();
      if (anim2) anim2.kill();
      
      const bioSection = document.querySelector('.bio-section');

      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === bioSection) {
          t.kill();
        }
      });
    };
  }, [isReady]);

  return (
    <>
      {/* Background WebGL wave shader (Layered behind everything) */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100dvh', 
          zIndex: -3, 
          pointerEvents: 'none',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: '100%', 
            height: '100dvh', 
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
            touchAction: 'none'
          }} 
        />
      </div>
      
      {/* Solid backdrop overlay that matches background color and fades in on scroll */}
      <div 
        ref={fadeBgRef} 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100dvh', 
          zIndex: -2, 
          background: theme === 'dark' ? '#0A0A0A' : '#E6E6E6', 
          opacity: 0, 
          pointerEvents: 'none',
          userSelect: 'none',
          touchAction: 'none',
          willChange: 'opacity'
        }} 
      />
      
      {/* Pixel mouse trail overlay */}
      <canvas 
        ref={overlayRef} 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100dvh', 
          zIndex: 40, // Layered on top of page content, but below fixed header/widgets
          opacity: 0,   // Hidden in hero section, fades in as we scroll to bio
          pointerEvents: 'none',
          userSelect: 'none',
          touchAction: 'none',
          willChange: 'opacity'
        }} 
      />
    </>
  );
}
