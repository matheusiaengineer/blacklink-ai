"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Globe, Loader2, Sparkles, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type NetworkTarget = {
  type: string;
  title: string;
  company?: string;
  reason: string;
  searchQuery: string;
  connectionNote: string;
};

type NetworkPlan = {
  strategy: string;
  weeklyGoal: number;
  targets: NetworkTarget[];
  keywords: string[];
};

const GOALS = ["job", "clients", "authority", "partnerships"] as const;

export default function NetworkPage() {
  const locale = useLocale();
  const [role, setRole] = useState("AI Engineer");
  const [niche, setNiche] = useState("Generative AI");
  const [goal, setGoal] = useState<"job" | "clients" | "authority" | "partnerships">("authority");
  const [plan, setPlan] = useState<NetworkPlan | null>(null);
  const [pending, setPending] = useState(false);

  async function generate() {
    setPending(true);
    setPlan(null);
    try {
      const res = await fetch("/api/ai/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "plan", role, niche, goal, language: locale })
      });
      const data = (await res.json()) as { plan?: NetworkPlan };
      if (data.plan) setPlan(data.plan);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400">AI Network Engine</p>
          <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
            Connect with precision.
          </h1>
          <p className="mt-2 text-sm text-bone-300">
            AI builds your networking strategy and writes personalized connection notes.
          </p>
        </div>
      </div>

      {/* Config */}
      <div className="card p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Your role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Niche</label>
          <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Goal</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs capitalize transition",
                  g === goal ? "bg-white text-black border-white" : "border-white/10 text-bone-200 hover:border-white/20"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate} disabled={pending} className="btn-primary btn-magnetic">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {pending ? "Building plan…" : "Generate Network Plan"}
      </button>

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Strategy */}
          <div className="card p-5 border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4" />
              <p className="text-sm font-medium">Strategy</p>
              <span className="chip ml-auto">
                <Users className="h-3 w-3" /> {plan.weeklyGoal} connections/week
              </span>
            </div>
            <p className="text-sm text-bone-200 leading-relaxed">{plan.strategy}</p>
          </div>

          {/* Keywords */}
          <div className="card p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-3">Power keywords</p>
            <div className="flex flex-wrap gap-2">
              {plan.keywords.map((k) => (
                <span key={k} className="chip">{k}</span>
              ))}
            </div>
          </div>

          {/* Targets */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-3">Target profiles</p>
            <div className="space-y-3">
              {plan.targets.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card p-5"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="chip capitalize">{t.type}</span>
                        <p className="font-medium text-sm">{t.title}</p>
                        {t.company && <p className="text-xs text-bone-400">@ {t.company}</p>}
                      </div>
                      <p className="mt-2 text-xs text-bone-300">{t.reason}</p>
                    </div>
                    <span className="chip">
                      <Globe className="h-3 w-3" />
                      {t.searchQuery}
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-bone-200 leading-relaxed">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-bone-400 mb-1.5">Connection note</p>
                    {t.connectionNote}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
