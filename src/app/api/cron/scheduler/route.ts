import { NextResponse } from "next/server";

/**
 * Scheduler tick endpoint.
 *
 * Wire this to a Vercel Cron (`vercel.json`) every minute, e.g.:
 *   { "crons": [{ "path": "/api/cron/scheduler", "schedule": "* * * * *" }] }
 *
 * The actual fetch/persist functions should hit Supabase. Stubbed here so the
 * project compiles before credentials are configured.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // const results = await runSchedulerTick({
  //   fetchDuePosts: () => supabase.from("posts").select(...),
  //   fetchRecentPosts: (userId) => supabase.from("posts").select(...).eq("user_id", userId),
  //   markPublished: (id, externalId) => supabase.from("posts").update(...).eq("id", id),
  //   markFailed: (id, reason) => supabase.from("posts").update(...).eq("id", id),
  // });

  return NextResponse.json({ ok: true, processed: 0 });
}
