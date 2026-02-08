import type { Metadata } from "next";
import MobileStickyCta from "@/components/MobileStickyCta";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection from "@/components/sections/home/ContactSection";
import GallerySection from "@/components/sections/home/GallerySection";
import HeroSection from "@/components/sections/home/HeroSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";
import MissionVisionSection from "@/components/sections/home/MissionVisionSection";
import ScheduleLocationSection from "@/components/sections/home/ScheduleLocationSection";
import ServicesSection from "@/components/sections/home/ServicesSection";
import ValuesSection from "@/components/sections/home/ValuesSection";
import { site } from "@/content/site";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.brandName} | Bienestar y Oráculo en Tarapoto`,
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.brandName} | Bienestar y Oráculo en Tarapoto`,
    description: site.description,
    url: siteConfig.siteUrl,
    siteName: site.brandName,
    locale: site.locale,
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 315,
        height: 310,
        alt: `Logo de ${site.brandName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brandName} | Bienestar y Oráculo en Tarapoto`,
    description: site.description,
    images: ["/logo.png"],
  },
};

export default function Page() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": site.businessType,
    name: site.brandName,
    description: site.description,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/logo.png`,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      ...site.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coordinates.latitude,
      longitude: site.coordinates.longitude,
    },
    openingHours: site.openingHours,
    areaServed: "Tarapoto",
    makesOffer: site.serviceNames.map((serviceName) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: serviceName,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <SiteHeader />
      <main id="inicio" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 md:pb-0">
        <HeroSection />
        <ValuesSection />
        <MissionVisionSection />
        <ServicesSection />
        <HowItWorksSection />
        <ScheduleLocationSection />
        <GallerySection />
        <ContactSection />
        <SiteFooter />
      </main>
      <MobileStickyCta />
    </>
  );
}
