/**
 * Optional: posts an approved review to a Facebook Page via Graph API.
 * The main site flow uses clipboard + public review links instead (no tokens).
 * Keep this route only if you call it from a custom integration; env:
 * FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN.
 */
import { NextRequest } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import type { Review } from "@/lib/firestore/reviews";

export const runtime = "nodejs";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1];
  const adminAuth = getAdminAuth();
  const decoded = await adminAuth.verifyIdToken(token);
  const db = getAdminDb();
  const adminSnap = await db.collection("admins").doc(decoded.uid).get();
  if (!adminSnap.exists) return null;
  return decoded;
}

function buildFacebookMessage(review: Review): string {
  const stars = "★".repeat(Math.min(5, Math.max(1, review.rating)));
  const typeLabel =
    review.type === "clinic" ? "Clinic" : review.type === "mobadra" ? "Mobadra" : "Patient";
  const quote = review.text.trim().replace(/\s+/g, " ");
  const maxQuote = 1800;
  const clipped = quote.length > maxQuote ? `${quote.slice(0, maxQuote)}…` : quote;
  return `${stars} (${review.rating}/5) · ${review.name} · ${typeLabel}\n\n"${clipped}"\n\n— Testimonial via Creative Multi Solutions`;
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await requireAdmin(req);
    if (!decoded) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const reviewId = typeof body?.reviewId === "string" ? body.reviewId : null;
    if (!reviewId) {
      return Response.json({ error: "Missing reviewId" }, { status: 400 });
    }

    const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
    const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
    if (!pageId || !pageToken) {
      return Response.json(
        {
          error: "Facebook not configured",
          hint: "Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN on the server.",
        },
        { status: 503 }
      );
    }

    const db = getAdminDb();
    const ref = db.collection("reviews").doc(reviewId);
    const snap = await ref.get();
    if (!snap.exists) {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }

    const review = { id: snap.id, ...snap.data() } as Review;
    if (review.status !== "approved") {
      return Response.json({ error: "Review must be approved before publishing" }, { status: 400 });
    }

    if (review.facebookPostId) {
      return Response.json({
        ok: true,
        skipped: true,
        reason: "already_published",
        facebookPostId: review.facebookPostId,
      });
    }

    const message = buildFacebookMessage(review);
    const url = new URL(`https://graph.facebook.com/v21.0/${pageId}/feed`);
    url.searchParams.set("access_token", pageToken);
    url.searchParams.set("message", message);

    const fbRes = await fetch(url.toString(), { method: "POST" });
    const fbJson = (await fbRes.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };

    if (!fbRes.ok || !fbJson.id) {
      const msg = fbJson.error?.message || fbRes.statusText || "Facebook API error";
      console.error("[publish-social] Facebook error", fbRes.status, fbJson);
      return Response.json({ error: msg }, { status: 502 });
    }

    await ref.update({
      facebookPostId: fbJson.id,
      facebookPublishedAt: new Date(),
    });

    return Response.json({ ok: true, facebookPostId: fbJson.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Publish failed";
    console.error("[publish-social]", err);
    return Response.json({ error: message }, { status: 500 });
  }
}
