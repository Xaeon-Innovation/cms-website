import { put } from "@vercel/blob";
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1];
  const adminAuth = getAdminAuth();
  const decoded = await adminAuth.verifyIdToken(token);
  return decoded;
}

function extFromType(type: string) {
  const t = (type || "").toLowerCase();
  if (t === "video/mp4") return "mp4";
  if (t === "video/webm") return "webm";
  return "bin";
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await requireAdmin(req);
    if (!decoded) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    const slot = String(formData.get("slot") || "video");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return Response.json({ error: "Only video uploads are supported" }, { status: 400 });
    }

    // Allow large files; Vercel Blob supports multipart uploads server-side.
    const ext = extFromType(file.type);
    const pathname = `videos/home/${Date.now()}-${slot}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
      multipart: true,
    });

    return Response.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: file.size,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}

