"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/nav/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: t("features") },
    { href: "#pricing", label: t("pricing") },
    { href: "#faq", label: t("faq") }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container">
        <div
          className={cn(
            "flex items-center justify-between rounded-full border px-4 py-2.5 transition-all",
            scrolled
              ? "border-white/10 bg-ink-900/70 backdrop-blur-2xl shadow-glow"
              : "border-transparent bg-transparent"
          )}
        >
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm text-bone-200 hover:text-white transition rounded-full hover:bg-white/[0.04]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/login" className="btn-ghost btn-magnetic">
              {t("login")}
            </Link>
            <Link href="/register" className="btn-primary btn-magnetic">
              {t("start")}
            </Link>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-full border border-white/10 p-2 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 mt-2 rounded-2xl border border-white/10 bg-ink-900/90 backdrop-blur-2xl p-4 space-y-3"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-bone-100 py-2"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              <Link href="/login" className="btn-ghost flex-1">
                {t("login")}
              </Link>
              <Link href="/register" className="btn-primary flex-1">
                {t("start")}
              </Link>
            </div>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
