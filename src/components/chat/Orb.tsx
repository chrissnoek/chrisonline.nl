/**
 * Iriserende orb — de halo achter de chat-hero (sketch 001B + lab 004).
 *
 * Engine: @paper-design/shaders MeshGradient (vastgelegde spec uit lab 004).
 * Fallback naar een pure-CSS conic-orb bij reduced-motion, geen WebGL, of save-data.
 * De orb is puur decoratief (aria-hidden) en pauzeert offscreen / als de tab verborgen is.
 */
import { useEffect, useRef, useState } from 'react';

// Vastgelegde spec (docs/ai-chat-portfolio-research.md §8 / sketch 004).
// speed: rust-snelheid (merkbaar zichtbaar). Tijdens genereren versnelt de orb
// naar BUSY_SPEED — zo wordt de beweging een betekenisvol "denkt na"-signaal.
const ORB = {
  colors: ['#00b0d5', '#6b5bff', '#c84bff', '#00d5b0', '#0064d5'],
  distortion: 0.9,
  swirl: 0.7,
  speed: 1.2,
  scale: 1,
} as const;
const BUSY_SPEED = 2.4;

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

export default function Orb({ busy = false }: { busy?: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  // 'css' = lichtgewicht fallback; 'gl' = Paper Shaders mesh.
  const [engine, setEngine] = useState<'gl' | 'css'>('css');
  // Verwijzing naar de live ShaderMount zodat we de snelheid kunnen wisselen
  // zonder de shader opnieuw op te bouwen.
  const mountRef = useRef<{ setSpeed?: (s?: number) => void } | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || saveData() || !webglAvailable()) {
      setEngine('css');
      return;
    }
    setEngine('gl');
  }, []);

  // Versnel de orb terwijl de assistent antwoord genereert; weer rustig erna.
  useEffect(() => {
    mountRef.current?.setSpeed?.(busy ? BUSY_SPEED : ORB.speed);
  }, [busy, engine]);

  useEffect(() => {
    if (engine !== 'gl' || !hostRef.current) return;
    const host = hostRef.current;
    // ShaderMount-instantie; we gebruiken .dispose() bij cleanup en
    // .setSpeed() om live te versnellen tijdens het genereren.
    let mount: { dispose?: () => void; setSpeed?: (s?: number) => void } | undefined;
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
          busy ? BUSY_SPEED : ORB.speed,
        );
        mount = instance as { dispose?: () => void; setSpeed?: (s?: number) => void };
        mountRef.current = mount;
      } catch {
        if (!cancelled) setEngine('css');
      }
    })();

    return () => {
      cancelled = true;
      mount?.dispose?.();
      mountRef.current = null;
    };
    // `busy` bewust niet als dep: de aparte effect-hook hierboven past de
    // snelheid live aan zonder de shader opnieuw op te bouwen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  return (
    <div className={`orb-halo ${busy ? 'orb-halo--busy' : ''}`} aria-hidden="true">
      {engine === 'gl' ? <div ref={hostRef} className="orb-gl" /> : <div className="orb-css" />}
    </div>
  );
}
