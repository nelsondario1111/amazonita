import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeMissionVisionSection } from "@/content/home";
import { site } from "@/content/site";

export default function MissionVisionSection() {
  return (
    <Section>
      <SectionTitle
        eyebrow={homeMissionVisionSection.eyebrow}
        title={homeMissionVisionSection.title}
        subtitle={homeMissionVisionSection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <SoftCard lift className="p-7">
          <h3 className="text-2xl font-semibold">Misión</h3>
          <p className="mt-3 text-black/70">{site.mission}</p>
        </SoftCard>

        <SoftCard lift className="p-7">
          <h3 className="text-2xl font-semibold">Visión</h3>
          <p className="mt-3 text-black/70">{site.vision}</p>
        </SoftCard>
      </div>
    </Section>
  );
}
