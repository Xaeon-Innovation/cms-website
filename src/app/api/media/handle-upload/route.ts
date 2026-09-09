import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import {
  contentTypeForPath,
  isAllowedVideoPath,
  MAX_VIDEO_SIZE_BYTES,
} from "@/lib/media/paths";
import {
  getMediaUploadUrl,
  mintMediaToken,
  publicMediaUrl,
} from "@/lib/media/vpsSign";

export const runtime = "nodejs";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return getAdminAuth().verifyIdToken(match[1]);
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await requireAdmin(request);
    if (!decoded) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const pathname = typeof body?.pathname === "string" ? body.pathname : "";

    if (!isAllowedVideoPath(pathname)) {
      return Response.json(
        {
          error:
            "Invalid upload path. Media uploads must use videos/home/*.mp4 or videos/home/*.webm.",
        },
        { status: 400 }
      );
    }

    const token = mintMediaToken("PUT", pathname);
    const contentType =
      typeof body?.contentType === "string" && body.contentType
        ? body.contentType
        : contentTypeForPath(pathname);

    return Response.json({
      token,
      pathname,
      uploadUrl: getMediaUploadUrl(),
      publicUrl: publicMediaUrl(pathname),
      contentType,
      maxBytes: MAX_VIDEO_SIZE_BYTES,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to prepare upload";
    const status = message.includes("not configured") ? 500 : 500;
    return Response.json({ error: message }, { status });
  }
}
