import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeContactSection } from "@/content/home";
import { siteConfig } from "@/lib/site";

export default function ContactSection() {
  return (
    <section id="contacto" className="py-14 scroll-mt-24">
      <SoftCard className="p-10">
        <SectionTitle
          eyebrow={homeContactSection.eyebrow}
          title={homeContactSection.title}
          subtitle={homeContactSection.subtitle}
        />

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-amazonita-turquoise px-6 py-3 text-sm font-medium text-black shadow-[var(--shadow-soft)] hover:opacity-90"
          >
            {homeContactSection.whatsappLabel}
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-black hover:bg-black/[0.03]"
          >
            {homeContactSection.emailLabel}
          </a>
        </div>

        <p className="mt-6 text-sm text-black/60">{homeContactSection.footnote}</p>
      </SoftCard>
    </section>
  );
}
