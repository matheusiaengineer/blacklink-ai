"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Sparkles } from "lucide-react";

export default function BrandingPage() {
  const locale = useLocale();
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [output, setOutput] = useState<string>("");
  const [pending, setPending] = useState(false);

  async function analyze() {
    setPending(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Rewrite for authority. Headline: ${headline}. Bio: ${bio}. Skills: ${skills}.`,
          language: locale,
          tone: "authority"
        })
      });
      const data = (await res.json()) as { text?: string; error?: string };
      setOutput(data.text ?? data.error ?? "");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Branding</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">
          Authority, refined by AI.
        </h1>
      </div>

      <section className="card p-5 space-y-4">
        <div>
          <label className="label">Current headline</label>
          <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Current bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input min-h-32 resize-y" />
        </div>
        <div>
          <label className="label">Skills (comma separated)</label>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} className="input" />
        </div>
        <button onClick={analyze} disabled={pending} className="btn-primary btn-magnetic">
          <Sparkles className="h-4 w-4" />
          {pending ? "Optimizing…" : "Optimize my profile"}
        </button>
      </section>

      {output && (
        <section className="card p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">AI rewrite</p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-bone-100 leading-relaxed">
            {output}
          </pre>
        </section>
      )}
    </div>
  );
}
