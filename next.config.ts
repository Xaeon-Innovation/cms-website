import type { NextConfig } from "next";

function mediaRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;

  if (base) {
    try {
      const url = new URL(base);
      patterns.push({
        protocol: url.protocol === "http:" ? "http" : "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/**",
      });
    } catch {
      // ignore invalid URL
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: mediaRemotePatterns(),
  },
};

export default nextConfig;
