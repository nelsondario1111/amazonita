"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  variant?: "fade" | "up" | "down" | "left" | "right" | "zoom" | "pop";
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 900,
  once = true,
  threshold = 0.14,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  const hiddenState =
    variant === "fade"
      ? "opacity-0"
      : variant === "down"
        ? "opacity-0 -translate-y-8"
        : variant === "left"
          ? "opacity-0 -translate-x-12 rotate-[-1.5deg]"
          : variant === "right"
            ? "opacity-0 translate-x-12 rotate-[1.5deg]"
            : variant === "zoom"
              ? "opacity-0 scale-[0.92]"
              : variant === "pop"
                ? "opacity-0 translate-y-6 scale-[0.88]"
                : "opacity-0 translate-y-8";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={[
        "transform-gpu will-change-transform transition-[opacity,transform] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        visible ? "opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0" : hiddenState,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
