"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";

export function CTA() {
  const t = useTranslations("hero");
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="card overflow-hidden relative px-6 py-16 md:px-16 md:py-24 text-center">
            <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative">
              <h2 className="h-display text-4xl md:text-6xl text-gradient">
                {t("title")}
              </h2>
              <p className="mt-4 text-bone-300 max-w-xl mx-auto">{t("subtitle")}</p>
              <div className="mt-8 flex justify-center">
                <Link href="/register" className="btn-primary btn-magnetic">
                  {t("ctaPrimary")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
