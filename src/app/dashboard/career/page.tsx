"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  DollarSign,
  Loader2,
  MapPin,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const GOALS = ["job", "clients", "authority", "partnerships"] as const;
type Goal = (typeof GOALS)[number];

type JobRec = {
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  tags: string[];
};

const MOCK_JOBS: JobRec[] = [
  { title: "Senior AI Engineer", company: "Linear", location: "Remote", salary: "$180K–$220K", match: 97, tags: ["AI", "TypeScript", "Node.js"] },
  { title: "Full-Stack Developer", company: "Vercel", location: "Remote", salary: "$150K–$190K", match: 94, tags: ["Next.js", "React", "Edge"] },
  { title: "AI Product Lead", company: "Figma", location: "San Francisco", salary: "$200K–$240K", match: 89, tags: ["AI", "Product", "Growth"] },
  { title: "Founding Engineer", company: "Stealth Startup", location: "Remote", salary: "$160K + equity", match: 85, tags: ["SaaS", "AI", "Startup"] },
  { title: "Developer Advocate", company: "Supabase", location: "Remote", salary: "$130K–$160K", match: 82, tags: ["DevRel", "Open Source", "PostgreSQL"] }
];

const SKILLS = [
  { name: "TypeScript", level: 92 },
  { name: "AI/ML Systems", level: 88 },
  { name: "System Design", level: 84 },
  { name: "Node.js", level: 90 },
  { name: "Public Speaking", level: 61 },
  { name: "Technical Writing", level: 74 }
];

const ROADMAP = [
  { phase: "Now", action: "Optimize LinkedIn headline with AI keywords", done: true },
  { phase: "Week 1", action: "Publish 3 authority posts on AI systems", done: true },
  { phase: "Week 2", action: "Connect with 10 senior engineers at target companies", done: false },
  { phase: "Week 3", action: "Generate AI-powered resume tailored to top 3 roles", done: false },
  { phase: "Month 2", action: "Reach 1K followers with consistent posting", done: false },
  { phase: "Month 3", action: "Land 5+ recruiter conversations", done: false }
];

export default function CareerPage() {
  const locale = useLocale();
  const [goal, setGoal] = useState<Goal>("job");
  const [role, setRole] = useState("AI Engineer");
  const [niche, setNiche] = useState("Generative AI");
  const [output, setOutput] = useState("");
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState<"jobs" | "skills" | "roadmap" | "interview">("jobs");

  async function generatePlan() {
    setPending(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "plan", role, niche, goal, language: locale })
      });
      const data = (await res.json()) as { plan?: { strategy: string }; error?: string };
      setOutput(data.plan?.strategy ?? data.error ?? "");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400">AI Career</p>
          <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
            Your professional roadmap.
          </h1>
          <p className="mt-2 text-sm text-bone-300">
            AI-powered job matching, skill analysis and career strategy.
          </p>
        </div>
        <button onClick={generatePlan} disabled={pending} className="btn-primary btn-magnetic">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate Strategy
        </button>
      </div>

      {/* Config strip */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="label">Your role</label>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="input" />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="label">Niche</label>
          <input value={niche} onChange={(e) => setNiche(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Goal</label>
          <div className="flex gap-2 flex-wrap">
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

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 border-white/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-medium">AI Strategy</p>
          </div>
          <p className="text-sm text-bone-200 leading-relaxed">{output}</p>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        {(["jobs", "skills", "roadmap", "interview"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm capitalize transition border-b-2 -mb-px",
              tab === t ? "border-white text-white" : "border-transparent text-bone-400 hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "jobs" && (
        <div className="space-y-3">
          {MOCK_JOBS.map((j, i) => (
            <motion.div
              key={j.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 2 }}
              className="card card-hover p-5 flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center shrink-0">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-medium">{j.title}</p>
                    <p className="text-sm text-bone-300">{j.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MatchBadge score={j.match} />
                    <button className="btn-ghost text-xs px-3 py-1.5">
                      Apply <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-bone-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{j.salary}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {j.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">{s.name}</p>
                <span className="text-xs text-bone-300">{s.level}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.level}%` }}
                  transition={{ duration: 1, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {s.level < 70 && (
                <p className="mt-2 text-[11px] text-bone-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> AI suggests improving this skill
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {tab === "roadmap" && (
        <div className="relative pl-6 space-y-0">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />
          {ROADMAP.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative pb-6"
            >
              <div className={cn(
                "absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2",
                r.done ? "bg-white border-white" : "bg-ink-800 border-white/30"
              )} />
              <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{r.phase}</p>
              <p className={cn("mt-1 text-sm", r.done ? "text-bone-300 line-through" : "text-white")}>
                {r.action}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "interview" && <InterviewPrep locale={locale} />}
    </div>
  );
}

function MatchBadge({ score }: { score: number }) {
  const color = score >= 90 ? "text-white" : score >= 80 ? "text-bone-200" : "text-bone-400";
  return (
    <span className={cn("chip font-medium", color)}>
      <Star className="h-3 w-3" /> {score}% match
    </span>
  );
}

function InterviewPrep({ locale }: { locale: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pending, setPending] = useState(false);

  const QUESTIONS = [
    "Tell me about yourself.",
    "Why do you want to work here?",
    "What's your biggest technical achievement?",
    "How do you handle tight deadlines?",
    "Where do you see yourself in 5 years?"
  ];

  async function generate(q: string) {
    setQuestion(q);
    setAnswer("");
    setPending(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Interview answer for: "${q}". Role: AI Engineer. Be confident, specific, concise.`,
          language: locale,
          tone: "authority"
        })
      });
      const data = (await res.json()) as { text?: string };
      setAnswer(data.text ?? "");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-5 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-3">Common questions</p>
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => generate(q)}
            className={cn(
              "w-full text-left rounded-xl border px-4 py-3 text-sm transition",
              question === q ? "border-white/30 bg-white/[0.04] text-white" : "border-white/[0.06] text-bone-200 hover:border-white/20"
            )}
          >
            {q}
          </button>
        ))}
      </div>
      <div className="card p-5 min-h-[280px]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400 mb-3">AI-crafted answer</p>
        {pending ? (
          <div className="flex items-center gap-2 text-sm text-bone-300">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating…
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm text-bone-100 leading-relaxed">
            {answer || "Select a question to generate a premium answer."}
          </pre>
        )}
      </div>
    </div>
  );
}
