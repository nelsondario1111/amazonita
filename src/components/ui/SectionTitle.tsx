type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: "md" | "lg";
  className?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  size = "md",
  className = "",
}: SectionTitleProps) {
  const containerClass = align === "center" ? "mx-auto text-center" : "";
  const titleClass = size === "lg" ? "text-4xl md:text-5xl" : "text-3xl";

  return (
    <div className={["max-w-2xl", containerClass, className].filter(Boolean).join(" ")}>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.25em] text-black/60">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={["mt-2 font-semibold tracking-tight", titleClass].join(" ")}>
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-black/70">{subtitle}</p> : null}
    </div>
  );
}
