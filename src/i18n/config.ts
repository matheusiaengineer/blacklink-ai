export const locales = ["en", "pt", "es", "de", "ru", "hi", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  de: "Deutsch",
  ru: "Русский",
  hi: "हिन्दी",
  fr: "Français"
};

export const localeFlags: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
  es: "ES",
  de: "DE",
  ru: "RU",
  hi: "HI",
  fr: "FR"
};
