"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="border-t border-white/[0.06] mt-32">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <Logo />
            <p className="text-xs text-bone-400">{t("made")}</p>
          </div>

          <div className="grid grid-cols-2 md:flex gap-x-10 gap-y-3 text-sm text-bone-300">
            <Link href="#features" className="hover:text-white transition">Features</Link>
            <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="#faq" className="hover:text-white transition">FAQ</Link>
            <Link href="/login" className="hover:text-white transition">Login</Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-bone-400">© {new Date().getFullYear()} BLACKLINK AI. {t("rights")}</p>
          <div className="flex gap-4 text-xs text-bone-400">
            <Link href="#" className="hover:text-white transition">Privacy</Link>
            <Link href="#" className="hover:text-white transition">Terms</Link>
            <Link href="#" className="hover:text-white transition">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
