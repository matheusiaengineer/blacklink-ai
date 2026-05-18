"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";

export function LinkedInPostCard({
  name,
  role,
  content,
  stats,
  delay = 0
}: {
  name: string;
  role: string;
  content: string;
  stats: { likes: string; comments: number; reposts: number };
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="card glass p-4 max-w-sm"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-bone-400">{role}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-bone-200 leading-relaxed line-clamp-3">{content}</p>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-bone-400">
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3" /> {stats.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3" /> {stats.comments}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 className="h-3 w-3" /> {stats.reposts}
        </span>
      </div>
    </motion.div>
  );
}
