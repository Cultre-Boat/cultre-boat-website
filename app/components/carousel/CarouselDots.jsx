"use client";

// Pill-style pagination dots. The active dot is wider and solid.
export default function CarouselDots({
  count,
  current,
  onSelect,
  label = "Go to slide",
  className = "flex justify-center gap-2 mt-6",
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`${label} ${i + 1}`}
          className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-white" : "w-2 bg-white/40"}`}
        />
      ))}
    </div>
  );
}
