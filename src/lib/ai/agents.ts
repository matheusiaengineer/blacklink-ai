/**
 * BLACKLINK AI — Agent System
 *
 * Each agent is a focused worker that orchestrates prompts and outputs.
 * They are model-agnostic: provide any `LLM` adapter implementing `complete(prompt)`.
 */

import { generateWithGemini } from "@/lib/ai/gemini";
import {
  bioPrompt,
  hashtagPrompt,
  postPrompt,
  SYSTEM_TONE
} from "@/lib/ai/prompts";

export type LLM = { complete: (prompt: string) => Promise<string> };

export const geminiAdapter: LLM = {
  complete: (prompt) => generateWithGemini(prompt)
};

export type AgentContext = {
  language: string;
  niche?: string;
  role?: string;
  tone?: "authority" | "story" | "viral" | "hiring" | "networking";
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

/* -------------------------------------------------------------------------- */
/*  AGENT 1 — Profile Analyzer                                                */
/* -------------------------------------------------------------------------- */

export const profileAnalyzer = {
  async run(input: { headline: string; bio: string; skills: string[] }, ctx: AgentContext, llm: LLM = geminiAdapter) {
    const prompt = `${SYSTEM_TONE}
Language: ${ctx.language}

Analyze this LinkedIn profile and return STRICT JSON with keys:
"score" (0-100), "weak_points" (string[]), "strong_points" (string[]),
"rewrite": { "headline": string, "bio": string }, "next_steps" (string[]).

PROFILE:
- headline: ${input.headline}
- bio: ${input.bio}
- skills: ${input.skills.join(", ")}`;
    const raw = await llm.complete(prompt);
    return safeJSON(raw);
  }
};

/* -------------------------------------------------------------------------- */
/*  AGENT 2 — Content Generator                                               */
/* -------------------------------------------------------------------------- */

export const contentGenerator = {
  async post(topic: string, ctx: AgentContext, llm: LLM = geminiAdapter) {
    return llm.complete(postPrompt({ topic, language: ctx.language, tone: ctx.tone }));
  },
  async bio(role: string, niche: string, ctx: AgentContext, llm: LLM = geminiAdapter) {
    return llm.complete(bioPrompt({ role, niche, language: ctx.language }));
  },
  async hashtags(topic: string, ctx: AgentContext, llm: LLM = geminiAdapter) {
    const raw = await llm.complete(hashtagPrompt({ topic, language: ctx.language }));
    const json = safeJSON<string[]>(raw);
    return Array.isArray(json) ? json : [];
  },
  async campaign(goal: string, ctx: AgentContext, llm: LLM = geminiAdapter) {
    const prompt = `${SYSTEM_TONE}
Language: ${ctx.language}
Goal: ${goal}

Build a 7-day LinkedIn campaign. Return STRICT JSON:
{ "strategy": string, "days": [{ "day": number, "theme": string, "hook": string, "post": string, "hashtags": string[] }] }`;
    const raw = await llm.complete(prompt);
    return safeJSON(raw);
  }
};

/* -------------------------------------------------------------------------- */
/*  AGENT 3 — Scheduler                                                       */
/* -------------------------------------------------------------------------- */

export const schedulerAgent = {
  /** Recommend humanized posting slots based on industry signals. */
  recommendSlots(timezone: string, perDay = 2) {
    // Heuristic: peak windows 7:30–9:00, 12:00–13:30, 17:30–19:00 local time.
    const peaks = [
      [7.5, 9.0],
      [12.0, 13.5],
      [17.5, 19.0]
    ];
    const slots: { hour: number; minute: number; tz: string }[] = [];
    for (let i = 0; i < perDay; i++) {
      const [start, end] = peaks[i % peaks.length];
      const hour = start + Math.random() * (end - start);
      slots.push({
        hour: Math.floor(hour),
        minute: Math.floor((hour % 1) * 60),
        tz: timezone
      });
    }
    return slots.sort((a, b) => a.hour - b.hour);
  }
};

/* -------------------------------------------------------------------------- */
/*  AGENT 4 — Engagement                                                      */
/* -------------------------------------------------------------------------- */

export const engagementAgent = {
  async score(metrics: { impressions: number; likes: number; comments: number; reposts: number }, ctx: AgentContext, llm: LLM = geminiAdapter) {
    const prompt = `${SYSTEM_TONE}
Language: ${ctx.language}

Given metrics: ${JSON.stringify(metrics)}, compute a viral score (0-100) and a 1-sentence reason.
Return JSON: { "score": number, "reason": string, "next_action": string }.`;
    const raw = await llm.complete(prompt);
    return safeJSON<{ score: number; reason: string; next_action: string }>(raw);
  }
};

/* -------------------------------------------------------------------------- */
/*  AGENT 5 — Conversational AI (Nova)                                        */
/* -------------------------------------------------------------------------- */

export const novaAgent = {
  async reply(
    message: string,
    ctx: AgentContext & { memoryContext?: string },
    llm: LLM = geminiAdapter
  ) {
    const history = (ctx.history ?? [])
      .slice(-8)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const memBlock = ctx.memoryContext ? `\n${ctx.memoryContext}\n` : "";

    const prompt = `${SYSTEM_TONE}
You are NOVA, BLACKLINK AI's conversational growth strategist.
Always reply in ${ctx.language}.
Be direct, cinematic, no fluff. Offer 1 concrete next action.
${memBlock}
CONVERSATION:
${history}
USER: ${message}
ASSISTANT:`;
    return llm.complete(prompt);
  }
};

/* -------------------------------------------------------------------------- */

function safeJSON<T = unknown>(raw: string): T | null {
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/[{\[][\s\S]*[}\]]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}
