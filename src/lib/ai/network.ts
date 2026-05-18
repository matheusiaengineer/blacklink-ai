/**
 * BLACKLINK AI — AI Network Engine (Agent 6)
 *
 * Suggests high-value LinkedIn connections based on the user's profile,
 * niche and goals. Returns structured recommendations with reasoning.
 */

import { generateWithGemini } from "@/lib/ai/gemini";
import { SYSTEM_TONE } from "@/lib/ai/prompts";

export type NetworkTarget = {
  type: "recruiter" | "founder" | "developer" | "designer" | "creator" | "investor";
  title: string;
  company?: string;
  reason: string;
  searchQuery: string;
  connectionNote: string;
};

export type NetworkPlan = {
  strategy: string;
  weeklyGoal: number;
  targets: NetworkTarget[];
  keywords: string[];
};

export async function generateNetworkPlan(input: {
  role: string;
  niche: string;
  goal: "job" | "clients" | "authority" | "partnerships";
  language: string;
}): Promise<NetworkPlan | null> {
  const prompt = `${SYSTEM_TONE}
Language: ${input.language}

Build a LinkedIn networking plan for a ${input.role} in ${input.niche} whose goal is: ${input.goal}.

Return STRICT JSON matching this shape:
{
  "strategy": "string — 1 sentence",
  "weeklyGoal": number,
  "targets": [
    {
      "type": "recruiter|founder|developer|designer|creator|investor",
      "title": "string",
      "company": "string or null",
      "reason": "string — why this person matters",
      "searchQuery": "string — LinkedIn search string",
      "connectionNote": "string — personalized 300-char note"
    }
  ],
  "keywords": ["string"]
}

Return 5 targets. No commentary outside the JSON.`;

  const raw = await generateWithGemini(prompt);
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as NetworkPlan;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as NetworkPlan;
    } catch {
      return null;
    }
  }
}

export async function generateConnectionNote(input: {
  targetName: string;
  targetRole: string;
  senderRole: string;
  niche: string;
  language: string;
}): Promise<string> {
  const prompt = `${SYSTEM_TONE}
Language: ${input.language}

Write a LinkedIn connection request note (max 300 chars) from a ${input.senderRole} in ${input.niche}
to ${input.targetName} (${input.targetRole}).
Be genuine, specific, no spam. End with a soft CTA.
Return ONLY the note text.`;

  return generateWithGemini(prompt);
}
