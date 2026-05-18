"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/nav/LanguageSwitcher";
import { Particles } from "@/components/fx/Particles";
import { LinkedInPostCard } from "@/components/auth/LinkedInPostCard";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth.left");

  const phrases = [t("f1"), t("f2"), t("f3"), t("f4")];

  return (
    <div className="min-h-screen flex">
      {/* Left cinematic side */}
      <aside className="relative hidden lg:flex flex-1 overflow-hidden border-r border-white/[0.06] bg-ink-900">
        <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <Particles count={36} />

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <Link href="/">
            <Logo />
          </Link>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-bone-400">BLACKLINK AI</p>
              <h2 className="mt-3 h-display text-4xl xl:text-5xl text-gradient leading-tight">
                {phrases[0]}
              </h2>
            </motion.div>

            <div className="space-y-3">
              <LinkedInPostCard
                delay={0.4}
                name="Nora Schwarz"
                role="AI Engineer · Berlin"
                content="Just shipped another SaaS using BLACKLINK AI. The growth on my profile is unreal — 3 recruiter calls this week alone."
                stats={{ likes: "1.2k", comments: 184, reposts: 92 }}
              />
              <LinkedInPostCard
                delay={0.7}
                name="Ravi Mehta"
                role="Founder · Mumbai"
                content="The AI scheduler picked the perfect window. 50k impressions in 24h. This is the future of LinkedIn."
                stats={{ likes: "843", comments: 67, reposts: 41 }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-bone-400">
            {phrases.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </aside>

      {/* Right form side */}
      <section className="relative flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <LanguageSwitcher />
        </div>
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </section>
    </div>
  );
}
