import { createHmac } from "node:crypto";

const DEFAULT_TTL_MS = 10 * 60 * 1000;

export function getMediaUploadSecret() {
  const secret = process.env.MEDIA_UPLOAD_SECRET;
  if (!secret) {
    throw new Error("MEDIA_UPLOAD_SECRET is not configured");
  }
  return secret;
}

export function getMediaBaseUrl() {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_MEDIA_BASE_URL is not configured");
  }
  return base;
}

export function getMediaUploadUrl() {
  return (
    process.env.MEDIA_UPLOAD_URL?.replace(/\/$/, "") ||
    `${getMediaBaseUrl()}/upload`
  );
}

export function getMediaDeleteUrl() {
  return (
    process.env.MEDIA_DELETE_URL?.replace(/\/$/, "") ||
    `${getMediaBaseUrl()}/files`
  );
}

export function publicMediaUrl(pathname: string) {
  return `${getMediaBaseUrl()}/${pathname.replace(/^\//, "")}`;
}

function sign(secret: string, method: string, pathname: string, exp: number) {
  return createHmac("sha256", secret)
    .update(`${method}\n${pathname}\n${exp}`)
    .digest("base64url");
}

export function mintMediaToken(
  method: "PUT" | "DELETE",
  pathname: string,
  ttlMs = DEFAULT_TTL_MS
) {
  const secret = getMediaUploadSecret();
  const exp = Date.now() + ttlMs;
  const sig = sign(secret, method, pathname, exp);
  return `${exp}.${sig}`;
}
