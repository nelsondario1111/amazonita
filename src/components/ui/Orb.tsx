import { cn } from "@/lib/cn";

type OrbProps = {
  className?: string;
  delayMs?: number;
};

export default function Orb({ className = "", delayMs }: OrbProps) {
  return (
    <div
      aria-hidden
      className={cn("orb-drift pointer-events-none absolute rounded-full blur-3xl", className)}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    />
  );
}
