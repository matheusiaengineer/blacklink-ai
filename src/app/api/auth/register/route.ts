import { NextResponse } from "next/server";
import { signJwt } from "@/lib/security/jwt";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

/**
 * POST /api/auth/register
 * Body: { email, password, username, country, language }
 *
 * In production: create user in Supabase Auth + insert into public.users.
 */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "auth:register"), { capacity: 3, refillPerSecond: 3 / 60 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  try {
    const body = (await req.json().catch(() => null)) as {
      email?: string;
      password?: string;
      username?: string;
      country?: string;
      language?: string;
    } | null;

    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const username = body?.username?.trim();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "email, password and username are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ── Supabase Auth stub ──────────────────────────────────────────────────
    // const sb = createSupabaseServerClient();
    // const { data, error } = await sb.auth.signUp({ email, password, options: { data: { username } } });
    // if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    // await sb.from("users").insert({ id: data.user!.id, email, username, language: body?.language ?? "en", country: body?.country });
    // ───────────────────────────────────────────────────────────────────────

    const userId = `user-${Date.now()}`;
    const plan = "free" as const;

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
