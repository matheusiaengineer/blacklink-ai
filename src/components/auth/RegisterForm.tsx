"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { localeLabels, locales } from "@/i18n/config";

const countries = [
  "Brazil", "United States", "Germany", "Spain", "France", "India",
  "Russia", "United Kingdom", "Portugal", "Mexico", "Japan", "Canada",
  "Argentina", "Colombia", "Netherlands", "Australia", "South Africa"
];

function strengthLabel(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "bg-white/10", width: "w-0" };
  if (pw.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
  if (pw.length < 10) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
  if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
    return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
  return { label: "Strong", color: "bg-white", width: "w-full" };
}

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [form, setForm] = useState({
    username: "", email: "", password: "", confirmPassword: "",
    country: "Brazil", language: "en", terms: false
  });
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const strength = strengthLabel(form.password);

  function set(k: keyof typeof form, v: string | boolean) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!form.terms) {
      setError("Please accept the terms");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="h-display text-3xl md:text-4xl text-gradient">{t("registerTitle")}</h1>
        <p className="text-sm text-bone-300">{t("registerSubtitle")}</p>
      </div>

      <OAuthButtons />

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-bone-400">
        <span className="h-px flex-1 bg-white/[0.06]" />
        or
        <span className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="username">{t("username")}</label>
            <input
              id="username" required className="input" placeholder="johndoe"
              value={form.username} onChange={(e) => set("username", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">{t("email")}</label>
            <input
              id="email" type="email" required className="input" placeholder="you@email.com"
              value={form.email} onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="password">{t("password")}</label>
          <div className="relative">
            <input
              id="password" type={showPw ? "text" : "password"} required
              className="input pr-10" placeholder="••••••••"
              value={form.password} onChange={(e) => set("password", e.target.value)}
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bone-400 hover:text-white">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 space-y-1">
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${strength.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: strength.width }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-[11px] text-bone-400">{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">{t("confirmPassword")}</label>
          <input
            id="confirmPassword" type="password" required className="input" placeholder="••••••••"
            value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="country">{t("country")}</label>
            <select id="country" className="input" value={form.country}
              onChange={(e) => set("country", e.target.value)}>
              {countries.map((c) => (
                <option key={c} value={c} className="bg-ink-800">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="language">{t("language")}</label>
            <select id="language" className="input" value={form.language}
              onChange={(e) => set("language", e.target.value)}>
              {locales.map((l) => (
                <option key={l} value={l} className="bg-ink-800">{localeLabels[l]}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-start gap-2 text-xs text-bone-300 cursor-pointer">
          <input
            type="checkbox" checked={form.terms}
            onChange={(e) => set("terms", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.04]"
          />
          <span>{t("terms")}</span>
        </label>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <button type="submit" disabled={pending} className="btn-primary btn-magnetic w-full group">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t("register")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-sm text-bone-300 text-center">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-white underline-offset-4 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
