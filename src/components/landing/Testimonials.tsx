"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";

const TESTIMONIALS = [
  {
    name: "Nora Schwarz",
    role: "AI Engineer · Berlin",
    text: "I went from 300 to 14K followers in 3 months. BLACKLINK AI generates posts that actually sound like me — not a robot.",
    stars: 5
  },
  {
    name: "Ravi Mehta",
    role: "Founder · Mumbai",
    text: "The anti-ban scheduler is genius. My posts go out at perfect times and LinkedIn loves the consistency. 3 recruiter calls this week.",
    stars: 5
  },
  {
    name: "Mariana Lopes",
    role: "Product Designer · São Paulo",
    text: "The black & white image engine is insane. My posts look like they were designed by a premium agency. Engagement went up 400%.",
    stars: 5
  },
  {
    name: "James Park",
    role: "DevRel · Seoul",
    text: "NOVA understood my niche in 2 messages and built a 7-day campaign that got me 50K impressions. This is the future.",
    stars: 5
  },
  {
    name: "Sofia Andersen",
    role: "Growth Lead · Copenhagen",
    text: "The affiliate system alone paid for my subscription 10x over. I referred 40 people and earn recurring commissions every month.",
    stars: 5
  },
  {
    name: "Carlos Vega",
    role: "ML Engineer · Mexico City",
    text: "I was invisible on LinkedIn for 5 years. After 6 weeks with BLACKLINK AI, a startup in SF reached out to hire me.",
    stars: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 border-t border-white/[0.06] overflow-hidden">
      <div className="container">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-bone-400 text-center">
            Social proof
          </p>
          <h2 className="h-display mt-3 text-center text-3xl md:text-5xl text-gradient">
            Professionals who transformed.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="card card-hover p-6 flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-white text-white" />
                ))}
              </div>
              <p className="text-sm text-bone-200 leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/30 to-white/5 border border-white/10 grid place-items-center shrink-0">
                  <span className="text-xs font-semibold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-[11px] text-bone-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
