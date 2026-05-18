/**
 * AES-GCM encryption helper for sensitive tokens (LinkedIn access/refresh tokens).
 * Stores `iv|ciphertext` as base64.
 *
 * Key is derived from `JWT_SECRET` via SHA-256, so a 32-byte AES key falls out
 * for free without requiring a separate env var. Rotate by setting
 * `BLACKLINK_ENCRYPTION_KEY` to override.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

async function aesKey(): Promise<CryptoKey> {
  const raw =
    process.env.BLACKLINK_ENCRYPTION_KEY ?? process.env.JWT_SECRET ?? "";
  if (!raw) throw new Error("Encryption key missing");
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(raw));
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt"
  ]);
}

function toB64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encryptToken(plain: string): Promise<string> {
  const key = await aesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain))
  );
  const merged = new Uint8Array(iv.length + ct.length);
  merged.set(iv, 0);
  merged.set(ct, iv.length);
  return toB64(merged);
}

export async function decryptToken(payload: string): Promise<string> {
  const key = await aesKey();
  const merged = fromB64(payload);
  const iv = merged.slice(0, 12);
  const ct = merged.slice(12);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return dec.decode(plain);
}
