/**
 * Anti-ban / safe-posting heuristics for BLACKLINK AI.
 *
 * Rules (defaults — tunable per plan):
 *  - Hard cap of 4 posts per 24h per LinkedIn account.
 *  - Minimum gap of 90 minutes between two posts.
 *  - Jitter of ±18 minutes on every scheduled slot.
 *  - Reject posts that are >85% similar to the last 5 published.
 *  - Avoid more than 3 identical hashtags across the last 5 posts.
 *  - Skip windows outside the user's local 06:00–22:00.
 *
 * The goal is to look like a human creator, not a bot.
 */

export type SafetyVerdict =
  | { ok: true }
  | { ok: false; reason: string };

export type RecentPost = {
  publishedAt: Date;
  content: string;
  hashtags: string[];
};

export const SAFE_LIMITS = {
  maxPerDay: 4,
  minGapMinutes: 90,
  jitterMinutes: 18,
  similarityCutoff: 0.85,
  duplicateHashtagThreshold: 3,
  activeHoursStart: 6,
  activeHoursEnd: 22
};

export function checkPost(now: Date, scheduledFor: Date, recent: RecentPost[], content: string, hashtags: string[]): SafetyVerdict {
  // 1. Active hours
  const localHour = scheduledFor.getHours();
  if (localHour < SAFE_LIMITS.activeHoursStart || localHour >= SAFE_LIMITS.activeHoursEnd) {
    return { ok: false, reason: "Outside active hours" };
  }

  // 2. Daily cap
  const last24h = recent.filter((p) => now.getTime() - p.publishedAt.getTime() <= 24 * 60 * 60 * 1000);
  if (last24h.length >= SAFE_LIMITS.maxPerDay) {
    return { ok: false, reason: "Daily limit reached" };
  }

  // 3. Minimum gap
  const previous = last24h[0];
  if (previous) {
    const gap = (scheduledFor.getTime() - previous.publishedAt.getTime()) / 60000;
    if (gap < SAFE_LIMITS.minGapMinutes) {
      return { ok: false, reason: "Too close to previous post" };
    }
  }

  // 4. Similarity
  for (const p of recent.slice(0, 5)) {
    if (jaccard(p.content, content) > SAFE_LIMITS.similarityCutoff) {
      return { ok: false, reason: "Content too similar to a recent post" };
    }
  }

  // 5. Hashtag rotation
  const overlap = recent
    .slice(0, 5)
    .flatMap((p) => p.hashtags)
    .filter((h) => hashtags.includes(h));
  if (overlap.length >= SAFE_LIMITS.duplicateHashtagThreshold) {
    return { ok: false, reason: "Hashtags overused recently" };
  }

  return { ok: true };
}

/** Add ±jitter minutes of randomness to a planned slot. */
export function jitter(date: Date, minutes = SAFE_LIMITS.jitterMinutes): Date {
  const delta = (Math.random() * 2 - 1) * minutes * 60_000;
  return new Date(date.getTime() + delta);
}

/** Naive token-set Jaccard similarity. */
function jaccard(a: string, b: string): number {
  const tokenize = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter(Boolean)
    );
  const A = tokenize(a);
  const B = tokenize(b);
  if (A.size === 0 || B.size === 0) return 0;
  let intersection = 0;
  for (const t of A) if (B.has(t)) intersection++;
  const union = A.size + B.size - intersection;
  return intersection / union;
}
