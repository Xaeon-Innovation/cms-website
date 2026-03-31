import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["video/mp4", "video/webm"] as const;
const ALLOWED_EXTENSIONS = [".mp4", ".webm"] as const;
const PATHNAME_PREFIX = "videos/home/";

function isAllowedPathname(pathname: string) {
  return pathname.startsWith(PATHNAME_PREFIX) && ALLOWED_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Failed to prepare upload";
}

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      {
        error:
          "Blob uploads are not configured on the server. Add BLOB_READ_WRITE_TOKEN to this Vercel environment.",
      },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getAdminAuth().verifyIdToken(match[1]);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  if (body.type === "blob.generate-client-token") {
    const pathname = body.payload.pathname;
    if (!pathname || !isAllowedPathname(pathname)) {
      return Response.json(
        {
          error: "Invalid upload path. Media uploads must use videos/home/*.mp4 or videos/home/*.webm.",
        },
        { status: 400 }
      );
    }
  }

  try {
    const result = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      request,
      body,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [...ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: MAX_VIDEO_SIZE_BYTES,
        };
      },
    });

    if (result.type === "blob.generate-client-token") {
      return Response.json({ clientToken: result.clientToken });
    }

    if (result.type === "blob.upload-completed") {
      return Response.json({ response: "ok" });
    }
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 400 });
  }

  return Response.json({ error: "Unsupported" }, { status: 400 });
}
