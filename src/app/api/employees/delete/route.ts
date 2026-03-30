import { del } from "@vercel/blob";
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

export async function POST(req: NextRequest) {
  try {
    const decoded = await requireAdmin(req);
    if (!decoded) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const urlOrPathname = body?.urlOrPathname ?? body?.pathname ?? body?.url;

    if (!urlOrPathname || typeof urlOrPathname !== "string") {
      return Response.json({ error: "Missing urlOrPathname" }, { status: 400 });
    }

    await del(urlOrPathname);
    return Response.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err?.message || "Delete failed" }, { status: 500 });
  }
}

