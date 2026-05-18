"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Globe, Sparkles, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";

type Event = {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  meta: string;
};

const SAMPLES: Omit<Event, "id">[] = [
  { icon: Sparkles, text: "AI generated a viral hook", meta: "São Paulo · just now" },
  { icon: TrendingUp, text: "Profile growth +28%", meta: "Berlin · 12s ago" },
  { icon: Briefcase, text: "Recruiter from Linear viewed profile", meta: "San Francisco · 22s ago" },
  { icon: Globe, text: "New connection from India", meta: "Bangalore · 41s ago" },
  { icon: Sparkles, text: "Authority post scheduled for 09:24", meta: "Lisbon · 1m ago" },
  { icon: TrendingUp, text: "Engagement rate jumped to 9.4%", meta: "Mexico City · 1m ago" }
];

export function LiveFeed() {
  const [events, setEvents] = useState<Event[]>(
    SAMPLES.slice(0, 4).map((e, i) => ({ ...e, id: i }))
  );

  useEffect(() => {
    let id = events.length;
    const interval = setInterval(() => {
      const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
      setEvents((prev) => [{ ...sample, id: ++id }, ...prev].slice(0, 5));
    }, 2400);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-white/[0.06]">
      <div className="container">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400 text-center">Live</p>
          <h2 className="h-display mt-3 text-center text-3xl md:text-5xl text-gradient">
            BLACKLINK is alive.
          </h2>
          <p className="mt-4 text-center text-bone-300 max-w-xl mx-auto">
            A real-time pulse of growth happening around the world.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 mx-auto max-w-2xl card p-3">
            <ul className="divide-y divide-white/[0.06]">
              <AnimatePresence initial={false}>
                {events.map((e) => (
                  <motion.li
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
                      <e.icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">{e.text}</p>
                      <p className="text-[11px] text-bone-400">{e.meta}</p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
