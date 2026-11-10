// Small uppercase label used above section titles.
export default function SectionLabel({ className = "", children }) {
  return (
    <p className={`text-xs md:text-sm uppercase tracking-[0.3em] text-white/60 ${className}`.trim()}>
      {children}
    </p>
  );
}
