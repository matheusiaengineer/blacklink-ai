/**
 * BLACKLINK AI — Universal AI Provider System
 * 
 * Unified interface for multiple AI providers.
 * The frontend remains independent of the AI backend.
 */

import type { AIProvider, AIRequest, AIResponse, AIProviderConfig, ProviderStatus } from "./types";

// Adapter functions for each provider
async function callGemini(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "gemini-1.5-flash";
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: request.prompt }] }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return {
    text,
    tokens: data.usageMetadata?.totalTokenCount,
    model,
    provider: "gemini",
    latency: Date.now() - start,
  };
}

async function callOpenAI(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "gpt-4o-mini";
  const baseUrl = config.baseUrl || "https://api.openai.com/v1";

  const messages = [];
  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  return {
    text,
    tokens: data.usage?.total_tokens,
    model,
    provider: "openai",
    latency: Date.now() - start,
  };
}

async function callClaude(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "claude-3-5-sonnet-20241022";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: request.maxTokens || 2048,
      system: request.systemPrompt || "You are a helpful AI assistant.",
      messages: [{ role: "user", content: request.prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  return {
    text,
    tokens: data.usage?.input_tokens + data.usage?.output_tokens,
    model,
    provider: "claude",
    latency: Date.now() - start,
  };
}

async function callDeepSeek(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "deepseek-chat";

  const messages = [];
  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  return {
    text,
    tokens: data.usage?.total_tokens,
    model,
    provider: "deepseek",
    latency: Date.now() - start,
  };
}

async function callOpenRouter(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "openai/gpt-4o-mini";

  const messages = [];
  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://blacklink.ai",
      "X-Title": "BLACKLINK AI",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  return {
    text,
    tokens: data.usage?.total_tokens,
    model,
    provider: "openrouter",
    latency: Date.now() - start,
  };
}

async function callGroq(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "llama-3.3-70b-versatile";

  const messages = [];
  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  return {
    text,
    tokens: data.usage?.total_tokens,
    model,
    provider: "groq",
    latency: Date.now() - start,
  };
}

async function callMistral(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const start = Date.now();
  const model = config.model || "mistral-large-latest";

  const messages = [];
  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  return {
    text,
    tokens: data.usage?.total_tokens,
    model,
    provider: "mistral",
    latency: Date.now() - start,
  };
}

async function callCustom(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  if (!config.baseUrl) {
    throw new Error("Custom API requires a base URL");
  }

  const start = Date.now();
  const model = config.model || "default";

  const messages = [];
  if (request.systemPrompt) {
    messages.push({ role: "system", content: request.systemPrompt });
  }
  messages.push({ role: "user", content: request.prompt });

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Custom API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || data.content?.[0]?.text || "";

  return {
    text,
    tokens: data.usage?.total_tokens,
    model,
    provider: "custom",
    latency: Date.now() - start,
  };
}

// Provider router
const PROVIDER_HANDLERS: Record<AIProvider, (config: AIProviderConfig, request: AIRequest) => Promise<AIResponse>> = {
  gemini: callGemini,
  openai: callOpenAI,
  claude: callClaude,
  deepseek: callDeepSeek,
  openrouter: callOpenRouter,
  groq: callGroq,
  mistral: callMistral,
  huggingface: callOpenAI, // HuggingFace uses OpenAI-compatible API
  ollama: callCustom, // Ollama uses OpenAI-compatible API
  custom: callCustom,
};

/**
 * Universal AI completion function
 * Automatically routes to the correct provider
 */
export async function complete(config: AIProviderConfig, request: AIRequest): Promise<AIResponse> {
  const handler = PROVIDER_HANDLERS[config.provider];
  if (!handler) {
    throw new Error(`Unknown provider: ${config.provider}`);
  }
  return handler(config, request);
}

/**
 * Test provider connection
 */
export async function testConnection(config: AIProviderConfig): Promise<ProviderStatus> {
  try {
    const response = await complete(config, {
      prompt: "Say 'connected' in one word.",
      maxTokens: 10,
    });

    return {
      provider: config.provider,
      connected: true,
      latency: response.latency,
      model: response.model,
    };
  } catch (error) {
    return {
      provider: config.provider,
      connected: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

/**
 * Get default provider config from environment
 */
export function getDefaultProvider(): AIProviderConfig {
  // Check for configured providers in order of preference
  if (process.env.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-flash",
      enabled: true,
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      enabled: true,
    };
  }
  
  throw new Error("No AI provider configured");
}

export * from "./types";
