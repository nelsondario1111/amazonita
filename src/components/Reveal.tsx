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
  variant?: "fade" | "fadeUp" | "zoom";
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 820,
  once = true,
  threshold = 0.16,
  variant = "fadeUp",
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
      : variant === "zoom"
        ? "opacity-0 scale-[0.985]"
        : "opacity-0 translate-y-4";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={[
        "transform-gpu will-change-transform transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        visible ? "opacity-100 translate-y-0 scale-100" : hiddenState,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
