import type { ReactNode } from "react";
import type { Review } from "@/lib/firestore/reviews";
import { getApprovedReviewsForSeo } from "@/lib/firestore/reviews-server";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.creativemultisolutions.com");

function reviewsJsonLd(reviews: Review[]) {
  const items = reviews.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.text,
      itemReviewed: {
        "@type": "Organization",
        name: "Creative Multi Solutions",
        url: SITE,
      },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Client and patient reviews",
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export default async function ReviewsLayout({ children }: { children: ReactNode }) {
  let payload: Record<string, unknown> | null = null;
  try {
    const list = await getApprovedReviewsForSeo(40);
    if (list.length > 0) payload = reviewsJsonLd(list);
  } catch {
    // Missing admin credentials in dev, or index missing — skip JSON-LD
  }

  return (
    <>
      {payload ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
      ) : null}
      {children}
    </>
  );
}
