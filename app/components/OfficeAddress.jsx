// Office location block: heading plus location text.
export default function OfficeAddress({ titleClassName = "text-lg md:text-xl mb-3", textClassName = "text-sm md:text-base leading-relaxed" }) {
  return (
    <div className="mb-4">
      <h3 className={titleClassName}>Our Office</h3>
      <p className={textClassName}>Delhi, India</p>
    </div>
  );
}
