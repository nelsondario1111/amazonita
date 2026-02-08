import Button from "@/components/Button";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeContactSection } from "@/content/home";
import { getWhatsAppLink, siteConfig } from "@/lib/site";

export default function ContactSection() {
  return (
    <Section id="contacto">
      <SoftCard className="p-10">
        <SectionTitle
          eyebrow={homeContactSection.eyebrow}
          title={homeContactSection.title}
          subtitle={homeContactSection.subtitle}
        />

        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            href={getWhatsAppLink("Hola, quiero consultar disponibilidad en La Amazonita.")}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Abrir WhatsApp - La Amazonita"
          >
            {homeContactSection.whatsappLabel}
          </Button>

          <Button
            href={`mailto:${siteConfig.email}`}
            variant="secondary"
            ariaLabel="Enviar email a La Amazonita"
          >
            {homeContactSection.emailLabel}
          </Button>

          <Button
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            ariaLabel="Abrir Instagram de La Amazonita"
          >
            {homeContactSection.instagramLabel}
          </Button>
        </div>

        <p className="mt-6 text-sm text-black/60">{homeContactSection.footnote}</p>
      </SoftCard>
    </Section>
  );
}
