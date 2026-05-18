/**
 * Gemini API wrapper.
 * Server-only. Uses fetch to avoid extra dependencies during scaffolding.
 */

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export type GeminiPart = { text: string };

export type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
};

export async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini error: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as GeminiResponse;
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}
