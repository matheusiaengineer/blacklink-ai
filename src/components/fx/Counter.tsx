"use client";

import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  decimals = 0
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) =>
    `${prefix}${v.toLocaleString("en", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    })}${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
