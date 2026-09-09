import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { isAllowedEmployeeImagePath, isSafePathname } from "@/lib/media/paths";
import { getMediaDeleteUrl, mintMediaToken } from "@/lib/media/vpsSign";

export const runtime = "nodejs";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return getAdminAuth().verifyIdToken(match[1]);
}

function pathnameFromInput(urlOrPathname: string) {
  if (!urlOrPathname.includes("://")) {
    return urlOrPathname.replace(/^\//, "");
  }
  try {
    const u = new URL(urlOrPathname);
    return u.pathname.replace(/^\//, "");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await requireAdmin(req);
    if (!decoded) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const raw = body?.urlOrPathname ?? body?.pathname ?? body?.url;
    if (!raw || typeof raw !== "string") {
      return Response.json({ error: "Missing urlOrPathname" }, { status: 400 });
    }

    const pathname = pathnameFromInput(raw);
    if (!isSafePathname(pathname) || !isAllowedEmployeeImagePath(pathname)) {
      return Response.json({ error: "Invalid pathname" }, { status: 400 });
    }

    const token = mintMediaToken("DELETE", pathname);
    const deleteUrl = new URL(getMediaDeleteUrl());
    deleteUrl.searchParams.set("pathname", pathname);

    const delRes = await fetch(deleteUrl.toString(), {
      method: "DELETE",
      headers: {
        "X-Media-Token": token,
        "X-Media-Pathname": pathname,
      },
    });

    if (!delRes.ok) {
      const payload = await delRes.json().catch(() => ({}));
      return Response.json(
        {
          error:
            (payload as { error?: string })?.error ||
            `VPS delete failed (${delRes.status})`,
        },
        { status: delRes.status }
      );
    }

    return Response.json({ ok: true, pathname });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Delete failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
