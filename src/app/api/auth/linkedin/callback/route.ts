import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeLinkedInCode } from "@/lib/linkedin/oauth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const expected = cookies().get("BLACKLINK_OAUTH_STATE")?.value;
  if (!code || !state || !expected || state !== expected) {
    return NextResponse.redirect(new URL("/login?error=oauth_state", req.url));
  }

  try {
    const tokens = await exchangeLinkedInCode(code);
    // TODO: persist tokens in Supabase `linkedin_accounts` table for the current user.
    void tokens;
    return NextResponse.redirect(new URL("/dashboard?linkedin=connected", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_exchange", req.url));
  }
}
