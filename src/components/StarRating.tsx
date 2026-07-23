import { Star } from "lucide-react";
import clsx from "clsx";

export default function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={clsx(
              starSize,
              i < Math.round(rating) ? "fill-gold text-gold" : "fill-none text-ink/20"
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-ink/50">
          {rating > 0 ? `${rating.toFixed(1)} (${count})` : "No reviews yet"}
        </span>
      )}
    </div>
  );
}
