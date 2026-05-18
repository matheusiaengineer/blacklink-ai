"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Invalid credentials");
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
        <h1 className="h-display text-3xl md:text-4xl text-gradient">{t("loginTitle")}</h1>
        <p className="text-sm text-bone-300">{t("loginSubtitle")}</p>
      </div>

      <OAuthButtons />

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-bone-400">
        <span className="h-px flex-1 bg-white/[0.06]" />
        or
        <span className="h-px flex-1 bg-white/[0.06]" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">{t("email")}</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">{t("password")}</label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-bone-400 hover:text-white"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary btn-magnetic w-full group"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t("login")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-sm text-bone-300 text-center">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-white underline-offset-4 hover:underline">
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
