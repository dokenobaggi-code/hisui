import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import type { RecommendationScore as ScoreType } from "@/types/recommendation";

/** トーンごとの配色（ヒスイ配色を基調に、警告色を控えめに合わせる）。 */
const TONE_STYLES: Record<ScoreType["tone"], string> = {
  great: "text-emerald-600 dark:text-emerald-400",
  good: "text-emerald-600 dark:text-emerald-400",
  fair: "text-amber-600 dark:text-amber-400",
  poor: "text-orange-600 dark:text-orange-400",
  bad: "text-rose-600 dark:text-rose-400",
};

const TONE_BADGE: Record<ScoreType["tone"], string> = {
  great: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  good: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  fair: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  poor: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  bad: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

/** おすすめ度のスコア表示（点数・星・アイコン・ラベル）。 */
export function RecommendationScore({ score }: { score: ScoreType }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none" aria-hidden="true">
          {score.icon}
        </span>
        <div>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-4xl font-bold tabular-nums", TONE_STYLES[score.tone])}>
              {score.value}
            </span>
            <span className="text-sm font-medium text-muted-foreground">/ 100</span>
          </div>
          <span
            className={cn(
              "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
              TONE_BADGE[score.tone],
            )}
          >
            {score.label}
          </span>
        </div>
      </div>

      <StarRating score={score.stars} size={24} />
    </div>
  );
}
