"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

type Profile = {
  name: string;
  role: string;
  location: string;
  niche: string;
  score: number;
  followers: string;
  engagement: string;
  tags: string[];
  note?: string;
};

const PROFILES: Profile[] = [
  { name: "Nora Schwarz", role: "AI Engineer", location: "Berlin", niche: "Generative AI", score: 98, followers: "14.2K", engagement: "9.4%", tags: ["Python", "LLMs", "MLOps"] },
  { name: "Ravi Mehta", role: "Founder", location: "Mumbai", niche: "SaaS", score: 95, followers: "8.7K", engagement: "7.1%", tags: ["Startup", "B2B", "Growth"] },
  { name: "Mariana Lopes", role: "Product Designer", location: "São Paulo", niche: "Design Systems", score: 91, followers: "6.3K", engagement: "8.8%", tags: ["Figma", "UX", "Motion"] },
  { name: "James Park", role: "DevRel Engineer", location: "Seoul", niche: "Developer Tools", score: 88, followers: "22K", engagement: "5.2%", tags: ["Open Source", "API", "Community"] },
  { name: "Sofia Andersen", role: "Growth Lead", location: "Copenhagen", niche: "PLG", score: 85, followers: "4.1K", engagement: "11.3%", tags: ["Growth", "Analytics", "SaaS"] },
  { name: "Carlos Vega", role: "ML Engineer", location: "Mexico City", niche: "Computer Vision", score: 83, followers: "3.8K", engagement: "6.7%", tags: ["PyTorch", "CV", "Edge AI"] }
];

export default function TalentPage() {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [filter, setFilter] = useState<"all" | "recruiter" | "founder" | "developer">("all");

  const filtered = PROFILES.filter((p) => {
    const q = query.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q);
    return matchQ;
  });

  async function generateNote(profile: Profile) {
    setSelected(profile);
    setNote("");
    setPending(true);
    try {
      const res = await fetch("/api/ai/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "note",
          targetName: profile.name,
          targetRole: profile.role,
          role: "AI Developer",
          niche: "AI SaaS",
          language: locale
        })
      });
      const data = (await res.json()) as { note?: string };
      setNote(data.note ?? "");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Talent Radar</p>
          <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
            Find the right people.
          </h1>
          <p className="mt-2 text-sm text-bone-300">
            AI scores and surfaces professionals aligned with your goals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">
            <Users className="h-3 w-3" />
            {filtered.length} profiles
          </span>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-bone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, niche…"
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "recruiter", "founder", "developer"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs capitalize transition",
                f === filter ? "bg-white text-black border-white" : "border-white/10 text-bone-200 hover:border-white/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Profile list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(p)}
              className={cn(
                "card card-hover p-5 cursor-pointer",
                selected?.name === p.name && "border-white/30 bg-white/[0.04]"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/10 grid place-items-center shrink-0">
                  <span className="text-sm font-semibold">{p.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-bone-300">{p.role} · {p.niche}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="chip">
                        <Star className="h-3 w-3" /> {p.score}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-bone-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.followers}</span>
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{p.engagement} eng.</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="card p-5 h-fit sticky top-24">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/10 grid place-items-center">
                  <span className="font-semibold">{selected.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{selected.name}</p>
                  <p className="text-xs text-bone-400">{selected.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Metric label="Followers" value={selected.followers} />
                <Metric label="Engagement" value={selected.engagement} />
                <Metric label="AI Score" value={`${selected.score}/100`} />
                <Metric label="Location" value={selected.location} />
              </div>

              <button
                onClick={() => generateNote(selected)}
                disabled={pending}
                className="btn-primary btn-magnetic w-full"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate connection note
              </button>

              {note && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-bone-200 leading-relaxed"
                >
                  {note}
                </motion.div>
              )}

              <div className="flex gap-2">
                <button className="btn-ghost flex-1 text-xs">
                  <MessageSquare className="h-3.5 w-3.5" /> Message
                </button>
                <button className="btn-ghost flex-1 text-xs">
                  <Briefcase className="h-3.5 w-3.5" /> Profile
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="h-8 w-8 text-bone-400 mx-auto mb-3" />
              <p className="text-sm text-bone-400">Select a profile to see details and generate a connection note.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-bone-400">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
