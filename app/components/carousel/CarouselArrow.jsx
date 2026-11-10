"use client";

const PATHS = {
  prev: "M15 19l-7-7 7-7",
  next: "M9 5l7 7-7 7",
};

// Round arrow button for carousels. Callers pass the position/size classes in `className`.
export default function CarouselArrow({
  direction,
  onClick,
  label,
  className,
  iconClassName = "w-5 h-5 text-white",
}) {
  return (
    <button onClick={onClick} aria-label={label} className={className}>
      <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={PATHS[direction]} />
      </svg>
    </button>
  );
}
