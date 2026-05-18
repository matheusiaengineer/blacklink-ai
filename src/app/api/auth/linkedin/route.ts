import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getLinkedInAuthUrl } from "@/lib/linkedin/oauth";

export async function GET() {
  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(getLinkedInAuthUrl(state));
  res.cookies.set("BLACKLINK_OAUTH_STATE", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10
  });
  return res;
}
