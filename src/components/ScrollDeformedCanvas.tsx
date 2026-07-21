'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Vertex Shader: Simulates a giant horizontal cylinder projection (spinning drum)
// where the scroll progress of each project card is animated using GSAP ScrollTrigger.
// When scrolling, the leading edge of each image (top on scroll down, bottom on scroll up) sticks directly to the
// cylinder surface, while the trailing edge flaps and curls towards the camera (+Z) before sticking back.
// When scrolling stops (velocity = 0), everything flattens out completely.
const vertexShader = `
  uniform float uVelocity;
  uniform vec2 uMeshSize;
  uniform float uViewportHeight;
  uniform float uScrollProgress;
  varying vec2 vUv;

  #define PI 3.1415926535897932384626433832795

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Get the world position of the vertex
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);

    // uVelocity is in pixels per frame. We scale it down to represent a fractional
    // displacement in the local mesh coordinates (which range from -0.5 to 0.5).
    float velocity = uVelocity * 0.001;

    // Determine the anchor and bending weight (like a cantilever beam/sticky note)
    // - If the image is at the bottom of the screen (uScrollProgress -> 0.0):
    //   the top of the image sticks (uv.y = 1, weight = 0) and the bottom lifts (uv.y = 0, weight = 1).
    // - If the image is at the top of the screen (uScrollProgress -> 1.0):
    //   the bottom of the image sticks (uv.y = 0, weight = 0) and the top lifts (uv.y = 1, weight = 1).
    // We blend between these two states smoothly based on the scroll progress in the viewport.
    float weight = (1.0 - uScrollProgress) * (1.0 - uv.y) * (1.0 - uv.y) + uScrollProgress * uv.y * uv.y;

    // Shrink the local vertex positions based on velocity for a cushioned 3D depth effect.
    // uVelocity is clamped to maxVelocity (40.0). We scale it down by up to 2% (0.02) at max speed.
    float shrink = 1.0 - (abs(uVelocity) / 40.0) * 0.02;
    pos.xy *= shrink;

    // 1. Sticky Note Flap: lifts the loose edge towards the camera (+Z)
    float zFlap = weight * abs(velocity) * 1.5 * uMeshSize.y;

    // 2. Viewport-Wide Concave Cylinder Bend (Spinning Drum)
    // A single, continuous horizontal cylinder spanning the entire screen.
    // The Z-displacement uses worldPos.y to keep all images aligned to a single viewport-wide curve,
    // bowing vertical sides inwards (hourglass shape) in perspective, while keeping horizontal edges straight.
    float radius = 1200.0;
    float theta = worldPos.y / radius;
    float zCurve = radius * (1.0 - cos(theta)) * abs(velocity) * 9.5;

    // Combine local flap (relative to mesh) with global cylinder surface curve
    pos.z += zFlap + zCurve;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment Shader: replicates object-fit: cover and handles sRGB color space conversion
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMeshSize;
  uniform vec2 uTextureSize;
  varying vec2 vUv;

  void main() {
    // Replicate object-fit: cover inside the shader
    float meshAspect = uMeshSize.x / uMeshSize.y;
    float textureAspect = uTextureSize.x / uTextureSize.y;

    vec2 uv = vUv;
    if (meshAspect > textureAspect) {
      // Mesh is wider than texture: crop vertically
      float scale = meshAspect / textureAspect;
      uv.y = (uv.y - 0.5) * (1.0 / scale) + 0.5;
    } else {
      // Mesh is taller than texture: crop horizontally
      float scale = textureAspect / meshAspect;
      uv.x = (uv.x - 0.5) * (1.0 / scale) + 0.5;
    }

    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
    #include <colorspace_fragment>
  }
`;

interface CachedBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ImageMeshItem {
  element: HTMLElement;
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  texture: THREE.Texture;
  isLoaded: boolean;
  bounds?: CachedBounds;
}

