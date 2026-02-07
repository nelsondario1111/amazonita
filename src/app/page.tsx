import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/site";

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.25em] text-black/60">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? <p className="mt-3 text-black/70">{subtitle}</p> : null}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main id="inicio" className="mx-auto max-w-6xl scroll-mt-24 px-6">
        {/* HERO */}
        <section className="relative overflow-hidden py-14 scroll-mt-24">
          <div className="orb-drift pointer-events-none absolute -left-20 top-8 h-44 w-44 rounded-full bg-amazonita-gold/30 blur-3xl" />
          <div className="orb-drift pointer-events-none absolute -right-24 top-20 h-56 w-56 rounded-full bg-amazonita-turquoise/25 blur-3xl [animation-delay:1200ms]" />
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal variant="left" duration={980}>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/60">
                  Bienestar • Oráculo • Arte
                </p>
                <h1 className="mt-3 text-5xl font-semibold leading-[1.05]">
                  La Amazonita{" "}
                  <span className="text-amazonita-turquoise">·</span>{" "}
                  <span className="text-amazonita-gold">Artist of Life</span>
                </h1>

                <p className="mt-5 max-w-xl text-black/70">
                  Un espacio para reconectar: masajes, lecturas privadas,
                  pequeños talleres y regalos artesanales con intención.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={siteConfig.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-amazonita-turquoise px-6 py-3 text-sm font-medium text-black shadow-[var(--shadow-soft)] hover:opacity-90"
                  >
                    Reservar por WhatsApp
                  </a>
                  <a
                    href="#servicios"
                    className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-black hover:bg-black/[0.03]"
                  >
                    Ver servicios
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={120} duration={1100}>
              <div className="group relative overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]">
                {/* Replace with real hero image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/photos/hero.svg"
                    alt="La Amazonita"
                    fill
                    className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 group-hover:rotate-[1deg]"
                    priority
                  />
                </div>
                <div className="absolute inset-0 ring-1 ring-black/5" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-amazonita-gold/15 opacity-80" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-14 scroll-mt-24">
          <Reveal variant="up" duration={980}>
            <SectionTitle
              eyebrow="Valores"
              title="Sostenibilidad, Salud, Creatividad y Calidad"
              subtitle="La intención detrás de cada experiencia y cada pieza."
            />
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { t: "Sostenibilidad", d: "Con respeto por la naturaleza y los materiales." },
              { t: "Salud", d: "Bienestar físico, emocional y energético." },
              { t: "Creatividad", d: "Arte, símbolos y belleza con propósito." },
              { t: "Calidad", d: "Cuidado en cada detalle, con amor." },
            ].map((c, index) => (
              <Reveal
                key={c.t}
                variant={(["left", "up", "down", "right"] as const)[index % 4]}
                delay={index * 90}
                duration={950}
              >
                <div className="rounded-[var(--radius-2xl)] bg-white p-6 shadow-[var(--shadow-soft)] transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.01]">
                  <div className="text-lg font-semibold">{c.t}</div>
                  <p className="mt-2 text-sm text-black/70">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="servicios" className="py-14 scroll-mt-24">
          <Reveal variant="up" duration={980}>
            <SectionTitle
              eyebrow="Servicios"
              title="Experiencias para el cuerpo y el alma"
              subtitle="Podemos ajustar la lista exacta cuando subas los detalles y fotos."
            />
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Masajes", d: "Relajación, liberación y equilibrio." },
              { t: "Lecturas de Oráculo", d: "Claridad, guía y perspectiva." },
              { t: "Regalos Artesanales", d: "Piezas con intención y belleza." },
            ].map((s, index) => (
              <Reveal
                key={s.t}
                variant={(["left", "pop", "right"] as const)[index % 3]}
                delay={index * 110}
                duration={1000}
              >
                <div className="rounded-[var(--radius-3xl)] bg-white p-7 shadow-[var(--shadow-soft)] transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.01]">
                  <div className="text-xl font-semibold">{s.t}</div>
                  <p className="mt-2 text-black/70">{s.d}</p>
                  <div className="mt-6 h-px w-full bg-black/10" />
                  <p className="mt-4 text-sm text-black/60">
                    (Aquí podemos añadir precio, duración y botón “Reservar”.)
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeria" className="relative overflow-hidden py-14 scroll-mt-24">
          <div className="orb-drift pointer-events-none absolute -left-28 bottom-8 h-64 w-64 rounded-full bg-amazonita-turquoise/20 blur-3xl" />
          <div className="orb-drift pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full bg-amazonita-gold/35 blur-3xl [animation-delay:900ms]" />
          <Reveal variant="up" duration={980}>
            <SectionTitle
              eyebrow="Galería"
              title="Un vistazo al universo Amazonita"
              subtitle="Cuando subas más fotos, armamos una galería real con categorías."
            />
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { src: "/photos/g1.svg", alt: "Espacio de masaje preparado con luz cálida" },
              { src: "/photos/g2.svg", alt: "Lectura de oráculo con cartas y velas" },
              { src: "/photos/g3.svg", alt: "Regalo artesanal envuelto con detalles naturales" },
            ].map((item, index) => (
              <Reveal
                key={item.src}
                variant={(["left", "pop", "right"] as const)[index % 3]}
                delay={index * 120}
                duration={1050}
              >
                <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110 group-hover:rotate-[1.2deg]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-55" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contacto" className="py-14 scroll-mt-24">
          <Reveal variant="up" delay={20} duration={980}>
            <div className="rounded-[var(--radius-3xl)] bg-white p-10 shadow-[var(--shadow-soft)]">
              <SectionTitle
                eyebrow="Contacto"
                title="Reserva o pregunta por disponibilidad"
                subtitle="WhatsApp es lo más directo. También podemos agregar Instagram."
              />

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={siteConfig.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amazonita-turquoise px-6 py-3 text-sm font-medium text-black shadow-[var(--shadow-soft)] hover:opacity-90"
                >
                  Abrir WhatsApp
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-black hover:bg-black/[0.03]"
                >
                  Enviar email
                </a>
              </div>

              <p className="mt-6 text-sm text-black/60">
                *Reemplazamos email/WhatsApp cuando me pases los datos reales.
              </p>
            </div>
          </Reveal>
        </section>

        <Reveal variant="fade" delay={60} duration={920}>
          <footer className="py-10 text-center text-sm text-black/50">
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.tagline}
          </footer>
        </Reveal>
      </main>
    </>
  );
}
