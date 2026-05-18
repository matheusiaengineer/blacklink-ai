"use client";

import { useTranslations } from "next-intl";
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Counter } from "@/components/fx/Counter";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const cards = [
    { key: "posts", icon: Sparkles, value: 132, suffix: "" },
    { key: "growth", icon: TrendingUp, value: 412, suffix: "%" },
    { key: "followers", icon: Users, value: 14.2, suffix: "K", decimals: 1 },
    { key: "engagement", icon: Activity, value: 9.4, suffix: "%", decimals: 1 },
    { key: "jobs", icon: Briefcase, value: 38, suffix: "" },
    { key: "ai", icon: Sparkles, value: 24, suffix: "" }
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400">{t("greeting")}, Alex</p>
          <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">{t("subtitle")}</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost btn-magnetic">
            <Sparkles className="h-3.5 w-3.5" />
            {t("cta.schedule")}
          </button>
          <button className="btn-primary btn-magnetic">
            <Sparkles className="h-3.5 w-3.5" />
            {t("cta.generate")}
          </button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            className="card card-hover p-5 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">
                {t(`cards.${c.key}`)}
              </p>
              <c.icon className="h-3.5 w-3.5 text-bone-300" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tightest">
              <Counter to={c.value} suffix={c.suffix} decimals={"decimals" in c ? c.decimals : 0} />
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-bone-300">
              <ArrowUpRight className="h-3 w-3" /> +12.4% vs last week
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 card p-5 min-h-[280px]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Impressions · 30d</p>
            <span className="chip"><ArrowUpRight className="h-3 w-3" />+312%</span>
          </div>
          <Sparkline />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-5"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{t("feed.title")}</p>
          <ul className="mt-4 space-y-2 text-xs text-bone-200">
            {[
              "AI scheduled post · 9:42 AM",
              "Recruiter @nora viewed profile",
              "Headline rewritten by AI",
              "+128 followers this week"
            ].map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function Sparkline() {
  const data = [4, 8, 6, 12, 9, 16, 14, 22, 18, 26, 24, 31, 28, 36, 33, 41];
  const max = Math.max(...data);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-6 h-48 w-full">
      <defs>
        <linearGradient id="grad-dash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="white" strokeWidth="1.4" />
      <polygon points={`0,100 ${points} 100,100`} fill="url(#grad-dash)" />
    </svg>
  );
}
