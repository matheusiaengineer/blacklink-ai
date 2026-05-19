"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Bot,
  Calendar,
  CreditCard,
  Gift,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  Cpu
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  {
    group: "Core",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
      { href: "/dashboard/generator", icon: Bot, key: "generator" },
      { href: "/dashboard/scheduler", icon: Calendar, key: "scheduler" },
      { href: "/dashboard/campaigns", icon: Zap, key: "campaigns", label: "Campaigns" },
      { href: "/dashboard/analytics", icon: BarChart3, key: "analytics" }
    ]
  },
  {
    group: "Growth",
    items: [
      { href: "/dashboard/branding", icon: Sparkles, key: "branding" },
      { href: "/dashboard/network", icon: Globe, key: "network", label: "Network AI" },
      { href: "/dashboard/talent", icon: Users, key: "talent", label: "Talent Radar" },
      { href: "/dashboard/career", icon: Target, key: "career", label: "AI Career" },
      { href: "/dashboard/reputation", icon: Trophy, key: "reputation", label: "Reputation" }
    ]
  },
  {
    group: "Account",
    items: [
      { href: "/dashboard/messages", icon: MessageSquare, key: "messages" },
      { href: "/dashboard/achievements", icon: Trophy, key: "achievements", label: "Achievements" },
      { href: "/dashboard/affiliate", icon: Gift, key: "affiliate" },
      { href: "/dashboard/settings", icon: Settings, key: "settings" },
      { href: "/dashboard/settings/providers", icon: Cpu, key: "providers", label: "AI Providers" },
      { href: "/dashboard/billing", icon: CreditCard, key: "billing" }
    ]
  }
] as const;

export function Sidebar() {
  const t = useTranslations("dashboard.nav");
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/[0.06] bg-ink-900/40 backdrop-blur-xl">
      <div className="p-5 border-b border-white/[0.06]">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.25em] text-bone-400">
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map((it) => {
                const active = pathname === it.href;
                const label = "label" in it ? it.label : t(it.key as Parameters<typeof t>[0]);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                      active
                        ? "bg-white/[0.07] text-white shadow-ring"
                        : "text-bone-300 hover:bg-white/[0.03] hover:text-white"
                    )}
                  >
                    <it.icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.06] space-y-2">
        <div className="card p-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bone-400">Pro Plan</p>
          <p className="mt-1 text-sm">Unlimited AI · Premium</p>
          <button className="mt-3 btn-primary w-full text-xs px-3 py-1.5">Upgrade</button>
        </div>
        <p className="text-center text-[10px] text-bone-400">
          Press <kbd className="border border-white/10 rounded px-1">⌘K</kbd> to search
        </p>
      </div>
    </aside>
  );
}
