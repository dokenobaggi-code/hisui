import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import type { RecommendationScore as ScoreType } from "@/types/recommendation";

/** トーンごとの配色。ヒスイ配色を基調に、警告側は彩度を落として馴染ませる。 */
const TONE = {
  great: {
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "stroke-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    glow: "shadow-[0_0_28px_-6px_rgba(16,185,129,0.55)]",
  },
  good: {
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "stroke-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    glow: "shadow-[0_0_24px_-8px_rgba(16,185,129,0.45)]",
  },
  fair: {
    text: "text-amber-600 dark:text-amber-400",
    ring: "stroke-amber-500",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    glow: "shadow-[0_0_24px_-8px_rgba(245,158,11,0.4)]",
  },
  poor: {
    text: "text-orange-600 dark:text-orange-400",
    ring: "stroke-orange-500",
    badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    glow: "",
  },
  bad: {
    text: "text-rose-600 dark:text-rose-400",
    ring: "stroke-rose-500",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    glow: "",
  },
} as const satisfies Record<ScoreType["tone"], Record<string, string>>;

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** おすすめ度のスコア表示。円形ゲージ・星・アイコン・ラベル。 */
export function RecommendationScore({ score }: { score: ScoreType }) {
  const tone = TONE[score.tone];
  const dashOffset = CIRCUMFERENCE * (1 - score.value / 100);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      {/* 円形ゲージ */}
      <div className={cn("relative shrink-0 rounded-full", tone.glow)}>
        <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
          <circle
            cx="66"
            cy="66"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          <circle
            cx="66"
            cy="66"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={cn(tone.ring, "transition-[stroke-dashoffset] duration-1000 ease-out")}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl leading-none" aria-hidden="true">
            {score.icon}
          </span>
          <span className={cn("text-4xl font-bold leading-tight tabular-nums", tone.text)}>
            {score.value}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">点 / 100</span>
        </div>
      </div>

      {/* ラベルと星 */}
      <div className="flex flex-col items-center gap-2.5 sm:items-start">
        <span
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-bold tracking-wide",
            tone.badge,
          )}
        >
          {score.label}
        </span>
        <StarRating score={score.stars} size={26} />
      </div>
    </div>
  );
}
