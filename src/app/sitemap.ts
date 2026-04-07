import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

const PATHS = [
  "/",
  "/about",
  "/services",
  "/mobadra",
  "/reviews",
  "/contact",
  "/privacy",
  "/data-collection",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return PATHS.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
