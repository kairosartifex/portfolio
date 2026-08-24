'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Vertex Shader: Simulates a giant horizontal cylinder projection (spinning drum)
// where the scroll progress of each project card is animated using GSAP ScrollTrigger.
// When scrolling, the leading edge of each image sticks directly to the
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
    // displacement in the local mesh coordinates.
    float velocity = uVelocity * 0.001;

    // Determine anchor and bending weight
    float weight = (1.0 - uScrollProgress) * (1.0 - uv.y) * (1.0 - uv.y) + uScrollProgress * uv.y * uv.y;

    // Shrink local vertex positions based on velocity for a cushioned 3D depth effect.
    float shrink = 1.0 - (abs(uVelocity) / 40.0) * 0.02;
    pos.xy *= shrink;

    // 1. Sticky Note Flap: lifts the loose edge towards the camera (+Z)
    float zFlap = weight * abs(velocity) * 1.5 * uMeshSize.y;

    // 2. Viewport-Wide Concave Cylinder Bend (Spinning Drum)
    float radius = 1200.0;
    float theta = worldPos.y / radius;
    float zCurve = radius * (1.0 - cos(theta)) * abs(velocity) * 9.5;

    // Combine local flap with global cylinder surface curve
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
    float meshAspect = uMeshSize.x / uMeshSize.y;
    float textureAspect = uTextureSize.x / uTextureSize.y;

    vec2 uv = vUv;
    if (meshAspect > textureAspect) {
      float scale = meshAspect / textureAspect;
      uv.y = (uv.y - 0.5) * (1.0 / scale) + 0.5;
    } else {
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
  isCanvasTexture?: boolean;
  canvasElement?: HTMLCanvasElement;
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

    const cameraDistance = 600;
    const calculateFov = (h: number) => {
      return (2 * Math.atan(h / 2 / cameraDistance) * 180) / Math.PI;
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
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);

    const textureLoader = new THREE.TextureLoader();
    const meshItems: Map<HTMLElement, ImageMeshItem> = new Map();

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

    let lastScrollY = window.scrollY;
    const speedTracker = { value: 0 };
    const speedTween = gsap.quickTo(speedTracker, 'value', {
      duration: 0.2,
      ease: 'power2.out',
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 24, 24);

    const createMeshForItem = (element: HTMLElement) => {
      const innerCanvas = element.querySelector('canvas') || (element instanceof HTMLCanvasElement ? element : null);
      const src = element.getAttribute('data-src') || element.getAttribute('src');

      if (!innerCanvas && !src) return;

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

      if (innerCanvas && innerCanvas.dataset.ready === 'true') {
        // Bind live 2D canvas as a WebGL CanvasTexture
        const canvasTexture = new THREE.CanvasTexture(innerCanvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        canvasTexture.minFilter = THREE.LinearFilter;
        canvasTexture.magFilter = THREE.LinearFilter;

        material.uniforms.uTexture.value = canvasTexture;
        material.uniforms.uTextureSize.value.set(
          innerCanvas.width || 300,
          innerCanvas.height || 200
        );

        item.texture = canvasTexture;
        item.isCanvasTexture = true;
        item.canvasElement = innerCanvas;
        item.isLoaded = true;

        updateMeshBounds(item);
        element.style.opacity = '0';
      } else if (src) {
        // Load static image texture for standard images
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

            updateMeshBounds(item);
            element.style.opacity = '0';
          },
          undefined,
          (err) => {
            console.error('Failed to load WebGL texture for image:', src, err);
          }
        );
      }
    };

    const scanDOMImages = () => {
      const elements = document.querySelectorAll('.scroll-deformed-image');
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (!meshItems.has(htmlEl)) {
          createMeshForItem(htmlEl);
        } else {
          // If mesh was created before innerCanvas was ready, upgrade it once dataset.ready is true
          const item = meshItems.get(htmlEl);
          if (item && !item.isCanvasTexture) {
            const innerCanvas = htmlEl.querySelector('canvas');
            if (innerCanvas && innerCanvas.dataset.ready === 'true') {
              const canvasTexture = new THREE.CanvasTexture(innerCanvas);
              canvasTexture.colorSpace = THREE.SRGBColorSpace;
              canvasTexture.minFilter = THREE.LinearFilter;
              canvasTexture.magFilter = THREE.LinearFilter;

              item.material.uniforms.uTexture.value = canvasTexture;
              item.material.uniforms.uTextureSize.value.set(
                innerCanvas.width || 300,
                innerCanvas.height || 200
              );

              item.texture = canvasTexture;
              item.isCanvasTexture = true;
              item.canvasElement = innerCanvas;
              item.isLoaded = true;

              htmlEl.style.opacity = '0';
            }
          }
        }
      });

      for (const [el, item] of meshItems.entries()) {
        if (!document.body.contains(el)) {
          scene.remove(item.mesh);
          item.material.dispose();
          item.texture.dispose();
          meshItems.delete(el);
        }
      }
    };

    scanDOMImages();

    let scanCounter = 0;

    const tick = () => {
      let targetVelocity = 0;
      const lenis = (window as any).lenis;
      if (lenis) {
        targetVelocity = lenis.velocity;
      } else {
        const currentScrollY = window.scrollY;
        targetVelocity = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
      }

      speedTween(targetVelocity);

      const maxVelocity = 40;
      const clampedVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, speedTracker.value));

      scanCounter++;
      // Only scan DOM when nearly stationary to avoid layout/query overhead during active scrolling
      if (scanCounter % 60 === 0 && Math.abs(clampedVelocity) < 0.5) {
        scanDOMImages();
      }

      const currentScrollY = window.scrollY;

      meshItems.forEach((item) => {
        if (!item.isLoaded || !item.bounds) return;

        const bounds = item.bounds;
        const rectTop = bounds.top - currentScrollY;
        const rectLeft = bounds.left;
        const rectWidth = bounds.width;
        const rectHeight = bounds.height;
        const rectBottom = rectTop + rectHeight;

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

        // Stream live canvas texture updates to WebGL ONLY when canvas is marked dirty by hover animation
        if (item.isCanvasTexture && item.canvasElement) {
          if (item.canvasElement.dataset.dirty === 'true') {
            (item.material.uniforms.uTexture.value as THREE.CanvasTexture).needsUpdate = true;
            item.canvasElement.dataset.dirty = 'false';
            item.material.uniforms.uTextureSize.value.set(
              item.canvasElement.width || 300,
              item.canvasElement.height || 200
            );
          }
        }

        item.mesh.scale.set(rectWidth, rectHeight, 1);

        const x = rectLeft + rectWidth / 2 - width / 2;
        const y = -(rectTop + rectHeight / 2 - height / 2);
        item.mesh.position.set(x, y, 0);

        const scrolled = height - rectTop;
        const totalDist = height + rectHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalDist));

        item.material.uniforms.uVelocity.value = clampedVelocity;
        item.material.uniforms.uScrollProgress.value = progress;
        item.material.uniforms.uMeshSize.value.set(rectWidth, rectHeight);
        item.material.uniforms.uViewportHeight.value = height;
      });

      renderer.render(scene, camera);
    };

    gsap.ticker.add(tick);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.fov = calculateFov(height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      meshItems.forEach((item) => {
        updateMeshBounds(item);
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', handleResize);

      meshItems.forEach((item) => {
        item.element.style.opacity = '1';
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
        zIndex: 5,
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
