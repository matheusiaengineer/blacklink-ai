"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Check,
  X,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Server,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   AI PROVIDERS — Universal AI Provider Configuration
   Connect any AI: Gemini, OpenAI, Claude, DeepSeek, Groq, Mistral, Custom
───────────────────────────────────────────────────────────────────────────── */

type Provider = {
  id: string;
  name: string;
  description: string;
  icon: string;
  models: string[];
  defaultModel: string;
  docsUrl: string;
  supportsImages: boolean;
};

const PROVIDERS: Provider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google's most capable AI model with vision support",
    icon: "✦",
    models: ["gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"],
    defaultModel: "gemini-1.5-flash",
    docsUrl: "https://aistudio.google.com/app/apikey",
    supportsImages: true,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o and DALL-E for text and image generation",
    icon: "◐",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    defaultModel: "gpt-4o-mini",
    docsUrl: "https://platform.openai.com/api-keys",
    supportsImages: true,
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    description: "Claude 3.5 Sonnet — advanced reasoning and analysis",
    icon: "◈",
    models: ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"],
    defaultModel: "claude-3-5-sonnet-20241022",
    docsUrl: "https://console.anthropic.com/settings/keys",
    supportsImages: false,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "High-performance AI at competitive pricing",
    icon: "◉",
    models: ["deepseek-chat", "deepseek-coder"],
    defaultModel: "deepseek-chat",
    docsUrl: "https://platform.deepseek.com/api_keys",
    supportsImages: false,
  },
  {
    id: "groq",
    name: "Groq",
    description: "Ultra-fast inference with LPU technology",
    icon: "⚡",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    defaultModel: "llama-3.3-70b-versatile",
    docsUrl: "https://console.groq.com/keys",
    supportsImages: false,
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "European AI excellence — Mistral Large and Medium",
    icon: "◆",
    models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"],
    defaultModel: "mistral-large-latest",
    docsUrl: "https://console.mistral.ai/api-keys",
    supportsImages: false,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Access 100+ models through one unified API",
    icon: "⬡",
    models: ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "google/gemini-pro", "meta-llama/llama-3.1-70b"],
    defaultModel: "openai/gpt-4o-mini",
    docsUrl: "https://openrouter.ai/keys",
    supportsImages: true,
  },
  {
    id: "custom",
    name: "Custom API",
    description: "Connect any OpenAI-compatible endpoint",
    icon: "⚙",
    models: [],
    defaultModel: "",
    docsUrl: "",
    supportsImages: false,
  },
];

type ProviderConfig = {
  apiKey: string;
  model: string;
  baseUrl?: string;
  enabled: boolean;
  status: "idle" | "testing" | "connected" | "error";
  error?: string;
  latency?: number;
};

