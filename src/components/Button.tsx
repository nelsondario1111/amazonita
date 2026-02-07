import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
};

export default function Button({ href, children, variant = "primary" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-3xl px-6 py-3 text-sm md:text-base transition";
  const styles =
    variant === "primary"
      ? "bg-amazonita-turquoise text-black hover:opacity-90"
      : "border border-amazonita-cream/40 text-amazonita-cream hover:bg-white/10";

  return (
    <Link className={`${base} ${styles}`} href={href}>
      {children}
    </Link>
  );
}