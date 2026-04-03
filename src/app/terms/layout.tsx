import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of the Creative Multi Solutions website and marketing content. UAE-based medical marketing agency.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
