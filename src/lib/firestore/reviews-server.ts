import { getAdminDb } from "@/lib/firebaseAdmin";
import type { Review } from "@/lib/firestore/reviews";

/** Approved reviews for SEO JSON-LD (server only). */
export async function getApprovedReviewsForSeo(limit = 50): Promise<Review[]> {
  const db = getAdminDb();
  const snap = await db
    .collection("reviews")
    .where("status", "==", "approved")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Review, "id">),
  }));
}
