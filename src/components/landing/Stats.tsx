"use client";

import { useTranslations } from "next-intl";
import { Counter } from "@/components/fx/Counter";
import { Reveal } from "@/components/fx/Reveal";

export function Stats() {
  const t = useTranslations("stats");
  const items = [
    { to: 1.2, suffix: "M+", label: t("professionals"), decimals: 1 },
    { to: 50, suffix: "M+", label: t("posts") },
    { to: 120, suffix: "+", label: t("countries") },
    { to: 98, suffix: "%", label: t("engagement") },
    { to: 300, suffix: "K+", label: t("jobs") }
  ];

  return (
    <section className="py-20 border-y border-white/[0.06] bg-white/[0.01]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.05} className="text-center">
              <p className="font-display text-3xl md:text-5xl font-semibold tracking-tightest">
                <Counter to={it.to} suffix={it.suffix} decimals={it.decimals ?? 0} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bone-400">{it.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
