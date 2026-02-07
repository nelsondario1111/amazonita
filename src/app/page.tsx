import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
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
        <section className="py-14 scroll-mt-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
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

            <div className="relative overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]">
              {/* Replace with real hero image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src="/photos/hero.svg"
                  alt="La Amazonita"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 ring-1 ring-black/5" />
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-14 scroll-mt-24">
          <SectionTitle
            eyebrow="Valores"
            title="Sostenibilidad, Salud, Creatividad y Calidad"
            subtitle="La intención detrás de cada experiencia y cada pieza."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { t: "Sostenibilidad", d: "Con respeto por la naturaleza y los materiales." },
              { t: "Salud", d: "Bienestar físico, emocional y energético." },
              { t: "Creatividad", d: "Arte, símbolos y belleza con propósito." },
              { t: "Calidad", d: "Cuidado en cada detalle, con amor." },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-[var(--radius-2xl)] bg-white p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="text-lg font-semibold">{c.t}</div>
                <p className="mt-2 text-sm text-black/70">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="servicios" className="py-14 scroll-mt-24">
          <SectionTitle
            eyebrow="Servicios"
            title="Experiencias para el cuerpo y el alma"
            subtitle="Podemos ajustar la lista exacta cuando subas los detalles y fotos."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: "Masajes", d: "Relajación, liberación y equilibrio." },
              { t: "Lecturas de Oráculo", d: "Claridad, guía y perspectiva." },
              { t: "Regalos Artesanales", d: "Piezas con intención y belleza." },
            ].map((s) => (
              <div
                key={s.t}
                className="rounded-[var(--radius-3xl)] bg-white p-7 shadow-[var(--shadow-soft)]"
              >
                <div className="text-xl font-semibold">{s.t}</div>
                <p className="mt-2 text-black/70">{s.d}</p>
                <div className="mt-6 h-px w-full bg-black/10" />
                <p className="mt-4 text-sm text-black/60">
                  (Aquí podemos añadir precio, duración y botón “Reservar”.)
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeria" className="py-14 scroll-mt-24">
          <SectionTitle
            eyebrow="Galería"
            title="Un vistazo al universo Amazonita"
            subtitle="Cuando subas más fotos, armamos una galería real con categorías."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { src: "/photos/g1.svg", alt: "Espacio de masaje preparado con luz cálida" },
              { src: "/photos/g2.svg", alt: "Lectura de oráculo con cartas y velas" },
              { src: "/photos/g3.svg", alt: "Regalo artesanal envuelto con detalles naturales" },
            ].map((item) => (
              <div
                key={item.src}
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]"
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contacto" className="py-14 scroll-mt-24">
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
        </section>

        <footer className="py-10 text-center text-sm text-black/50">
          © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.tagline}
        </footer>
      </main>
    </>
  );
}
