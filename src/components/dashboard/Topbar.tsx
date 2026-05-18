"use client";

import { Bell, Search } from "lucide-react";
import { LanguageSwitcher } from "@/components/nav/LanguageSwitcher";
import { Notifications } from "@/components/dashboard/Notifications";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-ink-900/60 backdrop-blur-xl px-4 md:px-8 py-3">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-bone-400" />
          <input
            placeholder="Search or press ⌘K…"
            className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-bone-400 outline-none focus:border-white/20 transition cursor-pointer"
            readOnly
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher compact />
        <Notifications />
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/10" />
      </div>
    </header>
  );
}
