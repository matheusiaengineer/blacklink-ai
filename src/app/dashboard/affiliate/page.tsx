"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Crown, DollarSign, Gift, TrendingUp, Users } from "lucide-react";
import { AFFILIATE_TIERS } from "@/lib/affiliate";

type Data = {
  code: string;
  referrals: number;
  monthlyEarningsCents: number;
  currentTier: { id: string; label: string; reward: string } | null;
  nextTier: { id: string; label: string; min: number; reward: string } | null;
};

export default function AffiliatePage() {
  const [data, setData] = useState<Data | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/affiliate")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-bone-300 text-sm">Loading…</div>;

  const link = `https://blacklink.ai/r/${data.code}`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Affiliate</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          Earn while they grow.
        </h1>
        <p className="mt-2 text-sm text-bone-300">
          Refer creators and keep 30% recurring for life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <Stat icon={Users} label="Referrals" value={String(data.referrals)} />
        <Stat
          icon={DollarSign}
          label="Monthly earnings"
          value={`$${(data.monthlyEarningsCents / 100).toFixed(2)}`}
        />
        <Stat
          icon={Crown}
          label="Current tier"
          value={data.currentTier?.label ?? "—"}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Your referral link</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="text-sm text-bone-100 truncate flex-1">{link}</span>
          <button
            className="chip"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <Copy className="h-3 w-3" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </motion.div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-3">Tiers</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {AFFILIATE_TIERS.map((t, i) => {
            const active = data.currentTier?.id === t.id;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card p-4 ${active ? "border-white/30 bg-white/[0.04]" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{t.label}</p>
                  <Gift className="h-3.5 w-3.5 text-bone-300" />
                </div>
                <p className="mt-1 text-[11px] text-bone-400">{t.min}+ referrals</p>
                <p className="mt-3 text-xs text-bone-200">{t.reward}</p>
              </motion.div>
            );
          })}
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
    <motion.div whileHover={{ y: -2 }} className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{label}</p>
        <Icon className="h-3.5 w-3.5 text-bone-300" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tightest">{value}</p>
      <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-bone-300">
        <TrendingUp className="h-3 w-3" />
        Recurring
      </span>
    </motion.div>
  );
}
