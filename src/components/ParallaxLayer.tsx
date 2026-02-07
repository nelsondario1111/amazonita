"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ParallaxLayerProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

export default function ParallaxLayer({
  children,
  speed = 0.12,
  className = "",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const effectiveSpeed = isCoarsePointer ? speed * 0.55 : speed;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const delta = elementCenter - viewportCenter;
      const next = Math.max(-28, Math.min(28, -delta * effectiveSpeed));
      setOffset(next);
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      className={["parallax-layer", className].join(" ")}
    >
      {children}
    </div>
  );
}
