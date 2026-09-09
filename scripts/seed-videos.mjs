import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { uploadFileToVps } from "./lib/vps-upload.mjs";

const videos = [
  {
    key: "NEXT_PUBLIC_VIDEO_HERO_URL",
    local: "public/assets/videos/13820343_3840_2160_30fps.mp4",
    pathname: "videos/home/hero.mp4",
    contentType: "video/mp4",
  },
  {
    key: "NEXT_PUBLIC_VIDEO_MEDICAL_MARKETING_URL",
    local: "public/assets/videos/Gold_particles_converging_202603292000.mp4",
    pathname: "videos/home/medical-marketing.mp4",
    contentType: "video/mp4",
  },
  {
    key: "NEXT_PUBLIC_VIDEO_DIGITAL_MARKETING_URL",
    local: "public/assets/videos/Luminous_point_emitting_202603292002.mp4",
    pathname: "videos/home/digital-marketing.mp4",
    contentType: "video/mp4",
  },
  {
    key: "NEXT_PUBLIC_VIDEO_EVENTS_ORGANISING_URL",
    local: "public/assets/videos/Lines_forming_architectural_202603292002.mp4",
    pathname: "videos/home/events-organising.mp4",
    contentType: "video/mp4",
  },
];

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = path.resolve(__dirname, "..");

  const secret = process.env.MEDIA_UPLOAD_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const uploadUrl =
    process.env.MEDIA_UPLOAD_URL ||
    (baseUrl ? `${baseUrl.replace(/\/$/, "")}/upload` : "");

  if (!secret || !baseUrl || !uploadUrl) {
    throw new Error(
      "Set MEDIA_UPLOAD_SECRET, NEXT_PUBLIC_MEDIA_BASE_URL (and optionally MEDIA_UPLOAD_URL) before seeding."
    );
  }

  const results = [];

  for (const v of videos) {
    const abs = path.join(root, v.local);
    if (!fs.existsSync(abs)) {
      throw new Error(`Missing file: ${abs}`);
    }

    console.log(`Uploading ${v.local} -> ${v.pathname}`);
    const uploaded = await uploadFileToVps({
      secret,
      uploadUrl,
      baseUrl,
      pathname: v.pathname,
      filePath: abs,
      contentType: v.contentType,
    });
    results.push({ key: v.key, url: uploaded.url });
  }

  console.log("\nSet these in Vercel Environment Variables (Production + Preview):\n");
  for (const r of results) {
    console.log(`${r.key}=${r.url}`);
  }
  console.log(
    "\nOr save the same URLs into Firestore settings/media.homeVideos via Admin → Media."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
