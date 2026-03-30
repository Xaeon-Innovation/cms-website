import { handleUpload } from "@vercel/blob/client";
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

  const body = await request.json();

  const result = await handleUpload({
    request,
    body,
    onBeforeGenerateToken: async () => {
      return {
        allowedContentTypes: ["video/mp4", "video/webm"],
        maximumSizeInBytes: 500 * 1024 * 1024,
      };
    },
  });

  if (result.type === "blob.generate-client-token") {
    return Response.json({ clientToken: result.clientToken });
  }

  if (result.type === "blob.upload-completed") {
    return Response.json({ response: "ok" });
  }

  return Response.json({ error: "Unsupported" }, { status: 400 });
}
