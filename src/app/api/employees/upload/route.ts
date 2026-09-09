import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import {
  contentTypeForPath,
  isAllowedEmployeeImagePath,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/media/paths";
import {
  getMediaUploadUrl,
  mintMediaToken,
  publicMediaUrl,
} from "@/lib/media/vpsSign";

export const runtime = "nodejs";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extFromType(type: string) {
  const t = (type || "").toLowerCase();
  if (t === "image/png") return "png";
  if (t === "image/jpeg") return "jpg";
  if (t === "image/webp") return "webp";
  return null;
}

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return getAdminAuth().verifyIdToken(match[1]);
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await requireAdmin(req);
    if (!decoded) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const name = String(body?.name || "employee");
    const department = String(body?.department || "general");
    const contentType = String(body?.contentType || "");
    const ext = extFromType(contentType);

    if (!ext) {
      return Response.json(
        { error: "Only PNG, JPEG, and WebP images are supported" },
        { status: 400 }
      );
    }

    let pathname =
      typeof body?.pathname === "string" && body.pathname.trim()
        ? body.pathname.trim()
        : "";

    if (!pathname) {
      const safeDepartment = slugify(department) || "general";
      const safeName = slugify(name) || "employee";
      pathname = `employees/${safeDepartment}/${Date.now()}-${safeName}.${ext}`;
    }

    if (!isAllowedEmployeeImagePath(pathname)) {
      return Response.json({ error: "Invalid employee image path" }, { status: 400 });
    }

    const token = mintMediaToken("PUT", pathname);

    return Response.json({
      token,
      pathname,
      uploadUrl: getMediaUploadUrl(),
      publicUrl: publicMediaUrl(pathname),
      contentType: contentType || contentTypeForPath(pathname),
      maxBytes: MAX_IMAGE_SIZE_BYTES,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
