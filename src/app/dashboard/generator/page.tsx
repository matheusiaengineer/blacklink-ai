"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Wand2, ImageIcon, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = ["authority", "story", "viral", "hiring", "networking"] as const;
type Tone = (typeof tones)[number];

const styles = ["authority", "tech", "business", "networking", "recruitment"] as const;

export default function GeneratorPage() {
  const locale = useLocale();
  const [topic, setTopic] = useState("Artificial Intelligence");
  const [tone, setTone] = useState<Tone>("authority");
  const [output, setOutput] = useState("");
  const [imgIdea, setImgIdea] = useState("");
  const [imgStyle, setImgStyle] = useState<(typeof styles)[number]>("authority");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [imgPending, setImgPending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setPending(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language: locale, tone })
      });
      const data = (await res.json()) as { text?: string; error?: string };
      setOutput(data.text ?? data.error ?? "");
    } finally {
      setPending(false);
    }
  }

  async function generateImage() {
    if (!imgIdea.trim()) return;
    setImgPending(true);
    setImgSrc(null);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: imgIdea, style: imgStyle })
      });
      const data = (await res.json()) as { dataUrl?: string; error?: string };
      if (data.dataUrl) setImgSrc(data.dataUrl);
    } finally {
      setImgPending(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">AI Generator</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          Generate posts that build authority.
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card p-5 space-y-4"
        >
          <div>
            <label className="label">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input"
              placeholder="What's on your mind?"
            />
          </div>
          <div>
            <label className="label">Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs capitalize transition",
                    t === tone
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-bone-200 hover:border-white/20"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generate} disabled={pending} className="btn-primary btn-magnetic w-full">
            {pending ? (
              <Sparkles className="h-4 w-4 animate-pulse" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {pending ? "Generating…" : "Generate Post"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 card p-5 min-h-[280px] relative"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Output</p>
            {output && (
              <button onClick={copy} className="chip">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-bone-100 leading-relaxed">
            {output || "Your generated post will appear here."}
          </pre>
        </motion.div>
      </div>

      {/* Image generation */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div>
            <label className="label">Image idea</label>
            <input
              value={imgIdea}
              onChange={(e) => setImgIdea(e.target.value)}
              className="input"
              placeholder="e.g. AI growth, futuristic chart"
            />
          </div>
          <div>
            <label className="label">Style</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setImgStyle(s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs capitalize transition",
                    s === imgStyle
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-bone-200 hover:border-white/20"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generateImage} disabled={imgPending || !imgIdea.trim()} className="btn-ghost btn-magnetic w-full">
            <ImageIcon className="h-4 w-4" />
            {imgPending ? "Rendering…" : "Generate Image"}
          </button>
        </div>

        <div className="lg:col-span-3 card p-3 min-h-[280px] grid place-items-center bg-ink-900">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt="Generated" className="max-h-[420px] rounded-lg object-contain" />
          ) : (
            <p className="text-sm text-bone-400">Cinematic black & white visuals appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
