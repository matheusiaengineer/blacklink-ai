"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/fx/Counter";
import { Award, BarChart3, Shield, Star, TrendingUp, Zap } from "lucide-react";

const METRICS = [
  { label: "Authority Score", value: 84, suffix: "/100", icon: Star, trend: "+12 this month" },
  { label: "Consistency", value: 91, suffix: "%", icon: Zap, trend: "4-week streak" },
  { label: "Engagement Quality", value: 9.4, suffix: "%", icon: BarChart3, trend: "+2.1% vs avg" },
  { label: "Recruiter Visibility", value: 38, suffix: " views", icon: Shield, trend: "This month" }
];

const HISTORY = [
  { week: "W1", score: 52 },
  { week: "W2", score: 58 },
  { week: "W3", score: 63 },
  { week: "W4", score: 71 },
  { week: "W5", score: 75 },
  { week: "W6", score: 79 },
  { week: "W7", score: 84 }
];

const FACTORS = [
  { name: "Posting consistency", score: 91, weight: "High" },
  { name: "Content quality", score: 88, weight: "High" },
  { name: "Engagement rate", score: 84, weight: "High" },
  { name: "Profile completeness", score: 76, weight: "Medium" },
  { name: "Hashtag relevance", score: 72, weight: "Medium" },
  { name: "Network growth", score: 65, weight: "Low" }
];

export default function ReputationPage() {
  const max = Math.max(...HISTORY.map((h) => h.score));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Reputation</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          Your authority score.
        </h1>
        <p className="mt-2 text-sm text-bone-300">
          A composite signal of consistency, quality and professional influence.
        </p>
      </div>

      {/* Score ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="white" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 84 / 100) }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-4xl font-semibold tracking-tightest">
              <Counter to={84} />
            </p>
            <p className="text-[11px] text-bone-400">/ 100</p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <p className="font-display text-xl font-semibold">Authority Builder</p>
          </div>
          <p className="text-sm text-bone-300 leading-relaxed">
            You are in the top 12% of professionals in your niche. Your consistency and engagement quality are above industry average. Keep posting daily to reach Elite status.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="chip"><TrendingUp className="h-3 w-3" /> +12 pts this month</span>
            <span className="chip"><Star className="h-3 w-3" /> Top 12% in AI niche</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="card card-hover p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{m.label}</p>
              <m.icon className="h-3.5 w-3.5 text-bone-300" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tightest">
              <Counter to={m.value} suffix={m.suffix} decimals={m.suffix.includes("%") ? 1 : 0} />
            </p>
            <p className="mt-1 text-[11px] text-bone-400">{m.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Score history */}
        <div className="card p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-4">Score history</p>
          <div className="flex items-end gap-2 h-32">
            {HISTORY.map((h, i) => (
              <div key={h.week} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-sm bg-gradient-to-t from-white/20 to-white/70"
                  initial={{ height: 0 }}
                  animate={{ height: `${(h.score / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
                <p className="text-[10px] text-bone-400">{h.week}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Factors */}
        <div className="card p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-4">Score factors</p>
          <div className="space-y-3">
            {FACTORS.map((f, i) => (
              <div key={f.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-bone-200">{f.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-bone-400">{f.weight}</span>
                    <span className="text-xs font-medium">{f.score}</span>
                  </div>
                </div>
                <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${f.score}%` }}
                    transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
