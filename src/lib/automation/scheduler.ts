/**
 * Cron-style scheduler runner.
 *
 * Designed to be invoked from a Vercel Cron, Supabase Edge Function or
 * a Node worker (every minute). Picks up posts whose scheduled_date is due,
 * validates them against `checkPost`, then publishes via LinkedIn.
 */

import { checkPost, type RecentPost } from "@/lib/automation/antiBan";
import { publishToLinkedIn } from "@/lib/linkedin/publish";

export type DuePost = {
  id: string;
  userId: string;
  authorUrn: string;
  accessToken: string;
  content: string;
  hashtags: string[];
  scheduledFor: Date;
};

export type SchedulerDeps = {
  fetchDuePosts: () => Promise<DuePost[]>;
  fetchRecentPosts: (userId: string) => Promise<RecentPost[]>;
  markPublished: (postId: string, externalId: string | null) => Promise<void>;
  markFailed: (postId: string, reason: string) => Promise<void>;
};

export async function runSchedulerTick(deps: SchedulerDeps, now = new Date()) {
  const due = await deps.fetchDuePosts();
  const results: Array<{ id: string; ok: boolean; reason?: string }> = [];

  for (const post of due) {
    const recent = await deps.fetchRecentPosts(post.userId);
    const verdict = checkPost(now, post.scheduledFor, recent, post.content, post.hashtags);
    if (!verdict.ok) {
      await deps.markFailed(post.id, verdict.reason);
      results.push({ id: post.id, ok: false, reason: verdict.reason });
      continue;
    }

    try {
      const { postId } = await publishToLinkedIn({
        accessToken: post.accessToken,
        authorUrn: post.authorUrn,
        commentary: `${post.content}\n\n${post.hashtags.map((h) => `#${h}`).join(" ")}`
      });
      await deps.markPublished(post.id, postId);
      results.push({ id: post.id, ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      await deps.markFailed(post.id, message);
      results.push({ id: post.id, ok: false, reason: message });
    }
  }

  return results;
}
