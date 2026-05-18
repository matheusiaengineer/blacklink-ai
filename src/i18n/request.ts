import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";

function detectLocale(): Locale {
  const cookieLocale = cookies().get("BLACKLINK_LOCALE")?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const accept = headers().get("accept-language") ?? "";
  const preferred = accept.split(",")[0]?.split("-")[0] as Locale | undefined;
  if (preferred && locales.includes(preferred)) return preferred;

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = detectLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
