/**
 * Lightweight HS256 JWT using Web Crypto. Zero external dependencies,
 * works on Node 18+ and Edge runtimes.
 *
 * Use it to sign short-lived session tokens. Store the cookie httpOnly + secure.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64url(input: string): Uint8Array {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export type JwtPayload = {
  sub: string;
  email?: string;
  plan?: "free" | "pro" | "enterprise";
  exp?: number; // seconds since epoch
  [key: string]: unknown;
};

export async function signJwt(
  payload: JwtPayload,
  secret = process.env.JWT_SECRET ?? "",
  ttlSeconds = 60 * 60 * 24 * 7
): Promise<string> {
  if (!secret) throw new Error("JWT_SECRET missing");
  const exp = payload.exp ?? Math.floor(Date.now() / 1000) + ttlSeconds;
  const header = { alg: "HS256", typ: "JWT" };
  const encHeader = base64url(enc.encode(JSON.stringify(header)));
  const encPayload = base64url(enc.encode(JSON.stringify({ ...payload, exp })));
  const data = `${encHeader}.${encPayload}`;
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
  return `${data}.${base64url(sig)}`;
}

export async function verifyJwt(
  token: string,
  secret = process.env.JWT_SECRET ?? ""
): Promise<JwtPayload | null> {
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const key = await hmacKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64url(s),
    enc.encode(`${h}.${p}`)
  );
  if (!ok) return null;
  const payload = JSON.parse(dec.decode(fromBase64url(p))) as JwtPayload;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
