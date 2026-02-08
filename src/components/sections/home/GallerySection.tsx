import ImageGrid from "@/components/ImageGrid";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { gallery, homeGallerySection } from "@/content/home";

export default function GallerySection() {
  return (
    <Section
      id="galeria"
      overflowHidden
      orbs={[
        { className: "-left-28 bottom-8 h-64 w-64 bg-amazonita-turquoise/20" },
        { className: "-right-20 top-10 h-52 w-52 bg-amazonita-gold/35", delayMs: 900 },
      ]}
    >
      <SectionTitle
        eyebrow={homeGallerySection.eyebrow}
        title={homeGallerySection.title}
        subtitle={homeGallerySection.subtitle}
      />

      <ImageGrid className="mt-8" items={gallery} />
    </Section>
  );
}
