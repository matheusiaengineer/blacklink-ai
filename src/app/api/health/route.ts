import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    service: "BLACKLINK AI",
    checks: {
      api: "ok",
      environment: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
    },
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
