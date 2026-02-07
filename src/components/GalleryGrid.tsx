const placeholders = Array.from({ length: 8 }, (_, i) => i + 1);

export default function GalleryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {placeholders.map((n) => (
        <div
          key={n}
          className="aspect-[4/3] rounded-3xl bg-black/10"
          aria-label={`gallery placeholder ${n}`}
        />
      ))}
    </div>
  );
}