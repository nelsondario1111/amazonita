type HomeContent = {
  hero: {
    eyebrow: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    imageSrc: string;
    imageAlt: string;
  };
  valuesSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  values: ReadonlyArray<{
    title: string;
    description: string;
  }>;
  missionVisionSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
  };
  services: ReadonlyArray<{
    id: string;
    title: string;
    description: string;
    duration: string;
    price: string;
    includes: ReadonlyArray<string>;
    whatsappPrefill: string;
  }>;
  howItWorksSection: {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: ReadonlyArray<{
      title: string;
      description: string;
    }>;
  };
  scheduleLocationSection: {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    locationLabel: string;
    locationText: string;
    scheduleLabel: string;
    hours: ReadonlyArray<{
      day: string;
      hours: string;
    }>;
    mapLabel: string;
    mapHref: string;
  };
  gallerySection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  gallery: ReadonlyArray<{
    src: string;
    alt: string;
    parallaxSpeed?: number;
    blurDataURL?: string;
  }>;
  contactSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    whatsappLabel: string;
    emailLabel: string;
    instagramLabel: string;
    footnote: string;
  };
};

const homeByLocale: Record<"es" | "en", HomeContent> = {
  es: {
    hero: {
      eyebrow: "Bienestar • Oráculo • Arte",
      description:
        "Un espacio para reconectar: masajes, lecturas privadas, pequeños talleres y regalos artesanales con intención.",
      primaryCtaLabel: "Reservar por WhatsApp",
      secondaryCtaLabel: "Ver servicios",
      secondaryCtaHref: "#servicios",
      imageSrc: "/photos/hero.svg",
      imageAlt: "La Amazonita",
    },
    valuesSection: {
      eyebrow: "Valores",
      title: "Sostenibilidad, Salud, Creatividad y Calidad",
      subtitle: "La intención detrás de cada experiencia y cada pieza.",
    },
    values: [
      { title: "Sostenibilidad", description: "Con respeto por la naturaleza y los materiales." },
      { title: "Salud", description: "Bienestar físico, emocional y energético." },
      { title: "Creatividad", description: "Arte, símbolos y belleza con propósito." },
      { title: "Calidad", description: "Cuidado en cada detalle, con amor." },
    ],
    missionVisionSection: {
      eyebrow: "Nuestra esencia",
      title: "Misión y Visión",
      subtitle: "La dirección y propósito que guían cada experiencia en La Amazonita.",
    },
    servicesSection: {
      eyebrow: "Servicios",
      title: "Experiencias para el cuerpo y el alma",
      subtitle: "Elige una experiencia y te ayudamos a reservarla por WhatsApp en segundos.",
      ctaLabel: "Reservar este servicio",
    },
    services: [
      {
        id: "masaje-japones",
        title: "Masaje Japonés",
        description: "Relajación profunda para liberar tensión y recuperar equilibrio.",
        duration: "60 min",
        price: "S/ 120",
        includes: ["Diagnóstico breve", "Masaje corporal completo", "Cierre con aromaterapia"],
        whatsappPrefill:
          "Hola, quiero reservar un Masaje Japonés (60 min). ¿Qué horarios tienen disponibles?",
      },
      {
        id: "lectura-oraculo",
        title: "Lectura de Oráculo",
        description: "Claridad y guía en un espacio íntimo, sereno y privado.",
        duration: "45 min",
        price: "S/ 90",
        includes: ["Apertura de sesión", "Lectura personalizada", "Recomendaciones de integración"],
        whatsappPrefill:
          "Hola, me gustaría reservar una Lectura de Oráculo (45 min). ¿Qué disponibilidad tienen?",
      },
      {
        id: "ritual-bienestar",
        title: "Ritual de Bienestar",
        description: "Una experiencia combinada para cuerpo, mente y energía.",
        duration: "90 min",
        price: "S/ 180",
        includes: ["Masaje focalizado", "Lectura breve", "Infusión y cierre de intención"],
        whatsappPrefill:
          "Hola, quiero reservar el Ritual de Bienestar (90 min). ¿Me comparten horarios y detalles?",
      },
    ],
    howItWorksSection: {
      id: "como-funciona",
      eyebrow: "Cómo funciona",
      title: "Reservar es simple",
      subtitle: "Tres pasos para separar tu experiencia sin complicaciones.",
      steps: [
        {
          title: "1. Escribe por WhatsApp",
          description: "Cuéntanos qué servicio te interesa y tu horario ideal.",
        },
        {
          title: "2. Confirmamos tu reserva",
          description: "Te respondemos con disponibilidad, duración y total.",
        },
        {
          title: "3. Vienes y disfrutas",
          description: "Llega unos minutos antes y nosotros nos encargamos del resto.",
        },
      ],
    },
    scheduleLocationSection: {
      id: "horario",
      eyebrow: "Horario y ubicación",
      title: "Te esperamos en Tarapoto",
      subtitle: "Comparte tu hora ideal y te confirmamos por WhatsApp.",
      locationLabel: "Ubicación",
      locationText: "Centro de Tarapoto, San Martín, Perú (dirección exacta por WhatsApp).",
      scheduleLabel: "Horario referencial",
      hours: [
        { day: "Lunes a Viernes", hours: "9:00 AM - 7:00 PM" },
        { day: "Sábados", hours: "10:00 AM - 6:00 PM" },
        { day: "Domingos", hours: "Solo con cita previa" },
      ],
      mapLabel: "Ver zona en Google Maps",
      mapHref: "https://maps.google.com/?q=Tarapoto,+Peru",
    },
    gallerySection: {
      eyebrow: "Galería",
      title: "Un vistazo al universo Amazonita",
      subtitle: "Pronto reemplazaremos estos placeholders por fotos reales del espacio y servicios.",
    },
    gallery: [
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
    ],
    contactSection: {
      eyebrow: "Contacto",
      title: "Reserva o pregunta por disponibilidad",
      subtitle: "WhatsApp es lo más directo. También puedes encontrarnos en Instagram.",
      whatsappLabel: "Abrir WhatsApp",
      emailLabel: "Enviar email",
      instagramLabel: "Abrir Instagram",
      footnote: "*Actualizamos dirección, horarios y enlaces cuando compartas los datos finales.",
    },
  },
  en: {
    hero: {
      eyebrow: "Wellness • Oracle • Art",
      description:
        "A space to reconnect through massage, private readings, intimate workshops, and artisanal gifts.",
      primaryCtaLabel: "Book on WhatsApp",
      secondaryCtaLabel: "View services",
      secondaryCtaHref: "#services",
      imageSrc: "/photos/hero.svg",
      imageAlt: "La Amazonita",
    },
    valuesSection: {
      eyebrow: "Values",
      title: "Sustainability, Health, Creativity, and Quality",
      subtitle: "The intention behind every experience and every piece.",
    },
    values: [
      { title: "Sustainability", description: "Respectful choices for nature and materials." },
      { title: "Health", description: "Physical, emotional, and energetic wellbeing." },
      { title: "Creativity", description: "Art and beauty with meaning." },
      { title: "Quality", description: "Attention to detail in everything we do." },
    ],
    missionVisionSection: {
      eyebrow: "Our essence",
      title: "Mission and Vision",
      subtitle: "The purpose and direction that shape each Amazonita experience.",
    },
    servicesSection: {
      eyebrow: "Services",
      title: "Experiences for body and soul",
      subtitle: "Choose an experience and we will help you book it via WhatsApp.",
      ctaLabel: "Book this service",
    },
    services: [],
    howItWorksSection: {
      id: "how-it-works",
      eyebrow: "How it works",
      title: "Booking is simple",
      subtitle: "Three simple steps to reserve your experience.",
      steps: [],
    },
    scheduleLocationSection: {
      id: "schedule",
      eyebrow: "Schedule and location",
      title: "Visit us in Tarapoto",
      subtitle: "Share your ideal time and we will confirm by WhatsApp.",
      locationLabel: "Location",
      locationText: "Downtown Tarapoto, San Martin, Peru.",
      scheduleLabel: "Reference hours",
      hours: [],
      mapLabel: "Open Google Maps",
      mapHref: "https://maps.google.com/?q=Tarapoto,+Peru",
    },
    gallerySection: {
      eyebrow: "Gallery",
      title: "A glimpse into Amazonita",
      subtitle: "Photo gallery coming soon.",
    },
    gallery: [],
    contactSection: {
      eyebrow: "Contact",
      title: "Book or ask for availability",
      subtitle: "WhatsApp is the fastest way to reach us.",
      whatsappLabel: "Open WhatsApp",
      emailLabel: "Send email",
      instagramLabel: "Open Instagram",
      footnote: "",
    },
  },
};

export const homeLocale = "es" as const;
export const homeDictionary = homeByLocale;
export const homeContent = homeDictionary[homeLocale];

export const homeHero = homeContent.hero;
export const homeValuesSection = homeContent.valuesSection;
export const values = homeContent.values;
export const homeMissionVisionSection = homeContent.missionVisionSection;
export const homeServicesSection = homeContent.servicesSection;
export const services = homeContent.services;
export const homeHowItWorksSection = homeContent.howItWorksSection;
export const homeScheduleLocationSection = homeContent.scheduleLocationSection;
export const homeGallerySection = homeContent.gallerySection;
export const gallery = homeContent.gallery;
export const homeContactSection = homeContent.contactSection;
