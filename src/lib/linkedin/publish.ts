/**
 * LinkedIn publishing helper.
 *
 * Uses the modern REST endpoint:
 *   POST https://api.linkedin.com/rest/posts
 * Headers:
 *   Authorization: Bearer <access_token>
 *   LinkedIn-Version: 202405 (or current version date)
 *   X-Restli-Protocol-Version: 2.0.0
 *
 * NOTE: Posting requires the `w_member_social` scope and a verified app.
 */

export type LinkedInPostInput = {
  accessToken: string;
  authorUrn: string; // e.g. "urn:li:person:abcd1234"
  commentary: string;
  visibility?: "PUBLIC" | "CONNECTIONS";
};

export async function publishToLinkedIn({
  accessToken,
  authorUrn,
  commentary,
  visibility = "PUBLIC"
}: LinkedInPostInput) {
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202405",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      author: authorUrn,
      commentary,
      visibility,
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`LinkedIn publish failed: ${res.status} ${errorText}`);
  }

  return {
    postId: res.headers.get("x-restli-id") ?? null,
    status: res.status
  };
}
