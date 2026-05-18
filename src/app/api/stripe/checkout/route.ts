import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { STRIPE_PRICES, type Plan } from "@/lib/stripe/client";

const PLAN_TO_PRICE: Record<Exclude<Plan, "free">, string> = {
  pro: STRIPE_PRICES.pro_monthly,
  enterprise: STRIPE_PRICES.enterprise_monthly
};

export async function POST(req: Request) {
  try {
    const { plan = "pro", email } = (await req.json()) as { plan?: Plan; email?: string };

    if (plan === "free") {
      return NextResponse.json({ error: "Free plan needs no checkout" }, { status: 400 });
    }

    const priceId = PLAN_TO_PRICE[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Plan not configured" }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createCheckoutSession({
      priceId,
      customerEmail: email,
      successUrl: `${origin}/dashboard/billing?status=success`,
      cancelUrl: `${origin}/dashboard/billing?status=cancelled`,
      metadata: { plan }
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
