import type { ReactNode } from "react";

type SoftCardProps = {
  children: ReactNode;
  className?: string;
  radius?: "2xl" | "3xl";
  lift?: boolean;
};

export default function SoftCard({
  children,
  className = "",
  radius = "3xl",
  lift = false,
}: SoftCardProps) {
  const radiusClass = radius === "2xl" ? "rounded-[var(--radius-2xl)]" : "rounded-[var(--radius-3xl)]";
  const liftClass = lift
    ? "transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.01]"
    : "";

  return (
    <div className={[radiusClass, "bg-white shadow-[var(--shadow-soft)]", liftClass, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