export default function ScrollDeformedCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Calculate FOV to map 1:1 pixel coords to WebGL units
    const cameraDistance = 600;
    const calculateFov = (h: number) => {
      return 2 * Math.atan(h / (2 * cameraDistance)) * (180 / Math.PI);
    };

    const camera = new THREE.PerspectiveCamera(
      calculateFov(height),
      width / height,
      0.1,
      2000
    );
    camera.position.z = cameraDistance;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,         // Disabled — saves GPU fill on scroll-heavy pages
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap at 1.5 to reduce pixel fill cost
    renderer.setSize(width, height);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Map to keep track of active meshes
    const meshItems: Map<HTMLElement, ImageMeshItem> = new Map();

    // Bounds calculator to prevent DOM layout thrashing in RAF loop
    const updateMeshBounds = (item: ImageMeshItem) => {
      const rect = item.element.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      item.bounds = {
        top: rect.top + currentScrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      };
    };

    // --- Scroll & Velocity Tracking (using GSAP quickTo for sync) ---
    let lastScrollY = window.scrollY;
    const speedTracker = { value: 0 };
    const speedTween = gsap.quickTo(speedTracker, 'value', {
      duration: 0.2, // Snappy duration for a quick, premium return-to-reset state
      ease: 'power2.out', // Snappy deceleration ease
    });

    // --- Mesh Creation & Management ---
    const geometry = new THREE.PlaneGeometry(1, 1, 24, 24); // Reduced from 32x32 — fewer vertices to transform per frame

    const createMeshForItem = (element: HTMLElement) => {
      const src = element.getAttribute('data-src') || element.getAttribute('src');
      if (!src) return;

      // Create initial material with dummy values
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uTexture: { value: new THREE.Texture() },
          uVelocity: { value: 0 },
          uMeshSize: { value: new THREE.Vector2(0, 0) },
          uTextureSize: { value: new THREE.Vector2(100, 100) },
          uViewportHeight: { value: 0 },
          uScrollProgress: { value: 0 },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const item: ImageMeshItem = {
        element,
        mesh,
        material,
        texture: new THREE.Texture(),
        isLoaded: false,
      };

      meshItems.set(element, item);
      updateMeshBounds(item);

      // Load texture
      textureLoader.load(
        src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          material.uniforms.uTexture.value = texture;
          material.uniforms.uTextureSize.value.set(
            texture.image.width,
            texture.image.height
          );
          item.texture = texture;
          item.isLoaded = true;

          // Re-calculate bounds once loaded to adjust for layout shifts
          updateMeshBounds(item);

          // Fade out the DOM image and let WebGL take over
          element.style.opacity = '0';
        },
        undefined,
        (err) => {
          console.error('Failed to load WebGL texture for image:', src, err);
        }
      );
    };

    // Scan DOM for images to bind
    const scanDOMImages = () => {
      const elements = document.querySelectorAll('.scroll-deformed-image');
      
      // Add meshes for new elements
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (!meshItems.has(htmlEl)) {
          createMeshForItem(htmlEl);
        }
      });

      // Cleanup meshes for removed elements
      for (const [el, item] of meshItems.entries()) {
        if (!document.body.contains(el)) {
          // Clean up WebGL
          scene.remove(item.mesh);
          item.material.dispose();
          item.texture.dispose();
          meshItems.delete(el);
        }
      }
    };

    // Initial scan
    scanDOMImages();

    // --- Animation / Render Loop ---
    let frameId: number;
    let scanCounter = 0;

    const tick = () => {
      // 1. Periodically check for new/dynamic images (every 60 frames = ~1 sec)
      scanCounter++;
      if (scanCounter % 60 === 0) {
        scanDOMImages();
      }

      // 2. Compute scroll velocity
      let targetVelocity = 0;
      const lenis = (window as any).lenis;
      if (lenis) {
        // Lenis velocity is smooth and direction-aware
        targetVelocity = lenis.velocity;
      } else {
        // Fallback velocity computation
        const currentScrollY = window.scrollY;
        targetVelocity = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
      }

      // Update GSAP speed tween dynamically to keep in sync
      speedTween(targetVelocity);

      // Cap velocity to prevent extreme distortion artifacts
      const maxVelocity = 40;
      const clampedVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, speedTracker.value));

      // 3. Update active meshes using cached bounds to avoid layout thrashing
      const currentScrollY = window.scrollY;
      meshItems.forEach((item) => {
        if (!item.isLoaded || !item.bounds) return;

        const bounds = item.bounds;
        const rectTop = bounds.top - currentScrollY;
        const rectLeft = bounds.left;
        const rectWidth = bounds.width;
        const rectHeight = bounds.height;
        const rectBottom = rectTop + rectHeight;

        // Check if element is in viewport (add vertical margins to prevent popping at screen edges)
        const isVisible =
          rectBottom >= -100 &&
          rectTop <= height + 100 &&
          rectLeft + rectWidth >= 0 &&
          rectLeft <= width;

        if (!isVisible) {
          item.mesh.visible = false;
          return;
        }

        item.mesh.visible = true;

        // Size match
        item.mesh.scale.set(rectWidth, rectHeight, 1);

        // Position match (convert DOM window space to WebGL center space)
        const x = rectLeft + rectWidth / 2 - width / 2;
        const y = -(rectTop + rectHeight / 2 - height / 2);
        item.mesh.position.set(x, y, 0);

        // Calculate scroll progress (0 when top enters bottom of viewport, 1 when bottom leaves top)
        const scrolled = height - rectTop;
        const totalDist = height + rectHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalDist));

        // Update uniforms
        item.material.uniforms.uVelocity.value = clampedVelocity;
        item.material.uniforms.uScrollProgress.value = progress;
        item.material.uniforms.uMeshSize.value.set(rectWidth, rectHeight);
        item.material.uniforms.uViewportHeight.value = height;
      });

      // 4. Render
      renderer.render(scene, camera);
    };

    // Synchronize updates with GSAP's ticker to eliminate any scroll jitter/lag
    gsap.ticker.add(tick);

    // --- Window Resize Handler ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      // Update camera FOV and aspect ratio
      camera.fov = calculateFov(height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer size
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Recalculate all cached bounds on resize
      meshItems.forEach((item) => {
        updateMeshBounds(item);
      });
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup on Unmount ---
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', handleResize);

      meshItems.forEach((item) => {
        item.material.dispose();
        item.texture.dispose();
      });
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100dvh',
        zIndex: 5, // Above bg waves (z-3) and dots (z-0), below main content (z-10)
        pointerEvents: 'none',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
