export default function Marquee({ items, duration = 40, className = "", itemClassName = "", sepClassName = "" }) {
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className={`flex items-center shrink-0 ${itemClassName}`}>
          <span className="mx-5 sm:mx-8">{t}</span>
          <span className={sepClassName || "opacity-40"}>//</span>
        </span>
      ))}
    </>
  );
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-flex animate-marquee" style={{ "--marquee-duration": `${duration}s` }}>
        <div className="flex items-center shrink-0">{row}</div>
        <div className="flex items-center shrink-0" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}
