import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection from "@/components/sections/home/ContactSection";
import GallerySection from "@/components/sections/home/GallerySection";
import HeroSection from "@/components/sections/home/HeroSection";
import MissionVisionSection from "@/components/sections/home/MissionVisionSection";
import ServicesSection from "@/components/sections/home/ServicesSection";
import ValuesSection from "@/components/sections/home/ValuesSection";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="inicio" className="mx-auto max-w-6xl scroll-mt-24 px-6">
        <HeroSection />
        <ValuesSection />
        <MissionVisionSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
        <SiteFooter />
      </main>
    </>
  );
}
