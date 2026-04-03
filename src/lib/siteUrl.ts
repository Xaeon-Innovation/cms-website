/**
 * Canonical site origin for metadata, JSON-LD, sitemap, and OG URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (no trailing slash), e.g. https://www.creativemultisolutions.com
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim();
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "https://www.creativemultisolutions.com";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
