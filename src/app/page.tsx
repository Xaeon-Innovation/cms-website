import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdentitySection } from "@/components/sections/IdentitySection";
import { ServicesPreviewSection } from "@/components/sections/ServicesPreviewSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { MobadraBannerSection } from "@/components/sections/MobadraBannerSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTAFooterBanner } from "@/components/sections/CTAFooterBanner";

export const metadata: Metadata = {
  title: "Medical Marketing & Patient Growth in Dubai",
  description:
    "UAE-focused medical marketing agency: digital marketing, B2B healthcare growth, and Creative Mobadra — free patient perks with leading hospital partners across the Emirates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Medical Marketing & Patient Growth in Dubai | Creative Multi Solutions",
    description:
      "Grow your hospital or clinic in the UAE with proven medical marketing, digital campaigns, and the Creative Mobadra patient program.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <IdentitySection />
      <ServicesPreviewSection />
      <ClientsSection />
      <MobadraBannerSection />
      <ApproachSection />
      <StatsSection />
      <CTAFooterBanner />
    </>
  );
}
