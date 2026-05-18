import { NextResponse } from "next/server";
import { AFFILIATE_TIERS, calculateCommission, generateReferralCode, tierFor } from "@/lib/affiliate";

/** Demo endpoint. Replace mock data with Supabase reads in production. */
export async function GET() {
  const referrals = 12;
  return NextResponse.json({
    code: generateReferralCode(),
    referrals,
    monthlyEarningsCents: calculateCommission(15_00 * referrals), // 12 referrals × $15 plan × 30%
    currentTier: tierFor(referrals),
    nextTier: AFFILIATE_TIERS.find((t) => t.min > referrals) ?? null,
    tiers: AFFILIATE_TIERS
  });
}
