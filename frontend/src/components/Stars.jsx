import { Star } from "lucide-react";

export default function Stars({ value = 0, size = 12, className = "" }) {
  const rounded = Math.round(value);
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= rounded ? "text-black" : "text-zinc-300"}
          fill={i <= rounded ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}
