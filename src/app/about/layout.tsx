import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Creative Multi Solutions — a Dubai medical marketing agency trusted by UAE healthcare organizations. We combine digital marketing, B2B partnerships, and patient-focused programs.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Creative Multi Solutions | Dubai Medical Marketing",
    description:
      "Our team helps UAE hospitals and clinics grow through medical marketing, digital strategy, and initiatives like Creative Mobadra.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
