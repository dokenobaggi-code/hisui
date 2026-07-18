import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** 1〜5 */
  score: number;
  className?: string;
  size?: number;
}

/** おすすめ度を★で表示する。 */
export function StarRating({ score, className, size = 28 }: StarRatingProps) {
  const filled = Math.max(0, Math.min(5, Math.round(score)));
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`おすすめ度 ${filled} / 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i < filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}
