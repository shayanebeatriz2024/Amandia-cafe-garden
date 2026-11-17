/**
 * Freio contra força bruta no login do /admin: janela fixa em memória, por IP.
 *
 * Limitação conhecida: a memória é por instância do servidor (na Vercel cada lambda tem
 * a sua). Segura tentativas em sequência; para um limite global, troque por um store
 * compartilhado (Upstash Redis, Vercel KV…).
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_TRACKED_IPS = 5000;

type Bucket = { failures: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function prune(now: number) {
  for (const [ip, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(ip);
  // Teto de memória: descarta os registros mais antigos se ainda estiver cheio.
  while (buckets.size > MAX_TRACKED_IPS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

/** Segundos até liberar, ou 0 se o IP ainda pode tentar. */
export function loginRetryAfter(ip: string, now = Date.now()): number {
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) return 0;
  return bucket.failures >= MAX_ATTEMPTS ? Math.ceil((bucket.resetAt - now) / 1000) : 0;
}

export function registerLoginFailure(ip: string, now = Date.now()): void {
  prune(now);
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) buckets.set(ip, { failures: 1, resetAt: now + WINDOW_MS });
  else bucket.failures += 1;
}

export function clearLoginFailures(ip: string): void {
  buckets.delete(ip);
}
