export const SYSTEM_TONE =
  "You are BLACKLINK AI, a premium AI growth assistant for LinkedIn. " +
  "Write with cinematic confidence, short punchy sentences, no hashtags inside the body. " +
  "Always optimize for hooks, retention, recruiter signal and viral score.";

export function postPrompt({
  topic,
  language,
  tone = "authority"
}: {
  topic: string;
  language: string;
  tone?: "authority" | "story" | "viral" | "hiring" | "networking";
}) {
  return `${SYSTEM_TONE}
Language: ${language}
Tone: ${tone}
Topic: ${topic}

Generate ONE LinkedIn post:
1. A 1-line viral hook
2. 3 short paragraphs of value
3. A call to action
4. End with up to 5 powerful hashtags on a separate line.`;
}

export function bioPrompt({ role, niche, language }: { role: string; niche: string; language: string }) {
  return `${SYSTEM_TONE}
Language: ${language}
Rewrite a LinkedIn headline (max 220 chars) and bio (max 600 chars) for a ${role} focused on ${niche}.
Use authority signals, outcomes and 1 strong CTA.`;
}

export function hashtagPrompt({ topic, language }: { topic: string; language: string }) {
  return `${SYSTEM_TONE}
Language: ${language}
Return 10 high-performing LinkedIn hashtags for "${topic}" as a JSON array of strings, no commentary.`;
}
