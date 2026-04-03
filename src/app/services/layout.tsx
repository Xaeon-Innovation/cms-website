import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Medical & Digital Marketing Services",
  description:
    "Medical marketing, digital marketing, events, and consultancy for UAE hospitals and clinics — built for B2B growth, brand authority, and patient acquisition.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Healthcare Marketing Services UAE | Creative Multi Solutions",
    description:
      "Full-funnel medical and digital marketing for Dubai and the Emirates: acquisition, events, and strategic consultancy.",
    url: "/services",
  },
};

const SERVICES = [
  {
    name: "Medical Marketing Services",
    description:
      "Marketing for hospitals, specialized clinics, and medical centers focused on practical growth and patient pipelines.",
  },
  {
    name: "Digital Marketing",
    description:
      "Digital strategies to expand reach, strengthen your brand, and convert attention into loyal patients.",
  },
  {
    name: "Events Organizing & Managing",
    description:
      "End-to-end event management from concept through production and post-event media.",
  },
  {
    name: "Consultancy",
    description:
      "Strategic guidance to improve team performance, operations, and standards of care communication.",
  },
] as const;

function servicesJsonLd(site: string) {
  const provider = {
    "@type": "Organization" as const,
    name: "Creative Multi Solutions",
    url: site,
  };
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Creative Multi Solutions marketing services",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        provider,
        areaServed: "United Arab Emirates",
      },
    })),
  };
}

export default function ServicesLayout({ children }: { children: ReactNode }) {
  const site = getSiteUrl();
  const payload = servicesJsonLd(site);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
      />
      {children}
    </>
  );
}
