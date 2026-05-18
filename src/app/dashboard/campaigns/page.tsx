"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Loader2, Sparkles, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Day = {
  day: number;
  theme: string;
  hook: string;
  post: string;
  hashtags: string[];
};

type Campaign = {
  strategy: string;
  days: Day[];
};

const TONES = ["authority", "story", "viral", "hiring", "networking"] as const;

export default function CampaignsPage() {
  const locale = useLocale();
  const [goal, setGoal] = useState("Attract AI engineering roles");
  const [tone, setTone] = useState<(typeof TONES)[number]>("authority");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [pending, setPending] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  async function generate() {
    setPending(true);
    setCampaign(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `7-day LinkedIn campaign. Goal: ${goal}. Return JSON: { "strategy": string, "days": [{ "day": number, "theme": string, "hook": string, "post": string, "hashtags": string[] }] }`,
          language: locale,
          tone
        })
      });
      const data = (await res.json()) as { text?: string };
      if (!data.text) return;
      const cleaned = data.text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          setCampaign(JSON.parse(match[0]) as Campaign);
        } catch {
          // raw text fallback
        }
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Campaigns</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          7-day authority campaigns.
        </h1>
        <p className="mt-2 text-sm text-bone-300">
          AI builds a full week of posts, hooks and hashtags around your goal.
        </p>
      </div>

      <div className="card p-5 space-y-4">
        <div>
          <label className="label">Campaign goal</label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="input"
            placeholder="e.g. Attract AI engineering roles"
          />
        </div>
        <div>
          <label className="label">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs capitalize transition",
                  t === tone ? "bg-white text-black border-white" : "border-white/10 text-bone-200 hover:border-white/20"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button onClick={generate} disabled={pending} className="btn-primary btn-magnetic">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {pending ? "Building campaign…" : "Generate 7-Day Campaign"}
        </button>
      </div>

      {campaign && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="card p-5 border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4" />
              <p className="text-sm font-medium">Campaign strategy</p>
            </div>
            <p className="text-sm text-bone-200 leading-relaxed">{campaign.strategy}</p>
          </div>

          <div className="space-y-2">
            {campaign.days?.map((d, i) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.03] grid place-items-center shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-bone-400">Day {d.day}</p>
                    <p className="text-sm font-medium">{d.theme}</p>
                  </div>
                  <TrendingUp className={cn("h-4 w-4 transition", expanded === i ? "text-white" : "text-bone-400")} />
                </button>

                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.06] p-4 space-y-3"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-bone-400 mb-1">Hook</p>
                      <p className="text-sm font-medium text-white">{d.hook}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-bone-400 mb-1">Post</p>
                      <pre className="whitespace-pre-wrap font-sans text-xs text-bone-200 leading-relaxed">{d.post}</pre>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {d.hashtags?.map((h) => (
                        <span key={h} className="chip">#{h}</span>
                      ))}
                    </div>
                    <button className="btn-primary text-xs px-4 py-2">
                      Schedule this post
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
