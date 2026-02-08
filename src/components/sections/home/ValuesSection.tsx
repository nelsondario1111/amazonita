import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeValuesSection, values } from "@/content/home";

export default function ValuesSection() {
  return (
    <Section id="nosotros">
      <SectionTitle
        eyebrow={homeValuesSection.eyebrow}
        title={homeValuesSection.title}
        subtitle={homeValuesSection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {values.map((item) => (
          <SoftCard key={item.title} radius="2xl" lift className="p-6">
            <div className="text-lg font-semibold">{item.title}</div>
            <p className="mt-2 text-sm text-black/70">{item.description}</p>
          </SoftCard>
        ))}
      </div>
    </Section>
  );
}
