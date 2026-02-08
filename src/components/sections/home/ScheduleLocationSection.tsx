import Button from "@/components/Button";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import SoftCard from "@/components/ui/SoftCard";
import { homeScheduleLocationSection } from "@/content/home";

export default function ScheduleLocationSection() {
  return (
    <Section id={homeScheduleLocationSection.id}>
      <SectionTitle
        eyebrow={homeScheduleLocationSection.eyebrow}
        title={homeScheduleLocationSection.title}
        subtitle={homeScheduleLocationSection.subtitle}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <SoftCard className="p-7">
          <h3 className="text-lg font-semibold">{homeScheduleLocationSection.locationLabel}</h3>
          <p className="mt-3 text-black/70">{homeScheduleLocationSection.locationText}</p>
          <Button
            href={homeScheduleLocationSection.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            ariaLabel="Abrir ubicación en Google Maps"
            className="mt-5"
          >
            {homeScheduleLocationSection.mapLabel}
          </Button>
        </SoftCard>

        <SoftCard className="p-7">
          <h3 className="text-lg font-semibold">{homeScheduleLocationSection.scheduleLabel}</h3>
          <div className="mt-3 space-y-3">
            {homeScheduleLocationSection.hours.map((item) => (
              <div key={`${item.day}-${item.hours}`} className="flex items-start justify-between gap-4">
                <p className="text-black/70">{item.day}</p>
                <p className="font-medium text-black/80">{item.hours}</p>
              </div>
            ))}
          </div>
        </SoftCard>
      </div>
    </Section>
  );
}
