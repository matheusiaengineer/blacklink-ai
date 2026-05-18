import { NextResponse } from "next/server";
import { contentGenerator } from "@/lib/ai/agents";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "ai:generate"), { capacity: 8, refillPerSecond: 8 / 60 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const { topic, language = "en", tone = "authority", niche, role } = (await req.json()) as {
      topic?: string;
      language?: string;
      tone?: "authority" | "story" | "viral" | "hiring" | "networking";
      niche?: string;
      role?: string;
    };

    if (!topic) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }

    const text = await contentGenerator.post(topic, { language, tone, niche, role });
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
