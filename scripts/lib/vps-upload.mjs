import crypto from "node:crypto";
import fs from "node:fs";

export function mintMediaToken(secret, method, pathname, ttlMs = 10 * 60 * 1000) {
  const exp = Date.now() + ttlMs;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${method}\n${pathname}\n${exp}`)
    .digest("base64url");
  return `${exp}.${sig}`;
}

export async function uploadFileToVps({
  secret,
  uploadUrl,
  baseUrl,
  pathname,
  filePath,
  contentType,
}) {
  const buf = fs.readFileSync(filePath);
  const token = mintMediaToken(secret, "PUT", pathname);
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "X-Media-Token": token,
      "X-Media-Pathname": pathname,
    },
    body: buf,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error || `Upload failed (${res.status}) for ${pathname}`);
  }

  const publicUrl = `${baseUrl.replace(/\/$/, "")}/${pathname}`;
  return { pathname, url: publicUrl, size: buf.length };
}
