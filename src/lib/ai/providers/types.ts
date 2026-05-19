/**
 * BLACKLINK AI — Universal AI Provider Types
 * 
 * This layer abstracts all AI providers into a unified interface.
 * Supports: Gemini, OpenAI, Claude, DeepSeek, OpenRouter, Mistral, Custom APIs
 */

export type AIProvider = 
  | "gemini"
  | "openai"
  | "claude"
  | "deepseek"
  | "openrouter"
  | "mistral"
  | "groq"
  | "huggingface"
  | "ollama"
  | "custom";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  enabled: boolean;
}

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  language?: string;
}

export interface AIResponse {
  text: string;
  tokens?: number;
  model: string;
  provider: AIProvider;
  latency?: number;
}

export interface AIImageRequest {
  prompt: string;
  style?: "cinematic" | "minimal" | "professional" | "futuristic";
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3";
  quality?: "standard" | "hd";
}

export interface AIImageResponse {
  url: string;
  base64?: string;
  model: string;
  provider: AIProvider;
}

export interface ProviderStatus {
  provider: AIProvider;
  connected: boolean;
  latency?: number;
  error?: string;
  model?: string;
}

export const PROVIDER_INFO: Record<AIProvider, {
  name: string;
  description: string;
  models: string[];
  supportsImages: boolean;
  defaultModel: string;
  baseUrl: string;
}> = {
  gemini: {
    name: "Google Gemini",
    description: "Google's most capable AI model",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"],
    supportsImages: true,
    defaultModel: "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
  openai: {
    name: "OpenAI",
    description: "GPT-4 and DALL-E models",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    supportsImages: true,
    defaultModel: "gpt-4o-mini",
    baseUrl: "https://api.openai.com/v1",
  },
  claude: {
    name: "Anthropic Claude",
    description: "Claude 3.5 Sonnet and Opus",
    models: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
    supportsImages: false,
    defaultModel: "claude-3-5-sonnet-20241022",
    baseUrl: "https://api.anthropic.com/v1",
  },
  deepseek: {
    name: "DeepSeek",
    description: "DeepSeek AI models",
    models: ["deepseek-chat", "deepseek-coder"],
    supportsImages: false,
    defaultModel: "deepseek-chat",
    baseUrl: "https://api.deepseek.com/v1",
  },
  openrouter: {
    name: "OpenRouter",
    description: "Access multiple AI models through one API",
    models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "google/gemini-pro"],
    supportsImages: true,
    defaultModel: "openai/gpt-4o-mini",
    baseUrl: "https://openrouter.ai/api/v1",
  },
  mistral: {
    name: "Mistral AI",
    description: "Mistral Large and Medium models",
    models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"],
    supportsImages: false,
    defaultModel: "mistral-large-latest",
    baseUrl: "https://api.mistral.ai/v1",
  },
  groq: {
    name: "Groq",
    description: "Ultra-fast inference with LPU",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    supportsImages: false,
    defaultModel: "llama-3.3-70b-versatile",
    baseUrl: "https://api.groq.com/openai/v1",
  },
  huggingface: {
    name: "Hugging Face",
    description: "Open-source models",
    models: ["meta-llama/Llama-3.2-3B-Instruct", "mistralai/Mistral-7B-Instruct-v0.3"],
    supportsImages: true,
    defaultModel: "meta-llama/Llama-3.2-3B-Instruct",
    baseUrl: "https://api-inference.huggingface.co/models",
  },
  ollama: {
    name: "Ollama (Local)",
    description: "Run AI models locally",
    models: ["llama3.2", "mistral", "codellama", "phi3"],
    supportsImages: false,
    defaultModel: "llama3.2",
    baseUrl: "http://localhost:11434/api",
  },
  custom: {
    name: "Custom API",
    description: "Connect any OpenAI-compatible API",
    models: [],
    supportsImages: false,
    defaultModel: "",
    baseUrl: "",
  },
};
