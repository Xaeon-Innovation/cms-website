import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Data Collection Notice",
  description:
    "Summary of what data Creative Multi Solutions services collect and how it is used and shared.",
  alternates: { canonical: "/data-collection" },
  robots: { index: true, follow: true },
};

export default function DataCollectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

