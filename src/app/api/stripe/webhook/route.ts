import { NextResponse } from "next/server";

/**
 * Stripe webhook handler.
 *
 * Verifies the Stripe-Signature header using HMAC-SHA256 (Web Crypto).
 * Handles the three lifecycle events needed for subscription management.
 *
 * To wire Supabase: uncomment the `updateUserPlan` calls below.
 */

const enc = new TextEncoder();

async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string
): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.split("=") as [string, string])
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}.${payload}`))
  );
  const expectedHex = Array.from(expected)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedHex === signature;
}

type StripeEvent = {
  type: string;
  data: { object: Record<string, unknown> };
};

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  const valid = await verifyStripeSignature(body, sig, secret);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as StripeEvent;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = (session.metadata as Record<string, string>)?.userId;
      const plan = (session.metadata as Record<string, string>)?.plan ?? "pro";
      if (userId) {
        // await updateUserPlan(userId, plan);
        void plan;
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object;
      const status = sub.status as string;
      const customerId = sub.customer as string;
      // const plan = resolvePlanFromPriceId(sub.items.data[0].price.id);
      // await updateUserPlanByCustomer(customerId, plan, status);
      void status;
      void customerId;
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub.customer as string;
      // await updateUserPlanByCustomer(customerId, "free", "cancelled");
      void customerId;
      break;
    }

    default:
      // Unhandled event — safe to ignore
      break;
  }

  return NextResponse.json({ received: true });
}
