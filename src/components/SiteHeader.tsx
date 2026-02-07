"use client";

import Image from "next/image";
import { useRef } from "react";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

export default function SiteHeader() {
  const mobileMenuRef = useRef<HTMLDetailsElement | null>(null);

  const closeMobileMenu = () => {
    mobileMenuRef.current?.removeAttribute("open");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-amazonita-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow-[var(--shadow-soft)]">
            {/* replace src with your real logo asset */}
            <Image
              src="/brand/mark.svg"
              alt="La Amazonita"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-wide">La Amazonita</div>
            <div className="text-xs text-black/60">Artist of Life</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-black/70 hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <details ref={mobileMenuRef} className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-black/80">
            Menú
          </summary>
          <nav className="absolute right-0 mt-2 min-w-40 rounded-2xl border border-black/10 bg-white p-3 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-2 py-1 text-sm text-black/80 hover:bg-black/[0.03]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        </details>

        <a
          href={siteConfig.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center justify-center rounded-full bg-amazonita-turquoise px-5 py-2 text-sm font-medium text-black shadow-[var(--shadow-soft)] hover:opacity-90 md:inline-flex"
        >
          Reservar por WhatsApp
        </a>
      </div>
    </header>
  );
}
