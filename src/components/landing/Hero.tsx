"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Particles } from "@/components/fx/Particles";
import { TypeWriter } from "@/components/fx/TypeWriter";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

const PHRASES = [
  "Build Authority Automatically.",
  "AI Powered LinkedIn Growth.",
  "Get Hired Faster With AI.",
  "Turn Posts Into Opportunities."
];

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Grid + radial glow */}
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-radial pointer-events-none" />
      <Particles count={36} />

      <div className="container relative">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
            <Sparkles className="h-3 w-3" />
            {t("eyebrow")}
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="h-display mt-6 text-center text-[44px] sm:text-[64px] md:text-[88px] leading-[0.95] text-gradient"
        >
          {t("title")}
        </motion.h1>

        {/* Typewriter sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 text-center text-base md:text-xl text-bone-300 h-8"
        >
          <TypeWriter phrases={PHRASES} />
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 mx-auto max-w-2xl text-center text-sm md:text-base text-bone-400"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register" className="btn-primary btn-magnetic group text-base px-6 py-3">
            {t("ctaPrimary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="#demo" className="btn-ghost btn-magnetic text-base px-6 py-3">
            <Play className="h-3.5 w-3.5" />
            {t("ctaSecondary")}
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-center text-xs text-bone-400"
        >
          {t("trust")}
        </motion.p>

        {/* Nova AI preview strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-10 mx-auto max-w-2xl"
        >
          <NovaPreview />
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 md:mt-14"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function NovaPreview() {
  const lines = [
    { role: "user", text: "Create a viral AI post about my SaaS launch." },
    {
      role: "nova",
      text: "Analyzing your profile… Generating authority hook + campaign. Estimated reach: 40K impressions."
    }
  ];

  return (
    <div className="card glass p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-black">
          <Sparkles className="h-3 w-3" />
        </span>
        <p className="text-xs font-medium">NOVA — AI Growth Strategist</p>
        <span className="ml-auto flex items-center gap-1 text-[11px] text-bone-400">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
          Live
        </span>
      </div>
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: l.role === "user" ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.4 }}
          className={`flex ${l.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
              l.role === "user"
                ? "bg-white text-black"
                : "bg-white/[0.04] border border-white/[0.08] text-bone-100"
            }`}
          >
            {l.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
