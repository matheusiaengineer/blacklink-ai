"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import {
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export function Features() {
  const t = useTranslations("features");
  const items: Array<{
    key: "generator" | "scheduler" | "analytics" | "branding" | "jobs" | "agency";
    icon: React.ComponentType<{ className?: string }>;
    span?: string;
  }> = [
    { key: "generator", icon: Bot, span: "lg:col-span-2" },
    { key: "scheduler", icon: Calendar },
    { key: "analytics", icon: BarChart3 },
    { key: "branding", icon: Sparkles },
    { key: "jobs", icon: Briefcase },
    { key: "agency", icon: Layers, span: "lg:col-span-2" }
  ];

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400 text-center">
            Capabilities
          </p>
          <h2 className="h-display mt-3 text-center text-3xl md:text-5xl text-gradient">
            {t("title")}
          </h2>
          <p className="mt-4 text-center text-bone-300 max-w-2xl mx-auto">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <Reveal key={it.key} delay={i * 0.06} className={it.span ?? ""}>
              <div className="card card-hover p-6 h-full relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/[0.04] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center">
                    <it.icon className="h-4 w-4 text-bone-100" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tightest">
                    {t(`items.${it.key}.title`)}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-bone-300 leading-relaxed">
                  {t(`items.${it.key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
