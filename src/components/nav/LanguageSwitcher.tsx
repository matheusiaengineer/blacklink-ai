"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Check, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const current = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function setLocale(next: Locale) {
    document.cookie = `BLACKLINK_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-bone-200 hover:border-white/20 hover:bg-white/[0.04] transition",
          compact && "px-2"
        )}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-medium uppercase tracking-wider">{current}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-ink-800/90 backdrop-blur-2xl p-1 z-50 shadow-glow"
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-bone-100 hover:bg-white/[0.06] transition",
                  l === current && "text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase text-bone-300">{l}</span>
                  {localeLabels[l]}
                </span>
                {l === current && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
