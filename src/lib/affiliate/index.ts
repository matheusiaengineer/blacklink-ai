/**
 * BLACKLINK AI — Affiliate / Referral engine.
 *
 * - 30% recurring commission for the lifetime of the referred user.
 * - Codes are 8-char base32, stored alongside the user.
 * - Leaderboard recomputed daily; badges unlock at 5/25/100 referrals.
 *
 * Universal: uses Web Crypto so it can run in both server and edge runtimes.
 */

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export const AFFILIATE_RATE = 0.3;

export const AFFILIATE_TIERS = [
  { id: "spark", min: 1, label: "Spark", reward: "Profile boost" },
  { id: "wave", min: 5, label: "Wave", reward: "30 days Pro" },
  { id: "ascend", min: 25, label: "Ascend", reward: "Custom URL + badge" },
  { id: "elite", min: 100, label: "Elite", reward: "Lifetime Pro" }
] as const;

export function generateReferralCode(length = 8): string {
  const bytes = new Uint8Array(length);
  // crypto is available globally in Node 18+ and all modern browsers.
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function tierFor(referrals: number) {
  return [...AFFILIATE_TIERS].reverse().find((t) => referrals >= t.min) ?? null;
}

export function calculateCommission(monthlyRevenueCents: number) {
  return Math.round(monthlyRevenueCents * AFFILIATE_RATE);
}
