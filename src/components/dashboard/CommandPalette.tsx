"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  CreditCard,
  Gift,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  group: string;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items: Item[] = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Navigate", action: () => router.push("/dashboard") },
      { id: "generator", label: "AI Generator", hint: "Create posts", icon: Bot, group: "Navigate", action: () => router.push("/dashboard/generator") },
      { id: "scheduler", label: "Scheduler", icon: Calendar, group: "Navigate", action: () => router.push("/dashboard/scheduler") },
      { id: "analytics", label: "Analytics", icon: BarChart3, group: "Navigate", action: () => router.push("/dashboard/analytics") },
      { id: "messages", label: "Messages", icon: MessageSquare, group: "Navigate", action: () => router.push("/dashboard/messages") },
      { id: "branding", label: "Branding", icon: Sparkles, group: "Navigate", action: () => router.push("/dashboard/branding") },
      { id: "career", label: "AI Career", hint: "Resume · Jobs", icon: Briefcase, group: "Navigate", action: () => router.push("/dashboard/career") },
      { id: "talent", label: "Talent Radar", icon: Users, group: "Navigate", action: () => router.push("/dashboard/talent") },
      { id: "achievements", label: "Achievements", icon: Trophy, group: "Navigate", action: () => router.push("/dashboard/achievements") },
      { id: "affiliate", label: "Affiliate", icon: Gift, group: "Navigate", action: () => router.push("/dashboard/affiliate") },
      { id: "settings", label: "Settings", icon: Settings, group: "Navigate", action: () => router.push("/dashboard/settings") },
      { id: "billing", label: "Billing", icon: CreditCard, group: "Navigate", action: () => router.push("/dashboard/billing") },
      { id: "new-post", label: "Generate post", hint: "G then P", icon: Sparkles, group: "Actions", action: () => router.push("/dashboard/generator") },
      { id: "new-image", label: "Generate image", icon: Sparkles, group: "Actions", action: () => router.push("/dashboard/generator?tab=image") },
      { id: "ask-nova", label: "Ask Nova", hint: "AI strategist", icon: Bot, group: "Actions", action: () => window.dispatchEvent(new Event("nova:open")) }
    ],
    [router]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q));
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of filtered) {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] grid place-items-start pt-24 px-4 bg-black/60 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-2xl shadow-glow overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <Search className="h-4 w-4 text-bone-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything…"
                className="flex-1 bg-transparent text-sm placeholder:text-bone-400 outline-none"
              />
              <kbd className="text-[10px] text-bone-400 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {groups.length === 0 && (
                <p className="p-6 text-center text-sm text-bone-400">No results.</p>
              )}
              {groups.map(([group, list]) => (
                <div key={group} className="px-1 py-1">
                  <p className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-bone-400">
                    {group}
                  </p>
                  {list.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => {
                        it.action();
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-bone-100 hover:bg-white/[0.05] transition"
                      )}
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.08] bg-white/[0.02]">
                        <it.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 text-left">{it.label}</span>
                      {it.hint && (
                        <span className="text-[11px] text-bone-400">{it.hint}</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-bone-400">
              <span className="flex items-center gap-1.5">
                <kbd className="border border-white/10 rounded px-1.5 py-0.5">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="border border-white/10 rounded px-1.5 py-0.5">⌘K</kbd>
                Toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
