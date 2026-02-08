import Button from "@/components/Button";
import { homeHero } from "@/content/home";
import { getWhatsAppLink } from "@/lib/site";

export default function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-amazonita-cream/95 px-4 py-3 backdrop-blur md:hidden [padding-bottom:calc(env(safe-area-inset-bottom)+0.75rem)]">
      <Button
        href={getWhatsAppLink("Hola, quiero reservar una experiencia en La Amazonita.")}
        target="_blank"
        rel="noopener noreferrer"
        ariaLabel="Reservar por WhatsApp - La Amazonita"
        className="w-full"
      >
        {homeHero.primaryCtaLabel}
      </Button>
    </div>
  );
}
