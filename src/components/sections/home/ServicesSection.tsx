import Button from "@/components/Button";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeServicesSection, services } from "@/content/home";
import { getWhatsAppLink } from "@/lib/site";

export default function ServicesSection() {
  return (
    <Section id="servicios">
      <SectionTitle
        eyebrow={homeServicesSection.eyebrow}
        title={homeServicesSection.title}
        subtitle={homeServicesSection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {services.map((item) => (
          <SoftCard key={item.id} lift className="p-7">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-black/70">{item.description}</p>

            <div className="mt-5 flex items-center gap-2 text-sm text-black/70">
              <span className="rounded-full bg-black/5 px-3 py-1">{item.duration}</span>
              <span className="rounded-full bg-black/5 px-3 py-1">{item.price}</span>
            </div>

            <div className="mt-5 h-px w-full bg-black/10" />
            <h4 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-black/60">
              Incluye
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-black/70">
              {item.includes.map((include) => (
                <li key={include}>• {include}</li>
              ))}
            </ul>

            <Button
              href={getWhatsAppLink(item.whatsappPrefill)}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel={`Reservar por WhatsApp - ${item.title} - La Amazonita`}
              className="mt-6 w-full"
            >
              {homeServicesSection.ctaLabel}
            </Button>
          </SoftCard>
        ))}
      </div>
    </Section>
  );
}
