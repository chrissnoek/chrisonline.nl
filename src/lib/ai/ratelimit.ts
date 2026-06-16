/**
 * Rate limiting + globaal dag-tokenplafond voor de publieke chat-endpoint.
 *
 * Lagen (goedkoopst eerst):
 *   1. Harde per-request caps  → staan in chat.ts (maxOutputTokens, stopWhen, msg-cap).
 *   2. Per-IP sliding window    → Upstash (10/min én 50/dag).
 *   3. Globaal dag-tokenplafond → Upstash teller, hard vangnet tegen verrassingsrekening.
 *
 * Gedrag bij storing: FAIL-OPEN op transiente Redis-fouten (beschikbaarheid boven
 * striktheid voor een portfolio), maar mét een startup-waarschuwing als de env-vars
 * ontbreken (dan staat de limiter er feitelijk niet). Het tokenplafond is het harde vangnet.
 *
 * IP: gebruik Netlify's edge-header (niet te spoofen). Zie research-notitie.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// --- afstembare limieten ---
const PER_MIN = 10; // berichten per minuut per IP
const PER_DAY = 50; // berichten per dag per IP
const DAILY_TOKEN_CEILING = 200_000; // totaal output-tokens/dag over alle bezoekers
const TOKEN_KEY_TTL_SEC = 60 * 60 * 36; // ~36u, ruim genoeg voor een UTC-dag

// import.meta.env bestaat in de Astro/Vite-runtime; defensief voor andere contexten.
const ENV = (import.meta.env ?? {}) as Record<string, string | undefined>;

function configured(): boolean {
  return Boolean(ENV.UPSTASH_REDIS_REST_URL && ENV.UPSTASH_REDIS_REST_TOKEN);
}

// Eén Redis-instantie, meerdere limiters met een EIGEN prefix (anders botsen de keys).
let _redis: Redis | null = null;
let _minLimiter: Ratelimit | null = null;
let _dayLimiter: Ratelimit | null = null;

function redis(): Redis | null {
  if (!configured()) return null;
  if (!_redis) {
    _redis = new Redis({
      url: ENV.UPSTASH_REDIS_REST_URL!,
      token: ENV.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

function limiters() {
  const r = redis();
  if (!r) return null;
  if (!_minLimiter) {
    _minLimiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(PER_MIN, '1 m'),
      prefix: 'rl:chat:min',
      analytics: false,
    });
    _dayLimiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(PER_DAY, '1 d'),
      prefix: 'rl:chat:day',
      analytics: false,
    });
  }
  return { min: _minLimiter!, day: _dayLimiter! };
}

if (!configured()) {
  // Eénmalige zichtbaarheid: zonder env-vars is de limiter uitgeschakeld (fail-open).
  console.warn('[ratelimit] Upstash env-vars ontbreken — rate limiting UITGESCHAKELD (fail-open).');
}

/** Haal het echte bezoekers-IP op (Netlify edge-header eerst, niet te spoofen). */
export function getClientIp(request: Request, clientAddress?: () => string): string {
  const nf = request.headers.get('x-nf-client-connection-ip');
  if (nf) return nf.trim();
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  try {
    const addr = clientAddress?.();
    if (addr) return addr;
  } catch {
    /* clientAddress kan throwen als de adapter geen IP heeft */
  }
  return 'unknown';
}

export type LimitResult = { ok: true } | { ok: false; reason: 'rate' | 'ceiling'; retryAfter?: number };

/** Per-IP sliding window (10/min + 50/dag). Fail-open bij Redis-storing. */
export async function checkRateLimit(ip: string): Promise<LimitResult> {
  const lim = limiters();
  if (!lim) return { ok: true }; // niet geconfigureerd → fail-open
  try {
    const [min, day] = await Promise.all([lim.min.limit(ip), lim.day.limit(ip)]);
    if (!min.success || !day.success) {
      const reset = !min.success ? min.reset : day.reset;
      return { ok: false, reason: 'rate', retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
    }
    return { ok: true };
  } catch (err) {
    console.error('[ratelimit] Redis-fout, fail-open:', err);
    return { ok: true };
  }
}

function tokenKey(): string {
  // UTC-datum; new Date() is in de Netlify-function gewoon beschikbaar (geen workflow-context).
  return `chat:tokens:${new Date().toISOString().slice(0, 10)}`;
}

/** Globaal dag-plafond: zit het al over de grens? Fail-open bij storing. */
export async function checkDailyCeiling(): Promise<LimitResult> {
  const r = redis();
  if (!r) return { ok: true };
  try {
    const used = Number((await r.get<number>(tokenKey())) ?? 0);
    if (used >= DAILY_TOKEN_CEILING) {
      return { ok: false, reason: 'ceiling' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[ratelimit] ceiling-check fout, fail-open:', err);
    return { ok: true };
  }
}

/** Tel verbruikte output-tokens op bij de dag-teller (aanroepen in streamText.onFinish). */
export async function recordTokenUsage(outputTokens: number): Promise<void> {
  if (!outputTokens || outputTokens <= 0) return;
  const r = redis();
  if (!r) return;
  try {
    const key = tokenKey();
    const total = await r.incrby(key, outputTokens);
    if (total === outputTokens) {
      // Alleen bij de eerste schrijfactie van de dag de TTL zetten.
      await r.expire(key, TOKEN_KEY_TTL_SEC);
    }
  } catch (err) {
    console.error('[ratelimit] kon tokengebruik niet opslaan:', err);
  }
}
