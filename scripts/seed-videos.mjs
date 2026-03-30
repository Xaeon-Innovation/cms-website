import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { put } from "@vercel/blob";

const videos = [
  {
    key: "NEXT_PUBLIC_VIDEO_HERO_URL",
    local: "public/assets/videos/13820343_3840_2160_30fps.mp4",
    blobPath: "videos/hero.mp4",
    contentType: "video/mp4",
  },
  {
    key: "NEXT_PUBLIC_VIDEO_MEDICAL_MARKETING_URL",
    local: "public/assets/videos/Gold_particles_converging_202603292000.mp4",
    blobPath: "videos/medical-marketing.mp4",
    contentType: "video/mp4",
  },
  {
    key: "NEXT_PUBLIC_VIDEO_DIGITAL_MARKETING_URL",
    local: "public/assets/videos/Luminous_point_emitting_202603292002.mp4",
    blobPath: "videos/digital-marketing.mp4",
    contentType: "video/mp4",
  },
  {
    key: "NEXT_PUBLIC_VIDEO_EVENTS_ORGANISING_URL",
    local: "public/assets/videos/Lines_forming_architectural_202603292002.mp4",
    blobPath: "videos/events-organising.mp4",
    contentType: "video/mp4",
  },
];

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = path.resolve(__dirname, "..");

  const results = [];

  for (const v of videos) {
    const abs = path.join(root, v.local);
    if (!fs.existsSync(abs)) {
      throw new Error(`Missing file: ${abs}`);
    }

    const buf = fs.readFileSync(abs);
    console.log(`Uploading ${v.local} (${buf.length} bytes) -> ${v.blobPath}`);

    const blob = await put(v.blobPath, buf, {
      access: "public",
      contentType: v.contentType,
      addRandomSuffix: false,
    });

    results.push({ key: v.key, url: blob.url });
  }

  console.log("\nSet these in Vercel Environment Variables (Production + Preview):\n");
  for (const r of results) {
    console.log(`${r.key}=${r.url}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

