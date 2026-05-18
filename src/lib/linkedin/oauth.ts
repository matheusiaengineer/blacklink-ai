/**
 * LinkedIn OAuth 2.0 helpers.
 * Stub implementation: wire up to /api/auth/linkedin and /api/auth/linkedin/callback.
 */

const AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

const SCOPES = ["openid", "profile", "email", "w_member_social"];

export function getLinkedInAuthUrl(state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? "",
    scope: SCOPES.join(" "),
    state
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeLinkedInCode(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? "",
    client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
    client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? ""
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!res.ok) throw new Error(`LinkedIn token exchange failed: ${res.status}`);
  return (await res.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
  };
}
