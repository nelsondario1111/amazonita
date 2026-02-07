import Image from "next/image";
import ParallaxLayer from "@/components/ParallaxLayer";
import Orb from "@/components/ui/Orb";
import { homeHero } from "@/content/home";
import { site } from "@/content/site";
import { siteConfig } from "@/lib/site";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 scroll-mt-24">
      <Orb className="-left-20 top-8 h-44 w-44 bg-amazonita-gold/30" />
      <Orb className="-right-24 top-20 h-56 w-56 bg-amazonita-turquoise/25" delayMs={1200} />

      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-black/60">
            {homeHero.eyebrow}
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.05]">
            <span className="font-logo uppercase">{site.brandName}</span>
          </h1>
          <p className="mt-3 whitespace-nowrap text-5xl leading-[1.05] font-secondary text-amazonita-gold">
            {site.tagline}
          </p>

          <p className="mt-5 max-w-xl text-black/70">{homeHero.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amazonita-turquoise px-6 py-3 text-sm font-medium text-black shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              {homeHero.primaryCtaLabel}
            </a>
            <a
              href={homeHero.secondaryCtaHref}
              className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-black hover:bg-black/[0.03]"
            >
              {homeHero.secondaryCtaLabel}
            </a>
          </div>
        </div>

        <ParallaxLayer speed={0.1}>
          <div className="group relative overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={homeHero.imageSrc}
                alt={homeHero.imageAlt}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04] md:group-hover:scale-110 md:group-hover:rotate-[1deg]"
                priority
              />
            </div>
            <div className="absolute inset-0 ring-1 ring-black/5" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-amazonita-gold/15 opacity-80" />
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
