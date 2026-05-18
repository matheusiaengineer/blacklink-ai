"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";

type Item = { q: string; a: string };

export function FAQ() {
  const t = useTranslations("faq");
  const items = (t.raw("items") as Item[]) ?? [];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 border-t border-white/[0.06]">
      <div className="container max-w-3xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400 text-center">FAQ</p>
          <h2 className="h-display mt-3 text-center text-3xl md:text-5xl text-gradient">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base md:text-lg font-medium">{it.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 h-7 w-7 rounded-full border border-white/10 grid place-items-center"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-bone-300 max-w-2xl leading-relaxed">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
