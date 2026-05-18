import { NextResponse } from "next/server";
import { generateNetworkPlan, generateConnectionNote } from "@/lib/ai/network";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "ai:network"), { capacity: 10, refillPerSecond: 10 / 60 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = (await req.json()) as {
      action?: "plan" | "note";
      role?: string;
      niche?: string;
      goal?: "job" | "clients" | "authority" | "partnerships";
      language?: string;
      targetName?: string;
      targetRole?: string;
    };

    const language = body.language ?? "en";

    if (body.action === "note") {
      const note = await generateConnectionNote({
        targetName: body.targetName ?? "Professional",
        targetRole: body.targetRole ?? "Leader",
        senderRole: body.role ?? "Developer",
        niche: body.niche ?? "Technology",
        language
      });
      return NextResponse.json({ note });
    }

    // Default: plan
    const plan = await generateNetworkPlan({
      role: body.role ?? "Developer",
      niche: body.niche ?? "AI",
      goal: body.goal ?? "authority",
      language
    });

    return NextResponse.json({ plan });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
