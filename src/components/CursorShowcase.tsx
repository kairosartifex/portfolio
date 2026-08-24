'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface StarLine {
  angle: number;
  speed: number;       // multiplier for how fast this line extends
  color: string;
  width: number;
  offset: number;      // slight radial offset so lines don't all start at same point
  radialOffset: number; // random starting offset multiplier from center
}

const STARBURST_COLORS = [
  '#00a3ff', // neon electric blue
  '#00e5ff', // neon cyan
  '#bb66ff', // neon purple
  '#7000ff', // deep indigo/violet
];

function createStarLines(count: number): StarLine[] {
  const lines: StarLine[] = [];
  for (let i = 0; i < count; i++) {
    lines.push({
      angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15,
      speed: 0.8 + Math.random() * 0.7,
      color: STARBURST_COLORS[Math.floor(Math.random() * STARBURST_COLORS.length)],
      width: 2.0 + Math.random() * 3.0,
      offset: Math.random(), // random start phase offset
      radialOffset: 0.04 + Math.random() * 0.11, // randomized offset from 4% to 15% of maxRadius to create a soft, feathered boundary
    });
  }
  return lines;
}

function drawStarburst(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,   // 0→1 for each burst phase
  lines: StarLine[]
) {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.hypot(cx, cy) * 1.2;

  ctx.clearRect(0, 0, width, height);

  // Global opacity: fade in from 0→0.15 progress, full 0.15→0.85, fade out 0.85→1
  let globalAlpha = 1;
  if (progress < 0.15) globalAlpha = progress / 0.15;
  else if (progress > 0.85) globalAlpha = (1 - progress) / 0.15;

  lines.forEach((line) => {
    // Cycle the particle progress to create a continuous flow as the user scrolls
    const progressOffset = (progress * 1.6 + line.offset) % 1.0;

    // Simulate 3D Z depth (1.0 = far/center, 0.08 = extremely close to camera/viewer)
    const endZ = 0.08 + (1.0 - progressOffset) * 0.92;
    // Perspective projection division (1/Z) creates natural acceleration as it approaches
    const endDist = (1.0 / endZ - 1.0) * maxRadius * 0.22;

    // Start point of the trail (deeper/further away than end point)
    const startProgress = Math.max(0, progressOffset - 0.16 * line.speed);
    const startZ = 0.08 + (1.0 - startProgress) * 0.92;
    const startDist = (1.0 / startZ - 1.0) * maxRadius * 0.22;

    const startOffset = maxRadius * line.radialOffset;
    const x1 = cx + Math.cos(line.angle) * (startOffset + startDist);
    const y1 = cy + Math.sin(line.angle) * (startOffset + startDist);
    const x2 = cx + Math.cos(line.angle) * (startOffset + endDist);
    const y2 = cy + Math.sin(line.angle) * (startOffset + endDist);

    // Width scales up significantly as the line approaches the camera (perspective thickness)
    const currentWidth = line.width * (0.4 + (1.0 / endZ - 1.0) * 0.35);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = currentWidth;
    ctx.globalAlpha = globalAlpha * (0.6 + 0.4 * line.speed);
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
}

interface CursorModelProps {
  zoomRef: React.MutableRefObject<number>;
  rotateRef: React.MutableRefObject<number>;
}

function CursorModel({ zoomRef, rotateRef }: CursorModelProps) {
  const { scene } = useGLTF('/model/cursor-3d.glb');
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene, manually center geometry, and configure standard material
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    
    // Center geometry at origin
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);
    
    // Set up standard solid material
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#008eff"),
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          opacity: 0.95,
        });
      }
    });
    
    return clone;
  }, [scene]);

  // Cache material refs once - avoids a full scene-graph traverse on every useFrame tick
  const materials = React.useMemo(() => {
    const mats: THREE.MeshStandardMaterial[] = [];
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        mats.push((child as THREE.Mesh).material as THREE.MeshStandardMaterial);
      }
    });
    return mats;
  }, [clonedScene]);

  const isMobile = viewport.width < 5.5;
  const baseScale = Math.min(viewport.width, viewport.height) * (isMobile ? 0.65 : 0.35);

  useFrame(() => {
    if (!groupRef.current || !zoomRef || !rotateRef) return;
    const z = zoomRef.current;    // 0→1 driven by zoom timeline
    const r = rotateRef.current;  // 0→1 driven by rotation timeline

    // Scale: grow from 1x to 4x to maintain shape and depth profile as it approaches
    const scaleFactor = 1 + z * 3.0;
    const s = baseScale * scaleFactor;
    groupRef.current.scale.set(s, s, s);

    // Physically move the model forward in Z space (towards the camera at Z = 5)
    // Going to Z = 5.3 moves it past the camera for a realistic 3D perspective fly-through
    groupRef.current.position.z = z * 5.3;

    // Reorder rotation axes to YXZ so Y-axis rotation is applied first, then X, then Z
    groupRef.current.rotation.reorder('YXZ');

    // Tilt X (flat): 0 → 72 degrees (tilts flat relative to camera face)
    groupRef.current.rotation.x = r * (Math.PI * 0.4);

    // Keep Y rotation static at Math.PI / 2 so the arrow points top-left facing front at the start
    groupRef.current.rotation.y = Math.PI / 2;

    // Spin Z (diagonal): 0 → -180 degrees spin in screen-space (exactly 180 degrees)
    groupRef.current.rotation.z = -r * Math.PI;

    // Fade out: update cached materials directly - no per-frame scene graph walk
    const opacity = (1 - Math.pow(z, 2)) * 0.95;
    materials.forEach(mat => { mat.opacity = opacity; });
  });

  return (
    <group ref={groupRef}>
      <group scale={[baseScale, baseScale, baseScale]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

export default function CursorShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const starburstCanvasRef = useRef<HTMLCanvasElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);

  // Lazy load Environment to optimize FCP/LCP load performance
  const [loadEnv, setLoadEnv] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadEnv(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Shared progress values driven by GSAP
  const cursorZoomRef = useRef(0);      // 0→1: zoom progress
  const cursorRotateRef = useRef(0);    // 0→1: rotation progress
  const burst1ProgressRef = useRef(0);   // 0→1: first starburst
  const burst2ProgressRef = useRef(0);   // 0→1: second starburst
  const text1OpacityRef = useRef(0);
  const text2OpacityRef = useRef(0);

  // Starburst line configs (stable across renders)
  const linesRef = useRef<StarLine[]>(createStarLines(350));
  const lines2Ref = useRef<StarLine[]>(createStarLines(350));

  // GSAP ScrollTrigger timeline
  useEffect(() => {
    if (!containerRef.current) return;

    // Proxy object for GSAP to tween (using separate sub-objects to prevent GSAP conflicts)
    const zoomProxy = { val: 0 };
    const rotateProxy = { val: 0 };
    const textProxy = {
      burst1P: 0,
      burst2P: 0,
      text1O: 0,
      text2O: 0,
    };

    const currentContainer = containerRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: currentContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        pin: stickyRef.current!,
        pinSpacing: true,
        anticipatePin: 1,
      },
      defaults: { ease: 'none' },
    });

    // Phase 1: Cursor zoom (starts at 15% scroll, ends at 35% scroll)
    tl.to(zoomProxy, {
      val: 1,
      duration: 20,
      ease: 'power2.inOut',
      onUpdate: () => {
        cursorZoomRef.current = zoomProxy.val;
      },
    }, 15);

    // Phase 1: Cursor rotation (starts at 15% scroll, ends at 30% scroll - completes early!)
    tl.to(rotateProxy, {
      val: 1,
      duration: 15,
      ease: 'power2.out',
      onUpdate: () => {
        cursorRotateRef.current = rotateProxy.val;
      },
    }, 15);

    // Phase 2: Text 1 fade in (starts at 25% scroll, ends at 35% scroll)
    tl.to(textProxy, {
      text1O: 1,
      duration: 10,
      onUpdate: () => {
        text1OpacityRef.current = textProxy.text1O;
      },
    }, 25);

    // Phase 2: First starburst/confetti (starts at 30% scroll, ends at 50% scroll)
    tl.to(textProxy, {
      burst1P: 1,
      duration: 20,
      onUpdate: () => {
        burst1ProgressRef.current = textProxy.burst1P;
      },
    }, 30);

    // Phase 2: Text 1 fade out (starts at 50% scroll, ends at 56% scroll)
    tl.to(textProxy, {
      text1O: 0,
      duration: 6,
      onUpdate: () => {
        text1OpacityRef.current = textProxy.text1O;
      },
    }, 50);

    // Phase 3: Text 2 fade in (starts at 60% scroll, ends at 70% scroll)
    tl.to(textProxy, {
      text2O: 1,
      duration: 10,
      onUpdate: () => {
        text2OpacityRef.current = textProxy.text2O;
      },
    }, 60);

    // Phase 3: Second starburst/confetti (starts at 65% scroll, ends at 85% scroll)
    tl.to(textProxy, {
      burst2P: 1,
      duration: 20,
      onUpdate: () => {
        burst2ProgressRef.current = textProxy.burst2P;
      },
    }, 65);

    // Phase 3: Text 2 fade out (starts at 85% scroll, ends at 91% scroll)
    tl.to(textProxy, {
      text2O: 0,
      duration: 6,
      onUpdate: () => {
        text2OpacityRef.current = textProxy.text2O;
      },
    }, 85);

    // Phase 4: Bring 3D cursor back and rotate it back (starts at 82% scroll, ends at 97% scroll)
    tl.to(zoomProxy, {
      val: 0,
      duration: 15,
      ease: 'power2.inOut',
      onUpdate: () => {
        cursorZoomRef.current = zoomProxy.val;
      },
    }, 82);

    tl.to(rotateProxy, {
      val: 0,
      duration: 15,
      ease: 'power2.inOut',
      onUpdate: () => {
        cursorRotateRef.current = rotateProxy.val;
      },
    }, 82);

    // Starburst canvas drawing loop
    const canvas = starburstCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!starburstCanvasRef.current || !containerRef.current) return;
      const canvas = starburstCanvasRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let rafId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw burst 1
      if (burst1ProgressRef.current > 0.01) {
        drawStarburst(ctx, w, h, burst1ProgressRef.current, linesRef.current);
      }

      // Draw burst 2 (layered on top)
      if (burst2ProgressRef.current > 0.01) {
        drawStarburst(ctx, w, h, burst2ProgressRef.current, lines2Ref.current);
      }

      // Update text opacity via DOM
      if (text1Ref.current) {
        text1Ref.current.style.opacity = String(text1OpacityRef.current);
      }
      if (text2Ref.current) {
        text2Ref.current.style.opacity = String(text2OpacityRef.current);
      }

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      tl.kill();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[225vh] max-md:h-[150vh]">
      <div ref={stickyRef} className="relative w-full h-screen overflow-hidden bg-transparent">

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-1">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            className="block w-full h-full"
          >
            <ambientLight intensity={0.3} />
            <directionalLight position={[8, 8, 4]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[-8, -8, -4]} intensity={1.2} color="#8888ff" />
            <pointLight position={[0, 3, 2]} intensity={1.8} color="#c0fe04" />
            {loadEnv && <Environment preset="city" />}
            <CursorModel zoomRef={cursorZoomRef} rotateRef={cursorRotateRef} />
          </Canvas>
        </div>

        {/* Starburst canvas */}
        <canvas
          ref={starburstCanvasRef}
          className="absolute inset-0 z-2 pointer-events-none w-full h-full"
        />

        {/* Text overlays */}
        <div ref={text1Ref} className="absolute inset-0 z-3 flex items-center justify-center text-center p-10 max-md:p-4 pointer-events-none" style={{ opacity: 0 }}>
          <h2 className="font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[2.2rem] font-light uppercase leading-[0.95] tracking-tight text-foreground m-0">
            Designed with intention.
            <br />
            Built for impact.
          </h2>
        </div>

        <div ref={text2Ref} className="absolute inset-0 z-3 flex items-center justify-center text-center p-10 max-md:p-4 pointer-events-none" style={{ opacity: 0 }}>
          <h2 className="font-primary text-[clamp(2.5rem,8.5vw,7.5rem)] max-md:text-[2.2rem] font-light uppercase leading-[0.95] tracking-tight text-foreground m-0">
            Independent
            <br />
            Creative Studio
          </h2>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/model/cursor-3d.glb');
