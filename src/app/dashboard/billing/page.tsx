"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function BillingPage() {
  const t = useTranslations("pricing");
  const plans = ["free", "pro", "enterprise"] as const;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Billing</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">Pick your plan.</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => {
          const isPopular = plan === "pro";
          return (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card p-6 relative ${isPopular ? "border-white/30 bg-white/[0.04]" : ""}`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-6 chip bg-white text-black border-white">
                  {t("popular")}
                </span>
              )}
              <p className="text-xs uppercase tracking-[0.2em] text-bone-400">{t(`${plan}.name`)}</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-tightest">
                {t(`${plan}.price`)}
                <span className="text-base text-bone-400 font-normal">{t("perMonth")}</span>
              </p>
              <ul className="mt-5 space-y-3 text-sm text-bone-200">
                {(t.raw(`${plan}.items`) as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-white shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className={`mt-6 w-full ${isPopular ? "btn-primary" : "btn-ghost"} btn-magnetic`}>
                {t("cta")}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="card p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Invoices</p>
        <table className="mt-4 w-full text-sm">
          <thead className="text-bone-400 text-xs uppercase tracking-[0.15em]">
            <tr>
              <th className="text-left pb-3">Date</th>
              <th className="text-left pb-3">Plan</th>
              <th className="text-left pb-3">Amount</th>
              <th className="text-right pb-3">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {[
              ["2026-04-12", "Pro", "$15.00"],
              ["2026-03-12", "Pro", "$15.00"],
              ["2026-02-12", "Starter", "$2.00"]
            ].map(([d, p, a]) => (
              <tr key={d} className="text-bone-100">
                <td className="py-3">{d}</td>
                <td className="py-3">{p}</td>
                <td className="py-3">{a}</td>
                <td className="py-3 text-right">
                  <a href="#" className="text-bone-300 hover:text-white">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
