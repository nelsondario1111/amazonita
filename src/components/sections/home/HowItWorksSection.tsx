import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeHowItWorksSection } from "@/content/home";

export default function HowItWorksSection() {
  return (
    <Section id={homeHowItWorksSection.id}>
      <SectionTitle
        eyebrow={homeHowItWorksSection.eyebrow}
        title={homeHowItWorksSection.title}
        subtitle={homeHowItWorksSection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {homeHowItWorksSection.steps.map((step) => (
          <SoftCard key={step.title} radius="2xl" lift className="p-6">
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-black/70">{step.description}</p>
          </SoftCard>
        ))}
      </div>
    </Section>
  );
}
