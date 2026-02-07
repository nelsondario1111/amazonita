type OrbProps = {
  className?: string;
  delayMs?: number;
};

export default function Orb({ className = "", delayMs }: OrbProps) {
  return (
    <div
      aria-hidden
      className={["orb-drift pointer-events-none absolute rounded-full blur-3xl", className].filter(Boolean).join(" ")}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    />
  );
}
