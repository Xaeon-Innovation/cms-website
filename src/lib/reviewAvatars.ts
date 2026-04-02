/**
 * Allowed public paths for review profile pictures under `public/assets/pfp/`.
 * Uses `p1.png` … `p10.png` and `p13.png` … `p20.png` (no p11/p12 in this set).
 */
export const REVIEW_AVATAR_PATHS = [
  "/assets/pfp/p1.png",
  "/assets/pfp/p2.png",
  "/assets/pfp/p3.png",
  "/assets/pfp/p4.png",
  "/assets/pfp/p5.png",
  "/assets/pfp/p6.png",
  "/assets/pfp/p7.png",
  "/assets/pfp/p8.png",
  "/assets/pfp/p9.png",
  "/assets/pfp/p10.png",
  "/assets/pfp/p13.png",
  "/assets/pfp/p14.png",
  "/assets/pfp/p15.png",
  "/assets/pfp/p16.png",
  "/assets/pfp/p17.png",
  "/assets/pfp/p18.png",
  "/assets/pfp/p19.png",
  "/assets/pfp/p20.png",
] as const;

export type ReviewAvatarPath = (typeof REVIEW_AVATAR_PATHS)[number];

export const DEFAULT_REVIEW_AVATAR: ReviewAvatarPath = REVIEW_AVATAR_PATHS[0];

const allowedSet = new Set<string>(REVIEW_AVATAR_PATHS);

export function isAllowedReviewAvatar(url: string | undefined): url is ReviewAvatarPath {
  return typeof url === "string" && allowedSet.has(url);
}

/** Normalize older stored URLs (SVG placeholders, wrong filename patterns) to a valid path. */
function legacyToAllowedPath(url: string): ReviewAvatarPath | null {
  const pNamed = url.match(/^\/assets\/pfp\/p(\d+)\.png$/i);
  if (pNamed) {
    const candidate = `/assets/pfp/p${pNamed[1]}.png`;
    if (allowedSet.has(candidate)) return candidate as ReviewAvatarPath;
  }
  const oldSvg = url.match(/^\/assets\/pfp\/(\d+)\.svg$/i);
  if (oldSvg) {
    const n = parseInt(oldSvg[1], 10);
    const candidate = `/assets/pfp/p${n}.png`;
    if (allowedSet.has(candidate)) return candidate as ReviewAvatarPath;
  }
  const oldFlatPng = url.match(/^\/assets\/pfp\/(\d+)\.png$/i);
  if (oldFlatPng) {
    const n = parseInt(oldFlatPng[1], 10);
    const candidate = `/assets/pfp/p${n}.png`;
    if (allowedSet.has(candidate)) return candidate as ReviewAvatarPath;
  }
  return null;
}

export function reviewAvatarSrc(url: string | undefined): ReviewAvatarPath {
  if (isAllowedReviewAvatar(url)) return url;
  if (typeof url === "string") {
    const mapped = legacyToAllowedPath(url);
    if (mapped) return mapped;
  }
  return DEFAULT_REVIEW_AVATAR;
}
