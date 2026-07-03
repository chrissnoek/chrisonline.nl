/**
 * Iriserende orb — de halo achter de chat-hero (sketch 001B + lab 004).
 *
 * Engine: @paper-design/shaders MeshGradient (vastgelegde spec uit lab 004).
 * Fallback naar een pure-CSS conic-orb bij reduced-motion, geen WebGL, of save-data.
 * De orb is puur decoratief (aria-hidden) en pauzeert offscreen / als de tab verborgen is.
 *
 * Laadstrategie: de shader-chunk is ~59 KB gz en wordt pas geïmporteerd zodra de
 * main thread idle is (requestIdleCallback, met timeout-vangnet). Tot die tijd —
 * én tijdens het compileren van de shader — draait de CSS-orb; de WebGL-laag
 * fade't eroverheen zodra hij klaar is, dus er is nooit een leeg gat.
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
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
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
  // De GL-laag is gemount en zichtbaar; tot dan blijft de CSS-orb staan.
  const [glReady, setGlReady] = useState(false);
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

    const start = async () => {
      try {
        const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } =
          await import('@paper-design/shaders');
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
        setGlReady(true);
      } catch {
        if (!cancelled) setEngine('css');
      }
    };

    // Idle-gate voor de zware chunk; timeout-vangnet zodat hij op drukke
    // pagina's tóch binnen ~3s komt.
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => void start(), { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(() => void start(), 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      mount?.dispose?.();
      mountRef.current = null;
    };
    // `busy` bewust niet als dep: de aparte effect-hook hierboven past de
    // snelheid live aan zonder de shader opnieuw op te bouwen.
  }, [engine]);

  return (
    <div className={`orb-halo ${busy ? 'orb-halo--busy' : ''}`} aria-hidden="true">
      {engine === 'gl' ? (
        <div ref={hostRef} className={`orb-gl ${glReady ? 'orb-gl--ready' : ''}`} />
      ) : null}
      {engine === 'css' || !glReady ? <div className="orb-css" /> : null}
    </div>
  );
}
