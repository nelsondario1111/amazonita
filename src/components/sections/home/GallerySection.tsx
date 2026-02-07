import Image from "next/image";
import ParallaxLayer from "@/components/ParallaxLayer";
import Orb from "@/components/ui/Orb";
import SectionTitle from "@/components/ui/SectionTitle";
import { gallery, homeGallerySection } from "@/content/home";

export default function GallerySection() {
  return (
    <section id="galeria" className="relative overflow-hidden py-14 scroll-mt-24">
      <Orb className="-left-28 bottom-8 h-64 w-64 bg-amazonita-turquoise/20" />
      <Orb className="-right-20 top-10 h-52 w-52 bg-amazonita-gold/35" delayMs={900} />

      <SectionTitle
        eyebrow={homeGallerySection.eyebrow}
        title={homeGallerySection.title}
        subtitle={homeGallerySection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {gallery.map((item) => (
          <ParallaxLayer key={item.src} speed={item.parallaxSpeed}>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05] md:group-hover:scale-110 md:group-hover:rotate-[1.2deg]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-55" />
            </div>
          </ParallaxLayer>
        ))}
      </div>
    </section>
  );
}
