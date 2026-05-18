/**
 * Stripe client placeholder.
 * Install `stripe` package when wiring billing:
 *   npm i stripe
 *
 * Then export:
 *   import Stripe from "stripe";
 *   export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
 */

export type Plan = "free" | "pro" | "enterprise";

export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRICE_PRO ?? "",
  enterprise_monthly: process.env.STRIPE_PRICE_ENTERPRISE ?? ""
} as const;

export const PLAN_LIMITS: Record<
  Plan,
  {
    dailyPosts: number;
    accounts: number;
    dailyImages: number;
    monthlyChatMessages: number;
    schedulingHorizonDays: number;
    aiNetworkSuggestions: number;
  }
> = {
  free: {
    dailyPosts: 5,
    accounts: 1,
    dailyImages: 2,
    monthlyChatMessages: 100,
    schedulingHorizonDays: 3,
    aiNetworkSuggestions: 5
  },
  pro: {
    dailyPosts: Number.POSITIVE_INFINITY,
    accounts: 1,
    dailyImages: 30,
    monthlyChatMessages: 5000,
    schedulingHorizonDays: 30,
    aiNetworkSuggestions: 50
  },
  enterprise: {
    dailyPosts: Number.POSITIVE_INFINITY,
    accounts: 10,
    dailyImages: 200,
    monthlyChatMessages: Number.POSITIVE_INFINITY,
    schedulingHorizonDays: 90,
    aiNetworkSuggestions: Number.POSITIVE_INFINITY
  }
};

export type LimitedAction = keyof (typeof PLAN_LIMITS)["free"];

export function withinLimit(
  plan: Plan,
  action: LimitedAction,
  used: number
): { ok: boolean; limit: number; remaining: number } {
  const limit = PLAN_LIMITS[plan][action];
  const remaining = Math.max(0, limit - used);
  return { ok: used < limit, limit, remaining };
}
