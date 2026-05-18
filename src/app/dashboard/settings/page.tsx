"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Linkedin, Mail, ShieldCheck } from "lucide-react";
import { localeLabels, locales } from "@/i18n/config";

export default function SettingsPage() {
  const locale = useLocale();
  const [tone, setTone] = useState("authority");
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Settings</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">Tune your studio.</h1>
      </div>

      <section className="card p-5 space-y-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Profile</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label">Display name</label>
            <input className="input" placeholder="Alex Carter" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" placeholder="alex@blacklink.ai" />
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input" placeholder="AI Engineer" />
          </div>
          <div>
            <label className="label">Niche</label>
            <input className="input" placeholder="Generative AI · SaaS" />
          </div>
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">AI preferences</p>
        <div>
          <label className="label">Default tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="input">
            {["authority", "story", "viral", "hiring", "networking"].map((t) => (
              <option key={t} value={t} className="bg-ink-800 capitalize">{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Language</label>
          <select className="input" defaultValue={locale}>
            {locales.map((l) => (
              <option key={l} value={l} className="bg-ink-800">{localeLabels[l]}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Connections</p>
        <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Linkedin className="h-4 w-4" />
            <div>
              <p className="text-sm">LinkedIn</p>
              <p className="text-[11px] text-bone-400">OAuth 2.0 · w_member_social</p>
            </div>
          </div>
          <a href="/api/auth/linkedin" className="btn-ghost text-xs">Connect</a>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4" />
            <div>
              <p className="text-sm">Email notifications</p>
              <p className="text-[11px] text-bone-400">Weekly performance digest</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20 bg-white/[0.04]" />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4" />
            <div>
              <p className="text-sm">Two-factor authentication</p>
              <p className="text-[11px] text-bone-400">Recommended for Elite plan</p>
            </div>
          </div>
          <button className="btn-ghost text-xs">Enable</button>
        </div>
      </section>
    </div>
  );
}
