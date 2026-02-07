export const homeHero = {
  eyebrow: "Bienestar • Oráculo • Arte",
  description:
    "Un espacio para reconectar: masajes, lecturas privadas, pequeños talleres y regalos artesanales con intención.",
  primaryCtaLabel: "Reservar por WhatsApp",
  secondaryCtaLabel: "Ver servicios",
  secondaryCtaHref: "#servicios",
  imageSrc: "/photos/hero.svg",
  imageAlt: "La Amazonita",
} as const;

export const homeValuesSection = {
  eyebrow: "Valores",
  title: "Sostenibilidad, Salud, Creatividad y Calidad",
  subtitle: "La intención detrás de cada experiencia y cada pieza.",
} as const;

export const values = [
  { title: "Sostenibilidad", description: "Con respeto por la naturaleza y los materiales." },
  { title: "Salud", description: "Bienestar físico, emocional y energético." },
  { title: "Creatividad", description: "Arte, símbolos y belleza con propósito." },
  { title: "Calidad", description: "Cuidado en cada detalle, con amor." },
] as const;

export const homeMissionVisionSection = {
  eyebrow: "Nuestra esencia",
  title: "Misión y Visión",
  subtitle: "La dirección y propósito que guían cada experiencia en La Amazonita.",
} as const;

export const homeServicesSection = {
  eyebrow: "Servicios",
  title: "Experiencias para el cuerpo y el alma",
  subtitle: "Podemos ajustar la lista exacta cuando subas los detalles y fotos.",
  note: '(Aquí podemos añadir precio, duración y botón "Reservar".)',
} as const;

export const services = [
  { title: "Masajes", description: "Relajación, liberación y equilibrio." },
  { title: "Lecturas de Oráculo", description: "Claridad, guía y perspectiva." },
  { title: "Regalos Artesanales", description: "Piezas con intención y belleza." },
] as const;

export const homeGallerySection = {
  eyebrow: "Galería",
  title: "Un vistazo al universo Amazonita",
  subtitle: "Cuando subas más fotos, armamos una galería real con categorías.",
} as const;

export const gallery = [
  {
    src: "/photos/g1.svg",
    alt: "Espacio de masaje preparado con luz cálida",
    parallaxSpeed: 0.08,
  },
  {
    src: "/photos/g2.svg",
    alt: "Lectura de oráculo con cartas y velas",
    parallaxSpeed: -0.08,
  },
  {
    src: "/photos/g3.svg",
    alt: "Regalo artesanal envuelto con detalles naturales",
    parallaxSpeed: 0.08,
  },
] as const;

export const homeContactSection = {
  eyebrow: "Contacto",
  title: "Reserva o pregunta por disponibilidad",
  subtitle: "WhatsApp es lo más directo. También podemos agregar Instagram.",
  whatsappLabel: "Abrir WhatsApp",
  emailLabel: "Enviar email",
  footnote: "*Reemplazamos email/WhatsApp cuando me pases los datos reales.",
} as const;
