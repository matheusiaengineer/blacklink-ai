/**
 * BLACKLINK AI — Nova Memory System
 *
 * Stores a compact user profile that Nova reads on every conversation turn.
 * In production, persist this in Supabase `user_memory` table.
 * Here we provide the schema, serializer and a Supabase-ready upsert stub.
 */

export type UserMemory = {
  userId: string;
  /** e.g. "AI Engineer", "Founder", "Designer" */
  role: string;
  /** e.g. "Generative AI", "SaaS", "Web3" */
  niche: string;
  /** ISO language code */
  language: string;
  /** "authority" | "story" | "viral" | "hiring" | "networking" */
  preferredTone: string;
  /** Short summary of writing style learned from past posts */
  styleNotes: string;
  /** Comma-separated top hashtags the user performs well with */
  topHashtags: string;
  /** Recruiter keywords extracted from profile */
  recruiterKeywords: string;
  updatedAt: string; // ISO date
};

export const DEFAULT_MEMORY: Omit<UserMemory, "userId" | "updatedAt"> = {
  role: "",
  niche: "",
  language: "en",
  preferredTone: "authority",
  styleNotes: "",
  topHashtags: "",
  recruiterKeywords: ""
};

/** Serialize memory into a compact system-prompt injection. */
export function memoryToContext(m: UserMemory): string {
  const parts: string[] = [];
  if (m.role) parts.push(`Role: ${m.role}`);
  if (m.niche) parts.push(`Niche: ${m.niche}`);
  if (m.preferredTone) parts.push(`Preferred tone: ${m.preferredTone}`);
  if (m.styleNotes) parts.push(`Writing style: ${m.styleNotes}`);
  if (m.topHashtags) parts.push(`Top hashtags: ${m.topHashtags}`);
  if (m.recruiterKeywords) parts.push(`Recruiter keywords: ${m.recruiterKeywords}`);
  return parts.length ? `USER CONTEXT:\n${parts.join("\n")}` : "";
}

/**
 * Update memory from a new post or conversation turn.
 * Call this after every successful post generation to keep Nova sharp.
 */
export function patchMemory(
  current: UserMemory,
  patch: Partial<Omit<UserMemory, "userId" | "updatedAt">>
): UserMemory {
  return {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString()
  };
}

// ── Supabase stub ────────────────────────────────────────────────────────────
// Uncomment and wire to your Supabase client when ready:
//
// import { createSupabaseServerClient } from "@/lib/supabase/server";
//
// export async function loadMemory(userId: string): Promise<UserMemory | null> {
//   const sb = createSupabaseServerClient();
//   const { data } = await sb
//     .from("user_memory")
//     .select("*")
//     .eq("user_id", userId)
//     .single();
//   return data ?? null;
// }
//
// export async function saveMemory(memory: UserMemory): Promise<void> {
//   const sb = createSupabaseServerClient();
//   await sb.from("user_memory").upsert({
//     user_id: memory.userId,
//     role: memory.role,
//     niche: memory.niche,
//     language: memory.language,
//     preferred_tone: memory.preferredTone,
//     style_notes: memory.styleNotes,
//     top_hashtags: memory.topHashtags,
//     recruiter_keywords: memory.recruiterKeywords,
//     updated_at: memory.updatedAt
//   });
// }
