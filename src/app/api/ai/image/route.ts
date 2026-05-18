import { NextResponse } from "next/server";
import { generateImage, type ImageStyle } from "@/lib/ai/image";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "ai:image"), { capacity: 5, refillPerSecond: 5 / 60 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { idea, style = "authority" } = (await req.json()) as {
      idea?: string;
      style?: ImageStyle;
    };

    if (!idea) {
      return NextResponse.json({ error: "idea is required" }, { status: 400 });
    }

    const image = await generateImage(idea, style);
    return NextResponse.json(image);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
