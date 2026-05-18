"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  Globe,
  Linkedin,
  Sparkles,
  Target,
  User
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ROLES = ["Developer", "Designer", "Founder", "Marketer", "Recruiter", "Creator", "Freelancer", "Other"];
const NICHES = ["Artificial Intelligence", "SaaS", "Web3", "Design Systems", "DevRel", "Growth", "Product", "Data Science"];
const GOALS = [
  { id: "job", icon: Briefcase, label: "Get hired", desc: "Find my next role" },
  { id: "clients", icon: Target, label: "Get clients", desc: "Grow my freelance business" },
  { id: "authority", icon: Sparkles, label: "Build authority", desc: "Become a thought leader" },
  { id: "network", icon: Globe, label: "Expand network", desc: "Connect with the right people" }
];

type Step = "welcome" | "role" | "niche" | "goal" | "language" | "linkedin" | "done";
const STEPS: Step[] = ["welcome", "role", "niche", "goal", "language", "linkedin", "done"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState({
    role: "",
    niche: "",
    goal: "",
    language: "en"
  });

  const idx = STEPS.indexOf(step);
  const progress = (idx / (STEPS.length - 1)) * 100;

  function next() {
    const nextStep = STEPS[idx + 1];
    if (nextStep) setStep(nextStep);
    else router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-white/[0.06]">
        <motion.div
          className="h-full bg-white"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === "welcome" && (
                <StepShell
                  icon={<Sparkles className="h-6 w-6" />}
                  title="Welcome to BLACKLINK AI."
                  subtitle="Let's build your professional authority in 60 seconds."
                  onNext={next}
                  nextLabel="Let's go"
                />
              )}

              {step === "role" && (
                <StepShell
                  icon={<User className="h-6 w-6" />}
                  title="What's your role?"
                  subtitle="We'll tailor your AI content and strategy."
                  onNext={next}
                  canNext={!!data.role}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => setData((d) => ({ ...d, role: r }))}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm text-left transition",
                          data.role === r ? "border-white bg-white/[0.06] text-white" : "border-white/10 text-bone-200 hover:border-white/20"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === "niche" && (
                <StepShell
                  icon={<Target className="h-6 w-6" />}
                  title="What's your niche?"
                  subtitle="Your AI posts will be optimized for this space."
                  onNext={next}
                  canNext={!!data.niche}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {NICHES.map((n) => (
                      <button
                        key={n}
                        onClick={() => setData((d) => ({ ...d, niche: n }))}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm text-left transition",
                          data.niche === n ? "border-white bg-white/[0.06] text-white" : "border-white/10 text-bone-200 hover:border-white/20"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === "goal" && (
                <StepShell
                  icon={<Bot className="h-6 w-6" />}
                  title="What's your main goal?"
                  subtitle="NOVA will build your strategy around this."
                  onNext={next}
                  canNext={!!data.goal}
                >
                  <div className="grid grid-cols-1 gap-2">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setData((d) => ({ ...d, goal: g.id }))}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left transition flex items-center gap-3",
                          data.goal === g.id ? "border-white bg-white/[0.06]" : "border-white/10 hover:border-white/20"
                        )}
                      >
                        <div className={cn(
                          "h-9 w-9 rounded-lg border grid place-items-center shrink-0",
                          data.goal === g.id ? "border-white bg-white text-black" : "border-white/10"
                        )}>
                          <g.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{g.label}</p>
                          <p className="text-xs text-bone-400">{g.desc}</p>
                        </div>
                        {data.goal === g.id && <Check className="h-4 w-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === "language" && (
                <StepShell
                  icon={<Globe className="h-6 w-6" />}
                  title="Preferred language?"
                  subtitle="NOVA and your posts will use this language."
                  onNext={next}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => setData((d) => ({ ...d, language: l }))}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm text-left transition flex items-center gap-2",
                          data.language === l ? "border-white bg-white/[0.06] text-white" : "border-white/10 text-bone-200 hover:border-white/20"
                        )}
                      >
                        <span className="font-mono text-[10px] uppercase text-bone-400 w-6">{l}</span>
                        {localeLabels[l]}
                        {data.language === l && <Check className="h-3.5 w-3.5 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === "linkedin" && (
                <StepShell
                  icon={<Linkedin className="h-6 w-6" />}
                  title="Connect LinkedIn."
                  subtitle="Required to publish posts and track analytics. You can skip for now."
                  onNext={next}
                  nextLabel="Skip for now"
                >
                  <a
                    href="/api/auth/linkedin"
                    className="btn-primary btn-magnetic w-full text-base py-3"
                  >
                    <Linkedin className="h-4 w-4" />
                    Connect with LinkedIn
                  </a>
                </StepShell>
              )}

              {step === "done" && (
                <StepShell
                  icon={<Check className="h-6 w-6" />}
                  title="You're all set."
                  subtitle={`Welcome, ${data.role || "professional"}. NOVA is ready to build your authority.`}
                  onNext={() => router.push("/dashboard")}
                  nextLabel="Enter dashboard"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div className="mt-10 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i <= idx ? "bg-white w-6" : "bg-white/20 w-1.5"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepShell({
  icon,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = "Continue",
  canNext = true
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  onNext: () => void;
  nextLabel?: string;
  canNext?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.03] grid place-items-center">
          {icon}
        </div>
        <h2 className="h-display text-3xl md:text-4xl text-gradient">{title}</h2>
        <p className="text-sm text-bone-300">{subtitle}</p>
      </div>

      {children && <div>{children}</div>}

      <button
        onClick={onNext}
        disabled={!canNext}
        className="btn-primary btn-magnetic w-full text-base py-3 group disabled:opacity-40"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
