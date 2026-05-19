import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * POST /api/ai/test-provider
 * Test connection to an AI provider
 */
export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey, model, baseUrl } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { connected: false, error: "Provider and API key are required" },
        { status: 400 }
      );
    }

    const start = Date.now();
    let connected = false;
    let error = "";
    let responseModel = model;

    // Test each provider
    switch (provider) {
      case "gemini": {
        const testModel = model || "gemini-1.5-flash";
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Say 'connected' in one word." }] }],
              generationConfig: { maxOutputTokens: 10 },
            }),
          }
        );
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "openai": {
        const testModel = model || "gpt-4o-mini";
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
            max_tokens: 10,
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "claude": {
        const testModel = model || "claude-3-5-sonnet-20241022";
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: testModel,
            max_tokens: 10,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "deepseek": {
        const testModel = model || "deepseek-chat";
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
            max_tokens: 10,
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "groq": {
        const testModel = model || "llama-3.3-70b-versatile";
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
            max_tokens: 10,
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "mistral": {
        const testModel = model || "mistral-large-latest";
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
            max_tokens: 10,
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "openrouter": {
        const testModel = model || "openai/gpt-4o-mini";
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://blacklink.ai",
            "X-Title": "BLACKLINK AI",
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
            max_tokens: 10,
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          const data = await res.json();
          error = data.error?.message || `API error: ${res.status}`;
        }
        break;
      }

      case "custom": {
        if (!baseUrl) {
          error = "Base URL is required for custom API";
          break;
        }
        const testModel = model || "default";
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: testModel,
            messages: [{ role: "user", content: "Say 'connected' in one word." }],
            max_tokens: 10,
          }),
        });
        if (res.ok) {
          connected = true;
          responseModel = testModel;
        } else {
          error = `API error: ${res.status}`;
        }
        break;
      }

      default:
        error = `Unknown provider: ${provider}`;
    }

    const latency = Date.now() - start;

    return NextResponse.json({
      connected,
      latency,
      model: responseModel,
      error: error || undefined,
    });
  } catch (err) {
    return NextResponse.json(
      {
        connected: false,
        error: err instanceof Error ? err.message : "Connection test failed",
      },
      { status: 500 }
    );
  }
}
