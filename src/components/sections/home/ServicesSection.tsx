import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeServicesSection, services } from "@/content/home";

export default function ServicesSection() {
  return (
    <section id="servicios" className="py-14 scroll-mt-24">
      <SectionTitle
        eyebrow={homeServicesSection.eyebrow}
        title={homeServicesSection.title}
        subtitle={homeServicesSection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((item) => (
          <SoftCard key={item.title} lift className="p-7">
            <div className="text-xl font-semibold">{item.title}</div>
            <p className="mt-2 text-black/70">{item.description}</p>
            <div className="mt-6 h-px w-full bg-black/10" />
            <p className="mt-4 text-sm text-black/60">{homeServicesSection.note}</p>
          </SoftCard>
        ))}
      </div>
    </section>
  );
}
