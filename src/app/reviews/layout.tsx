import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Review } from "@/lib/firestore/reviews";
import { getApprovedReviewsForSeo } from "@/lib/firestore/reviews-server";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Reviews & Success Stories",
  description:
    "Read verified client and patient reviews of Creative Multi Solutions — medical marketing and digital growth for UAE healthcare providers.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Reviews | Creative Multi Solutions UAE",
    description:
      "Real feedback from clinics, hospitals, and patients on our Dubai-based medical marketing work.",
    url: "/reviews",
  },
};

function reviewsJsonLd(reviews: Review[], site: string) {
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
        url: site,
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
    if (list.length > 0) payload = reviewsJsonLd(list, getSiteUrl());
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
