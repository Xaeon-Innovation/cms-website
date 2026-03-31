import { HeroSection } from "@/components/sections/HeroSection";
import { IdentitySection } from "@/components/sections/IdentitySection";
import { ServicesPreviewSection } from "@/components/sections/ServicesPreviewSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { MobadraBannerSection } from "@/components/sections/MobadraBannerSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTAFooterBanner } from "@/components/sections/CTAFooterBanner";

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
