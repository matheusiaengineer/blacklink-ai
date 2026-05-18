import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "@/lib/security/jwt";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/onboarding",
  "/api/auth",
  "/api/stripe/webhook",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap"
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Locale persistence ──────────────────────────────────────────────────
  const res = NextResponse.next();
  const localeCookie = req.cookies.get("BLACKLINK_LOCALE");
  if (!localeCookie) {
    const accept = req.headers.get("accept-language") ?? "";
    const preferred = accept.split(",")[0]?.split("-")[0] ?? "en";
    const supported = ["en", "pt", "es", "de", "ru", "hi", "fr"];
    const locale = supported.includes(preferred) ? preferred : "en";
    res.cookies.set("BLACKLINK_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax"
    });
  }

  // ── Auth guard ───────────────────────────────────────────────────────────
  if (isPublic(pathname)) return res;

  const token =
    req.cookies.get("BLACKLINK_SESSION")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(loginUrl);
    redirect.cookies.delete("BLACKLINK_SESSION");
    return redirect;
  }

  // Forward user info to server components via headers
  res.headers.set("x-user-id", payload.sub);
  res.headers.set("x-user-plan", String(payload.plan ?? "free"));
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|robots|sitemap).*)"]
};
