import { NextResponse } from "next/server";
import { signJwt } from "@/lib/security/jwt";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * In production: verify credentials against Supabase Auth.
 * Here we stub the lookup and issue a real JWT cookie.
 */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "auth:login"), { capacity: 5, refillPerSecond: 5 / 60 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; password?: string }
      | null;

    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // ── Supabase Auth stub ──────────────────────────────────────────────────
    // const sb = createSupabaseServerClient();
    // const { data, error } = await sb.auth.signInWithPassword({ email, password });
    // if (error || !data.user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    // const userId = data.user.id;
    // const plan = data.user.user_metadata?.plan ?? "free";
    // ───────────────────────────────────────────────────────────────────────

    // Stub: accept any credentials in dev, reject empty
    const userId = `demo-${Buffer.from(email).toString("base64").slice(0, 8)}`;
    const plan = "pro" as const;

    const token = await signJwt({ sub: userId, email, plan });

    const res = NextResponse.json({ ok: true, plan });
    res.cookies.set("BLACKLINK_SESSION", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
