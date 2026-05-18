/**
 * Stripe checkout session helper using the REST API directly.
 * No SDK dependency — keeps the bundle tiny.
 *
 * Replace with `stripe` SDK when you need webhooks/subscriptions logic in depth.
 */

const STRIPE_API = "https://api.stripe.com/v1";

export type CheckoutInput = {
  priceId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export async function createCheckoutSession(input: CheckoutInput) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY missing");

  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("success_url", input.successUrl);
  body.set("cancel_url", input.cancelUrl);
  body.set("line_items[0][price]", input.priceId);
  body.set("line_items[0][quantity]", "1");
  body.set("allow_promotion_codes", "true");
  if (input.customerEmail) body.set("customer_email", input.customerEmail);
  if (input.metadata) {
    for (const [k, v] of Object.entries(input.metadata)) {
      body.set(`metadata[${k}]`, v);
    }
  }

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Stripe checkout failed: ${res.status} ${errorText}`);
  }

  return (await res.json()) as { id: string; url: string };
}
