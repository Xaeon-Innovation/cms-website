import { put } from "@vercel/blob";
import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

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
  return "bin";
}

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1];
  const adminAuth = getAdminAuth();
  const decoded = await adminAuth.verifyIdToken(token);
  return decoded;
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await requireAdmin(req);
    if (!decoded) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const department = String(formData.get("department") || "general");
    const name = String(formData.get("name") || "employee");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Only image uploads are supported" }, { status: 400 });
    }

    // 5MB soft limit
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: "Image too large (max 5MB)" }, { status: 400 });
    }

    const safeDepartment = slugify(department) || "general";
    const safeName = slugify(name) || "employee";
    const ext = extFromType(file.type);
    const pathname = `employees/${safeDepartment}/${Date.now()}-${safeName}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return Response.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: blob.size,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}

