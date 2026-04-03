import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSiteUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Creative Mobadra — Patient Perks Program",
  description:
    "Creative Mobadra: complimentary benefits for patients at partnered top-tier UAE hospitals. Exclusive perks, coordinated by Creative Multi Solutions for the Emirates healthcare community.",
  alternates: { canonical: "/mobadra" },
  openGraph: {
    title: "Creative Mobadra | Patient Program UAE Hospitals",
    description:
      "Free patient-focused perks through Creative Mobadra — for patients of select leading hospital partners across the UAE.",
    url: "/mobadra",
  },
};

function mobadraJsonLd(site: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Creative Mobadra",
    description:
      "Complimentary patient benefits program for individuals receiving care through partnered leading hospitals in the United Arab Emirates, offered by Creative Multi Solutions.",
    provider: {
      "@type": "Organization",
      name: "Creative Multi Solutions",
      url: site,
    },
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
    serviceType: "Healthcare patient support program",
  };
}

export default function MobadraLayout({ children }: { children: ReactNode }) {
  const payload = mobadraJsonLd(getSiteUrl());
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
