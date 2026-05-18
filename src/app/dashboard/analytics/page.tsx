"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Heart, Repeat2, Users } from "lucide-react";
import { Counter } from "@/components/fx/Counter";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Analytics</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          Bloomberg-grade signal.
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile icon={Eye} label="Impressions" value={284512} suffix="" />
        <Tile icon={Heart} label="Reactions" value={18420} />
        <Tile icon={Repeat2} label="Reposts" value={1284} />
        <Tile icon={Users} label="Followers" value={14.2} suffix="K" decimals={1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card p-5 min-h-[320px]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Last 30 days</p>
            <span className="chip"><ArrowUpRight className="h-3 w-3" /> +312%</span>
          </div>
          <Bars />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card p-5"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Top hashtags</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["#ArtificialIntelligence", "12.4K"],
              ["#OpenToWork", "9.1K"],
              ["#SaaS", "7.8K"],
              ["#Hiring", "6.2K"],
              ["#TechLeadership", "4.0K"]
            ].map(([h, v]) => (
              <li
                key={h}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span className="text-bone-100">{h}</span>
                <span className="text-bone-400 text-xs">{v}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
  suffix = "",
  decimals = 0
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{label}</p>
        <Icon className="h-3.5 w-3.5 text-bone-300" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tightest">
        <Counter to={value} suffix={suffix} decimals={decimals} />
      </p>
    </motion.div>
  );
}

function Bars() {
  const data = Array.from({ length: 30 }).map(() => Math.random() * 0.8 + 0.2);
  return (
    <div className="mt-6 grid grid-cols-30 items-end gap-1 h-56" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${v * 100}%` }}
          transition={{ duration: 0.8, delay: i * 0.015, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-sm bg-gradient-to-t from-white/10 to-white/60"
        />
      ))}
    </div>
  );
}
