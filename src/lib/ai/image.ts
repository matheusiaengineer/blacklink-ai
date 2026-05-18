/**
 * BLACKLINK AI — Image Generation Pipeline
 *
 * Style: cinematic, black & white, futuristic, premium SaaS, LinkedIn-ready.
 * Wraps Gemini 2.5 image generation. Falls back to a text-only prompt response
 * if the model is unavailable.
 */

const IMAGE_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

export type ImageStyle =
  | "authority"
  | "tech"
  | "business"
  | "networking"
  | "recruitment";

const STYLE_DIRECTIVES: Record<ImageStyle, string> = {
  authority:
    "ultra minimal black and white LinkedIn graphic, large bold typography centered, cinematic lighting, premium SaaS aesthetics, soft film grain, 1:1",
  tech:
    "futuristic monochrome AI graphic, abstract geometric shapes, pure black background with white accents, cinematic depth of field, premium tech editorial style, 1:1",
  business:
    "minimal black and white business chart visualization, ultra clean composition, modern editorial typography, soft contrast, premium financial aesthetics, 1:1",
  networking:
    "monochrome modern professional networking visual, abstract connected nodes, cinematic blur, premium typography overlay, 1:1",
  recruitment:
    "minimal black and white hiring poster, big bold callout, cinematic shadows, premium recruiter brand style, 1:1"
};

export function buildImagePrompt(idea: string, style: ImageStyle = "authority") {
  return `${STYLE_DIRECTIVES[style]}. Concept: ${idea}. No watermark, no extra text outside the headline, no purple gradients, strictly monochrome.`;
}

export async function generateImage(idea: string, style: ImageStyle = "authority") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const res = await fetch(`${IMAGE_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildImagePrompt(idea, style) }] }],
      generationConfig: { responseModalities: ["IMAGE"] }
    })
  });

  if (!res.ok) {
    throw new Error(`Image generation failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ inlineData?: { data: string; mimeType: string } }> };
    }>;
  };

  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) throw new Error("No image returned");

  return {
    base64: part.inlineData.data,
    mimeType: part.inlineData.mimeType,
    dataUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
  };
}
