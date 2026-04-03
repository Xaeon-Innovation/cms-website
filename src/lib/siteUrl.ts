/**
 * Canonical site origin for metadata, JSON-LD, sitemap, and OG URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (no trailing slash), e.g. https://www.creativemultisolutions.com
 * Surrounding quotes are stripped (common .env copy-paste mistake).
 */

function normalizeOrigin(raw: string | undefined): string | null {
  if (raw == null || raw === "") return null;
  let s = raw.trim();
  // Strip repeated matching ASCII quote wrappers (common .env mistakes)
  while (s.length >= 2) {
    const a = s[0];
    const b = s[s.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) {
      s = s.slice(1, -1).trim();
      continue;
    }
    break;
  }
  s = s.replace(/\/$/, "");
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const fromEnv = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "").trim();
  if (vercel) {
    const v = normalizeOrigin(`https://${vercel}`);
    if (v) return v;
  }
  return "https://www.creativemultisolutions.com";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
