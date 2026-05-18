"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";

const sparkline = [4, 8, 6, 12, 9, 16, 14, 22, 18, 26, 24, 31, 28, 36];

export function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="absolute -inset-x-20 -top-10 h-40 bg-gradient-to-b from-white/[0.07] to-transparent blur-3xl rounded-full" />
      <div className="relative card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
            blacklink.ai/dashboard
          </div>
        </div>

        <div className="grid grid-cols-12 min-h-[440px]">
          <aside className="hidden md:flex flex-col gap-1 col-span-3 lg:col-span-2 border-r border-white/[0.06] p-3">
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: Bot, label: "AI Generator" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Calendar, label: "Scheduler" },
              { icon: MessageSquare, label: "Messages" },
              { icon: Briefcase, label: "Jobs" },
              { icon: Settings, label: "Settings" }
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs ${
                  item.active
                    ? "bg-white/[0.06] text-white"
                    : "text-bone-300 hover:bg-white/[0.03]"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </aside>

          <main className="col-span-12 md:col-span-9 lg:col-span-10 p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">
                  Welcome back
                </p>
                <h3 className="font-display text-xl font-semibold tracking-tightest mt-1">
                  Your authority pulse
                </h3>
              </div>
              <button className="btn-primary text-xs px-4 py-2">
                <Sparkles className="h-3.5 w-3.5" />
                Generate Post
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat icon={TrendingUp} label="Profile Growth" value="+412%" />
              <Stat icon={Users} label="Followers" value="14.2K" />
              <Stat icon={Activity} label="Engagement" value="9.4%" />
              <Stat icon={Briefcase} label="Recruiters" value="38" />
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="card p-4 lg:col-span-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">
                    Impressions · 30d
                  </p>
                  <span className="chip">
                    <ArrowUpRight className="h-3 w-3" />
                    +312%
                  </span>
                </div>
                <Sparkline />
              </div>

              <div className="card p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">
                  AI Suggestions
                </p>
                <ul className="mt-3 space-y-2 text-xs text-bone-200">
                  {[
                    "Post viral hook · 9:42 AM",
                    "Reply to recruiter @nora",
                    "Optimize headline copy",
                    "Schedule weekly digest"
                  ].map((s) => (
                    <motion.li
                      key={s}
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card card-hover p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{label}</p>
        <Icon className="h-3.5 w-3.5 text-bone-300" />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tightest">{value}</p>
    </motion.div>
  );
}

function Sparkline() {
  const max = Math.max(...sparkline);
  const points = sparkline
    .map((v, i) => `${(i / (sparkline.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-4 h-32 w-full">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="white" strokeWidth="1.2" />
      <polygon points={`0,100 ${points} 100,100`} fill="url(#g)" />
    </svg>
  );
}
