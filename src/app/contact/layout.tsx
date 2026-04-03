import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Creative Multi Solutions in Dubai for medical marketing, digital campaigns, B2B healthcare partnerships, or Creative Mobadra inquiries across the UAE.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Creative Multi Solutions",
    description:
      "Reach our team for UAE healthcare marketing, lead generation, and patient acquisition projects.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
