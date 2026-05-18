"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flame, Star, Trophy, Users, Zap } from "lucide-react";

type Badge = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  desc: string;
  earned: boolean;
  progress?: number;
  max?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
};

const BADGES: Badge[] = [
  { id: "first-post", icon: Zap, name: "First Post", desc: "Published your first AI post", earned: true, rarity: "common" },
  { id: "streak-7", icon: Flame, name: "7-Day Streak", desc: "Posted 7 days in a row", earned: true, rarity: "rare" },
  { id: "authority", icon: Star, name: "Authority Builder", desc: "Reached 1K followers", earned: true, rarity: "rare" },
  { id: "viral", icon: Trophy, name: "Viral Post", desc: "Post reached 10K impressions", earned: false, progress: 6800, max: 10000, rarity: "epic" },
  { id: "networker", icon: Users, name: "Super Networker", desc: "Connected with 100 professionals", earned: false, progress: 67, max: 100, rarity: "epic" },
  { id: "legend", icon: Trophy, name: "LinkedIn Legend", desc: "Reached 10K followers", earned: false, progress: 1200, max: 10000, rarity: "legendary" }
];

const STREAKS = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: true },
  { day: "Thu", active: true },
  { day: "Fri", active: false },
  { day: "Sat", active: false },
  { day: "Sun", active: false }
];

const RARITY_STYLES: Record<Badge["rarity"], string> = {
  common: "border-white/10",
  rare: "border-blue-400/30",
  epic: "border-purple-400/30",
  legendary: "border-yellow-400/30"
};

const RARITY_GLOW: Record<Badge["rarity"], string> = {
  common: "",
  rare: "shadow-[0_0_20px_-4px_rgba(96,165,250,0.3)]",
  epic: "shadow-[0_0_20px_-4px_rgba(192,132,252,0.3)]",
  legendary: "shadow-[0_0_30px_-4px_rgba(250,204,21,0.4)]"
};

export default function AchievementsPage() {
  const earned = BADGES.filter((b) => b.earned).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Achievements</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          Your growth milestones.
        </h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Badges earned", value: `${earned}/${BADGES.length}` },
          { label: "Current streak", value: "4 days" },
          { label: "Authority score", value: "84/100" },
          { label: "Total posts", value: "132" }
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tightest">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Streak calendar */}
      <div className="card p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-4">This week</p>
        <div className="flex gap-2">
          {STREAKS.map((s, i) => (
            <motion.div
              key={s.day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className={cn(
                "h-10 w-full rounded-lg border grid place-items-center transition",
                s.active ? "bg-white border-white text-black" : "border-white/10 text-bone-400"
              )}>
                {s.active && <Flame className="h-4 w-4" />}
              </div>
              <p className="text-[10px] text-bone-400">{s.day}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges grid */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-4">Badges</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className={cn(
                "card p-5 relative overflow-hidden transition",
                RARITY_STYLES[b.rarity],
                RARITY_GLOW[b.rarity],
                !b.earned && "opacity-50"
              )}
            >
              {b.rarity === "legendary" && b.earned && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none" />
              )}
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl border grid place-items-center shrink-0",
                  b.earned ? "bg-white text-black border-white" : "border-white/10 bg-white/[0.03]"
                )}>
                  <b.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{b.name}</p>
                    <span className={cn(
                      "text-[10px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded border",
                      b.rarity === "legendary" ? "border-yellow-400/30 text-yellow-400" :
                      b.rarity === "epic" ? "border-purple-400/30 text-purple-400" :
                      b.rarity === "rare" ? "border-blue-400/30 text-blue-400" :
                      "border-white/10 text-bone-400"
                    )}>
                      {b.rarity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-bone-400">{b.desc}</p>
                  {!b.earned && b.progress !== undefined && b.max !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-bone-400 mb-1">
                        <span>{b.progress.toLocaleString()}</span>
                        <span>{b.max.toLocaleString()}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-white/60"
                          initial={{ width: 0 }}
                          animate={{ width: `${(b.progress / b.max) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.06 + 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
