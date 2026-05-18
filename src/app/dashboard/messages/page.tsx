"use client";

import { motion } from "framer-motion";

const conversations = [
  { name: "Nora Schwarz", role: "AI Engineer · Berlin", preview: "Loved your last post — let's connect.", time: "2m" },
  { name: "Ravi Mehta", role: "Founder · Mumbai", preview: "Are you open to a collab?", time: "1h" },
  { name: "Recruiter @Linear", role: "Talent · SF", preview: "We have a role that fits you perfectly.", time: "3h" },
  { name: "Mariana Lopes", role: "Designer · São Paulo", preview: "Sharing a board with you.", time: "1d" }
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-bone-400">Messages</p>
        <h1 className="mt-2 h-display text-3xl md:text-4xl text-gradient">Inbox, prioritized.</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-1 card p-3">
          {conversations.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="w-full text-left rounded-xl px-3 py-3 hover:bg-white/[0.04] transition flex gap-3"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm truncate">{c.name}</p>
                  <span className="text-[10px] text-bone-400">{c.time}</span>
                </div>
                <p className="text-[11px] text-bone-400 truncate">{c.role}</p>
                <p className="text-xs text-bone-200 truncate mt-1">{c.preview}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-2 card p-5 min-h-[420px] flex flex-col">
          <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/10" />
            <div>
              <p className="text-sm">Nora Schwarz</p>
              <p className="text-[11px] text-bone-400">Active 2m ago</p>
            </div>
          </div>
          <div className="flex-1 py-6 space-y-3 text-sm">
            <Bubble side="left">Hey, your last post was 🔥 — what tool did you use?</Bubble>
            <Bubble side="right">Thanks! BLACKLINK AI generated the hook and scheduling.</Bubble>
            <Bubble side="left">Send me your invite — open to chat about a collab?</Bubble>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
            <input
              placeholder="Reply with AI assist…"
              className="flex-1 bg-transparent px-2 py-1.5 text-sm placeholder:text-bone-400 outline-none"
            />
            <button className="btn-primary text-xs px-3 py-1.5">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const isRight = side === "right";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isRight ? "bg-white text-black" : "bg-white/[0.04] border border-white/[0.08] text-bone-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
