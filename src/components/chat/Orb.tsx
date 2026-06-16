/**
 * Iriserende orb — de halo achter de chat-hero (sketch 001B + lab 004).
 *
 * Engine: @paper-design/shaders MeshGradient (vastgelegde spec uit lab 004).
 * Fallback naar een pure-CSS conic-orb bij reduced-motion, geen WebGL, of save-data.
 * De orb is puur decoratief (aria-hidden) en pauzeert offscreen / als de tab verborgen is.
 */
import { useEffect, useRef, useState } from 'react';

// Vastgelegde spec (docs/ai-chat-portfolio-research.md §8 / sketch 004).
const ORB = {
  colors: ['#00b0d5', '#6b5bff', '#c84bff', '#00d5b0', '#0064d5'],
  distortion: 0.9,
  swirl: 0.7,
  speed: 0.55,
  scale: 1,
} as const;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function saveData() {
  // @ts-expect-error - Network Information API is niet overal getypeerd
  return typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
}
function webglAvailable() {
  if (typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Orb() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  // 'css' = lichtgewicht fallback; 'gl' = Paper Shaders mesh.
  const [engine, setEngine] = useState<'gl' | 'css'>('css');

  useEffect(() => {
    if (prefersReducedMotion() || saveData() || !webglAvailable()) {
      setEngine('css');
      return;
    }
    setEngine('gl');
  }, []);

  useEffect(() => {
    if (engine !== 'gl' || !hostRef.current) return;
    const host = hostRef.current;
    // ShaderMount-instantie; we gebruiken alleen .dispose() bij cleanup.
    let mount: { dispose?: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } = await import(
          '@paper-design/shaders'
        );
        if (cancelled) return;
        const u_colors = ORB.colors.map((c) => getShaderColorFromString(c));
        const instance = new ShaderMount(
          host,
          meshGradientFragmentShader,
          {
            u_colors,
            u_colorsCount: u_colors.length,
            u_distortion: ORB.distortion,
            u_swirl: ORB.swirl,
            u_grainMixer: 0,
            u_grainOverlay: 0,
            u_fit: 1,
            u_rotation: 0,
            u_scale: ORB.scale,
            u_offsetX: 0,
            u_offsetY: 0,
            u_originX: 0.5,
            u_originY: 0.5,
            u_worldWidth: 0,
            u_worldHeight: 0,
          },
          undefined,
          ORB.speed,
        );
        mount = instance as { dispose?: () => void };
      } catch {
        if (!cancelled) setEngine('css');
      }
    })();

    return () => {
      cancelled = true;
      mount?.dispose?.();
    };
  }, [engine]);

  return (
    <div className="orb-halo" aria-hidden="true">
      {engine === 'gl' ? <div ref={hostRef} className="orb-gl" /> : <div className="orb-css" />}
    </div>
  );
}
