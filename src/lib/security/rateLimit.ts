/**
 * In-memory token-bucket rate limiter. Replace with Upstash/Redis in production.
 */

const buckets = new Map<string, { tokens: number; updated: number }>();

export type RateLimitOptions = {
  capacity: number;
  refillPerSecond: number;
};

export function rateLimit(key: string, opts: RateLimitOptions): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: opts.capacity, updated: now };
  const elapsed = (now - bucket.updated) / 1000;
  bucket.tokens = Math.min(opts.capacity, bucket.tokens + elapsed * opts.refillPerSecond);
  bucket.updated = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return { ok: false, remaining: 0 };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.floor(bucket.tokens) };
}

export function clientKey(req: Request, suffix = "") {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return `${ip}:${suffix}`;
}
