import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium shadow-[var(--shadow-soft)] transition";
  const sizeClass = size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm";
  const variantClass =
    variant === "primary"
      ? "bg-amazonita-turquoise text-black hover:opacity-90"
      : variant === "secondary"
        ? "border border-black/15 bg-white text-black hover:bg-black/[0.03]"
        : "bg-transparent text-black hover:bg-black/[0.03]";

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      className={cn(base, sizeClass, variantClass, className)}
    >
      {children}
    </a>
  );
}
