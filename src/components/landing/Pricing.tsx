"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");
  const plans = ["free", "pro", "enterprise"] as const;

  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-white/[0.06]">
      <div className="container">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400 text-center">Pricing</p>
          <h2 className="h-display mt-3 text-center text-3xl md:text-5xl text-gradient">
            {t("title")}
          </h2>
          <p className="mt-4 text-center text-bone-300">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => {
            const isPopular = plan === "pro";
            return (
              <Reveal key={plan} delay={i * 0.08}>
                <div
                  className={cn(
                    "card card-hover p-6 h-full relative",
                    isPopular && "border-white/30 bg-white/[0.04]"
                  )}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-6 chip bg-white text-black border-white">
                      {t("popular")}
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-[0.2em] text-bone-400">
                    {t(`${plan}.name`)}
                  </p>
                  <p className="mt-4 font-display text-4xl font-semibold tracking-tightest">
                    {t(`${plan}.price`)}
                    <span className="text-base text-bone-400 font-normal">{t("perMonth")}</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-bone-200">
                    {(t.raw(`${plan}.items`) as string[]).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-0.5 text-white shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={cn(
                      "mt-6 w-full",
                      isPopular ? "btn-primary" : "btn-ghost",
                      "btn-magnetic"
                    )}
                  >
                    {t("cta")}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
