"use client";

import { useTranslations } from "next-intl";
import { Github, Linkedin } from "lucide-react";

export function OAuthButtons() {
  const t = useTranslations("auth");

  return (
    <div className="grid grid-cols-1 gap-2">
      <button type="button" className="btn-ghost btn-magnetic w-full">
        <Linkedin className="h-4 w-4" />
        {t("linkedin")}
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn-ghost btn-magnetic">
          <GoogleIcon />
          {t("google")}
        </button>
        <button type="button" className="btn-ghost btn-magnetic">
          <Github className="h-4 w-4" />
          {t("github")}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v3.2h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.67-5.85-5.95 0-3.28 2.63-5.95 5.85-5.95 1.84 0 3.07.78 3.78 1.46l2.58-2.5C16.7 4.2 14.6 3.3 12 3.3 6.98 3.3 2.9 7.38 2.9 12.4S6.98 21.5 12 21.5c6.92 0 9.6-4.85 9.6-7.4 0-.5-.05-.85-.1-1.2z"
      />
    </svg>
  );
}