export default function AIProvidersPage() {
  const [configs, setConfigs] = useState<Record<string, ProviderConfig>>({});
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [activeProvider, setActiveProvider] = useState<string>("gemini");

  const updateConfig = (providerId: string, updates: Partial<ProviderConfig>) => {
    setConfigs((prev) => {
      const existing = prev[providerId] || {
        apiKey: "",
        model: PROVIDERS.find((p) => p.id === providerId)?.defaultModel || "",
        enabled: false,
        status: "idle" as const,
      };
      return {
        ...prev,
        [providerId]: {
          ...existing,
          ...updates,
        },
      };
    });
  };

  const testConnection = async (providerId: string) => {
    const config = configs[providerId];
    if (!config?.apiKey) return;

    updateConfig(providerId, { status: "testing" });

    try {
      const response = await fetch("/api/ai/test-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerId,
          apiKey: config.apiKey,
          model: config.model,
          baseUrl: config.baseUrl,
        }),
      });

      const data = await response.json();

      if (data.connected) {
        updateConfig(providerId, {
          status: "connected",
          enabled: true,
          latency: data.latency,
        });
      } else {
        updateConfig(providerId, {
          status: "error",
          error: data.error || "Connection failed",
        });
      }
    } catch {
      updateConfig(providerId, {
        status: "error",
        error: "Network error — check your connection",
      });
    }
  };

  const setAsActive = (providerId: string) => {
    setActiveProvider(providerId);
    // In production, save to user preferences in Supabase
  };

  const provider = PROVIDERS.find((p) => p.id === selectedProvider);
  const config = selectedProvider ? configs[selectedProvider] : null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Settings</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-light text-white">AI Providers</h1>
        <p className="mt-2 text-neutral-400">
          Connect your preferred AI provider. BLACKLINK AI works with any model.
        </p>
      </div>

      {/* Active Provider Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">
            {PROVIDERS.find((p) => p.id === activeProvider)?.icon}
          </div>
          <div>
            <p className="text-sm text-neutral-400">Active Provider</p>
            <p className="font-medium text-white">
              {PROVIDERS.find((p) => p.id === activeProvider)?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs text-green-400">Connected</span>
        </div>
      </motion.div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROVIDERS.map((p, index) => {
          const pConfig = configs[p.id];
          const isConnected = pConfig?.status === "connected";
          const isActive = activeProvider === p.id;

          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedProvider(p.id)}
              className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                isActive
                  ? "border-white/20 bg-white/[0.04]"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-colors ${
                  isConnected ? "bg-white/10" : "bg-white/5"
                }`}
              >
                {p.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{p.name}</p>
                  {isActive && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500 truncate">{p.description}</p>
                
                {/* Status */}
                <div className="mt-2 flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <Check className="h-3 w-3 text-green-400" />
                      <span className="text-[10px] text-green-400">
                        Connected · {pConfig?.latency}ms
                      </span>
                    </>
                  ) : pConfig?.status === "error" ? (
                    <>
                      <X className="h-3 w-3 text-red-400" />
                      <span className="text-[10px] text-red-400">Error</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-neutral-600">Not configured</span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-1" />

              {/* Image support badge */}
              {p.supportsImages && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="h-3 w-3 text-neutral-600" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Configuration Panel */}
      <AnimatePresence>
        {selectedProvider && provider && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">
                    {provider.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{provider.name}</h3>
                    <p className="text-xs text-neutral-500">{provider.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="rounded-lg p-2 text-neutral-500 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey[selectedProvider] ? "text" : "password"}
                    value={config?.apiKey || ""}
                    onChange={(e) => updateConfig(selectedProvider, { apiKey: e.target.value })}
                    placeholder={`Enter your ${provider.name} API key`}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 pr-20 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={() =>
                      setShowApiKey((prev) => ({ ...prev, [selectedProvider]: !prev[selectedProvider] }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-500 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {showApiKey[selectedProvider] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {provider.docsUrl && (
                  <a
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    Get API key <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Model Selection */}
              {provider.models.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Model
                  </label>
                  <select
                    value={config?.model || provider.defaultModel}
                    onChange={(e) => updateConfig(selectedProvider, { model: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white focus:border-white/20 focus:outline-none focus:ring-0"
                  >
                    {provider.models.map((model) => (
                      <option key={model} value={model} className="bg-neutral-900">
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom API Base URL */}
              {selectedProvider === "custom" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={config?.baseUrl || ""}
                    onChange={(e) => updateConfig(selectedProvider, { baseUrl: e.target.value })}
                    placeholder="https://api.example.com/v1"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-white/20 focus:outline-none focus:ring-0"
                  />
                </div>
              )}

              {/* Status Message */}
              {config?.status === "error" && config.error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <p className="text-xs text-red-400">{config.error}</p>
                </div>
              )}

              {config?.status === "connected" && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <p className="text-xs text-green-400">
                      Connected successfully · Latency: {config.latency}ms
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => testConnection(selectedProvider)}
                  disabled={!config?.apiKey || config?.status === "testing"}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {config?.status === "testing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </button>

                {config?.status === "connected" && activeProvider !== selectedProvider && (
                  <button
                    onClick={() => setAsActive(selectedProvider)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white transition-all hover:bg-white/5"
                  >
                    Set as Active
                  </button>
                )}
              </div>

              {/* Features */}
              <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Globe className="h-3 w-3" />
                  <span>Text Generation</span>
                </div>
                {provider.supportsImages && (
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Sparkles className="h-3 w-3" />
                    <span>Image Generation</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Server className="h-3 w-3" />
                  <span>Streaming</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5">
        <h4 className="text-sm font-medium text-white mb-2">Universal AI Layer</h4>
        <p className="text-xs text-neutral-500 leading-relaxed">
          BLACKLINK AI automatically adapts to any provider. Your prompts are optimized for each model,
          and responses are normalized into a unified format. Switch providers anytime without losing
          your campaigns, posts, or AI memory.
        </p>
      </div>
    </div>
  );
}
