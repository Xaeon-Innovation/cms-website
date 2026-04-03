import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Creative Multi Solutions collects, uses, and protects personal information when you use our Dubai/UAE medical marketing website and forms.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
