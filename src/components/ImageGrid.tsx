import Image from "next/image";
import { cn } from "@/lib/cn";

type ImageGridItem = {
  src: string;
  alt: string;
  blurDataURL?: string;
};

type ImageGridProps = {
  items: ReadonlyArray<ImageGridItem>;
  className?: string;
  imageClassName?: string;
  cardClassName?: string;
};

export default function ImageGrid({
  items,
  className,
  imageClassName,
  cardClassName,
}: ImageGridProps) {
  if (items.length === 0) return null;

  const maxItems = items.slice(0, 9);
  const gridCols =
    maxItems.length <= 3 ? "md:grid-cols-3" : maxItems.length <= 6 ? "md:grid-cols-3" : "md:grid-cols-3";

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", gridCols, className)}>
      {maxItems.map((item) => (
        <div
          key={`${item.src}-${item.alt}`}
          className={cn(
            "group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-3xl)] bg-white shadow-[var(--shadow-soft)]",
            cardClassName,
          )}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={item.blurDataURL ? "blur" : "empty"}
            blurDataURL={item.blurDataURL}
            className={cn(
              "object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]",
              imageClassName,
            )}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-55" />
        </div>
      ))}
    </div>
  );
}
