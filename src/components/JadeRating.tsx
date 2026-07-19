import { cn } from "@/lib/utils";

interface JadeRatingProps {
  /** 1〜5 */
  score: number;
  className?: string;
  size?: number;
}

/**
 * ヒスイの原石を5つ並べ、評価の数だけ色を付ける。
 * 星の代わりに使う、テーマに沿った評価表示。
 */
export function JadeRating({ score, className, size = 22 }: JadeRatingProps) {
  const filled = Math.max(0, Math.min(5, Math.round(score)));

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`おすすめ度 ${filled} / 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i < filled;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0"
          >
            {/* 角の取れた原石のかたち */}
            <path
              d="M8 3 L16 4 Q21 6 21 12 Q21 19 15 21 Q9 23 5 19 Q2 15 3 9 Q4 4 8 3 Z"
              fill={on ? "#6aa77e" : "hsl(var(--muted))"}
              stroke={on ? "#3a6449" : "hsl(var(--border))"}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {on && (
              <path d="M8 3 L16 4 Q12 10 7 10 Q4 9 4 6 Q5 4 8 3 Z" fill="#c6e3ca" opacity="0.9" />
            )}
          </svg>
        );
      })}
    </div>
  );
}
