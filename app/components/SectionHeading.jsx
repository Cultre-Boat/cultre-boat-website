// Section heading: small label, large title, and an optional italic subtitle or paragraph.
// Each page passes its own title classes, so existing sizes and spacing stay as they were.
// hideLabelOnMobile: hides the label below the md breakpoint.
export default function SectionHeading({
  label,
  title,
  titleClassName,
  subtitle,
  description,
  align = "left",
  wrapperClassName,
  hideLabelOnMobile = false,
}) {
  // Heading sits above images (z-10) and keeps a gap below so descenders and text never sit under an image.
  const wrapper = `relative z-10 px-6 md:px-0 pb-3 md:pb-4 ${align === "center" ? "text-center" : ""} ${wrapperClassName ?? ""}`.trim();
  const labelClass = hideLabelOnMobile
    ? "text-xs tracking-[3px] uppercase text-white hidden md:block mb-0 md:mb-3"
    : "text-xs tracking-[3px] uppercase text-white block mb-0 md:mb-3";
  return (
    <div className={wrapper}>
      <span className={labelClass}>{label}</span>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className="text-lg md:text-xl text-white italic leading-tight">{subtitle}</p>}
      {description && <p className="text-white leading-relaxed">{description}</p>}
    </div>
  );
}
