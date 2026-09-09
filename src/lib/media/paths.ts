const VIDEO_EXT = [".mp4", ".webm"] as const;
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"] as const;

export const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function isSafePathname(pathname: string) {
  if (!pathname || typeof pathname !== "string") return false;
  if (pathname.includes("..") || pathname.startsWith("/") || pathname.includes("\\")) {
    return false;
  }
  return true;
}

export function isAllowedVideoPath(pathname: string) {
  if (!isSafePathname(pathname) || !pathname.startsWith("videos/home/")) return false;
  return VIDEO_EXT.some((ext) => pathname.toLowerCase().endsWith(ext));
}

export function isAllowedEmployeeImagePath(pathname: string) {
  if (!isSafePathname(pathname) || !pathname.startsWith("employees/")) return false;
  const parts = pathname.split("/");
  if (parts.length < 3) return false;
  return IMAGE_EXT.some((ext) => pathname.toLowerCase().endsWith(ext));
}

export function contentTypeForPath(pathname: string) {
  const lower = pathname.toLowerCase();
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}
