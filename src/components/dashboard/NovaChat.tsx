"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { ArrowUp, Sparkles, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

export function NovaChat() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I am NOVA. I read profiles, write posts and orchestrate growth. Tell me your goal."
    }
  ]);
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("nova:open", onOpen);
    return () => window.removeEventListener("nova:open", onOpen);
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || pending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: locale, history: next })
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Something went wrong. Try again."
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please retry." }
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium shadow-glow hover:scale-[1.02] transition"
      >
        <MessageSquare className="h-4 w-4" />
        Ask Nova
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[420px] flex flex-col border-l border-white/10 bg-ink-900/95 backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">NOVA</p>
                  <p className="text-[11px] text-bone-400">AI growth strategist</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 hover:bg-white/[0.04]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-white text-black"
                      : "bg-white/[0.04] border border-white/[0.08] text-bone-100"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {pending && (
                <div className="bg-white/[0.04] border border-white/[0.08] inline-flex gap-1 rounded-2xl px-4 py-3">
                  <Dot delay={0} />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </div>
              )}
            </div>

            <footer className="border-t border-white/10 p-4">
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="Ask Nova anything…"
                  className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-bone-400 outline-none max-h-32"
                />
                <button
                  onClick={send}
                  disabled={pending || !input.trim()}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white text-black disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, ease: "easeInOut" }}
      className="h-1.5 w-1.5 rounded-full bg-white"
    />
  );
}
