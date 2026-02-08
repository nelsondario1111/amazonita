import type { ReactNode } from "react";
import Orb from "@/components/ui/Orb";
import { cn } from "@/lib/cn";

type SectionOrb = {
  className: string;
  delayMs?: number;
};

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  overflowHidden?: boolean;
  backgroundClassName?: string;
  orbs?: ReadonlyArray<SectionOrb>;
};

export default function Section({
  children,
  id,
  className,
  overflowHidden = false,
  backgroundClassName,
  orbs = [],
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-14 scroll-mt-24", overflowHidden && "relative overflow-hidden", className)}
    >
      {backgroundClassName ? (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0", backgroundClassName)} />
      ) : null}
      {orbs.map((orb, index) => (
        <Orb key={`${orb.className}-${index}`} className={orb.className} delayMs={orb.delayMs} />
      ))}
      {children}
    </section>
  );
}
