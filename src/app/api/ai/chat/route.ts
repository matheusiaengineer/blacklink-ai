import { NextResponse } from "next/server";
import { novaAgent } from "@/lib/ai/agents";
import { memoryToContext, type UserMemory } from "@/lib/ai/memory";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "ai:chat"), { capacity: 20, refillPerSecond: 20 / 60 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const {
      message,
      language = "en",
      history = [],
      memory
    } = (await req.json()) as {
      message?: string;
      language?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      memory?: Partial<UserMemory>;
    };

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const memoryContext = memory
      ? memoryToContext({ userId: "", updatedAt: "", ...memory } as UserMemory)
      : undefined;

    const reply = await novaAgent.reply(
      message,
      { language, history, memoryContext },
    );

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
