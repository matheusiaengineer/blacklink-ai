"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Briefcase, Sparkles, TrendingUp, X } from "lucide-react";

type Notif = {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const INITIAL: Notif[] = [
  { id: 1, icon: Sparkles, title: "Post scheduled", body: "Your AI post is queued for 09:24 AM", time: "2m ago", read: false },
  { id: 2, icon: TrendingUp, title: "Engagement spike", body: "Your last post reached 8.4K impressions", time: "1h ago", read: false },
  { id: 3, icon: Briefcase, title: "Recruiter viewed profile", body: "Someone from Linear viewed your profile", time: "3h ago", read: true }
];

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);
  const unread = notifs.filter((n) => !n.read).length;

  function markAll() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: number) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 grid place-items-center rounded-full border border-white/10 hover:bg-white/[0.04] transition"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-2xl shadow-glow z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium">Notifications</p>
              <button onClick={markAll} className="text-[11px] text-bone-400 hover:text-white transition">
                Mark all read
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifs.length === 0 && (
                <p className="p-6 text-center text-sm text-bone-400">All caught up.</p>
              )}
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] ${!n.read ? "bg-white/[0.02]" : ""}`}
                >
                  <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.03] grid place-items-center shrink-0 mt-0.5">
                    <n.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-bone-400 mt-0.5">{n.body}</p>
                    <p className="text-[10px] text-bone-400 mt-1">{n.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="text-bone-400 hover:text-white transition mt-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
