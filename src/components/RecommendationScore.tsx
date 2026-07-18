import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import type { RecommendationScore as ScoreType } from "@/types/recommendation";

/** トーンごとの配色。段階が一目で伝わるよう、はっきりした色を使う。 */
const TONE = {
  great: {
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "stroke-emerald-500",
    chip: "bg-emerald-500 text-white",
    glow: "drop-shadow-[0_0_14px_rgba(16,185,129,0.45)]",
  },
  good: {
    text: "text-teal-600 dark:text-teal-400",
    ring: "stroke-teal-500",
    chip: "bg-teal-500 text-white",
    glow: "drop-shadow-[0_0_12px_rgba(20,184,166,0.4)]",
  },
  fair: {
    text: "text-amber-600 dark:text-amber-400",
    ring: "stroke-amber-500",
    chip: "bg-amber-500 text-white",
    glow: "drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]",
  },
  poor: {
    text: "text-orange-600 dark:text-orange-400",
    ring: "stroke-orange-500",
    chip: "bg-orange-500 text-white",
    glow: "",
  },
  bad: {
    text: "text-rose-600 dark:text-rose-400",
    ring: "stroke-rose-500",
    chip: "bg-rose-500 text-white",
    glow: "",
  },
} as const satisfies Record<ScoreType["tone"], Record<string, string>>;

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** おすすめ度のスコア表示。太めの円環＋明朝の数字。 */
export function RecommendationScore({ score }: { score: ScoreType }) {
  const tone = TONE[score.tone];
  const dashOffset = CIRCUMFERENCE * (1 - score.value / 100);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      {/* 円環ゲージ */}
      <div className={cn("relative shrink-0", tone.glow)}>
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={RADIUS} fill="none" strokeWidth="9" className="stroke-muted" />
          <circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={cn(tone.ring, "transition-[stroke-dashoffset] duration-1000 ease-out")}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl leading-none" aria-hidden="true">
            {score.icon}
          </span>
          <span className={cn("numeral text-[2.5rem] leading-none", tone.text)}>
            {score.value}
          </span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
            / 100
          </span>
        </div>
      </div>

      {/* 評価ラベルと星 */}
      <div className="flex flex-col items-center gap-3 sm:items-start">
        <span className="label-en">Today&apos;s rating</span>
        <span
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-bold tracking-wide shadow-sm",
            tone.chip,
          )}
        >
          {score.label}
        </span>
        <StarRating score={score.stars} size={24} />
      </div>
    </div>
  );
}
