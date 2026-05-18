"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <motion.div
        className="relative h-7 w-7 rounded-md bg-white text-black grid place-items-center overflow-hidden"
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <span className="font-display font-bold text-[13px] tracking-tightest">BL</span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-tr from-white via-white to-bone-200"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
      {withText && (
        <span className="font-display font-semibold tracking-tightest text-[15px]">
          BLACKLINK <span className="text-bone-300">AI</span>
        </span>
      )}
    </div>
  );
}
