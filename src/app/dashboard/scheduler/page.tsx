"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Sparkles } from "lucide-react";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Slot = { day: number; hour: number; minute: number; topic: string; status: "scheduled" | "draft" };

function generateMockSlots(): Slot[] {
  const slots: Slot[] = [];
  const topics = [
    "AI in product growth",
    "How I shipped my first SaaS",
    "Authority hook of the week",
    "Recruiter signal post",
    "Storytelling: lessons from launches"
  ];
  for (let day = 0; day < 7; day++) {
    const count = day % 2 === 0 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      slots.push({
        day,
        hour: i === 0 ? 8 : 17,
        minute: Math.floor(Math.random() * 60),
        topic: topics[(day + i) % topics.length],
        status: Math.random() > 0.3 ? "scheduled" : "draft"
      });
    }
  }
  return slots;
}

export default function SchedulerPage() {
  const slots = useMemo(generateMockSlots, []);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Scheduler</p>
          <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">Your humanized week.</h1>
          <p className="mt-2 text-sm text-bone-300">
            Anti-ban engine spreads posts inside safe windows and adds natural jitter.
          </p>
        </div>
        <button className="btn-primary btn-magnetic">
          <Sparkles className="h-3.5 w-3.5" /> Plan with AI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekdays.map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-4 min-h-[200px]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">{d}</p>
              <Calendar className="h-3.5 w-3.5 text-bone-400" />
            </div>
            <div className="mt-3 space-y-2">
              {slots
                .filter((s) => s.day === i)
                .map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-bone-300">
                      <Clock className="h-3 w-3" />
                      {String(s.hour).padStart(2, "0")}:{String(s.minute).padStart(2, "0")}
                      <span
                        className={
                          s.status === "scheduled"
                            ? "ml-auto chip"
                            : "ml-auto chip border-white/20"
                        }
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-bone-100 line-clamp-2">{s.topic}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
