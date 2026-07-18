import { cn } from "@/lib/utils";
import type { Grade, WeatherEvaluation } from "@/types/recommendation";

/** 4段階評価の配色。 */
const GRADE_STYLES: Record<Grade, string> = {
  "◎": "text-emerald-600 dark:text-emerald-400",
  "○": "text-sky-600 dark:text-sky-400",
  "△": "text-amber-600 dark:text-amber-400",
  "×": "text-rose-600 dark:text-rose-400",
};

/**
 * 判定理由（項目別評価の一覧）。
 * スマホでも1行に収まるよう、ラベル・評価・実測値の3カラム構成にしている。
 */
export function RecommendationReason({ factors }: { factors: WeatherEvaluation[] }) {
  return (
    <ul className="divide-y divide-border/60 rounded-lg bg-muted/40">
      {factors.map((factor) => (
        <li key={factor.key} className="flex items-center gap-3 px-3 py-2.5">
          <span className="w-10 shrink-0 text-sm font-medium text-muted-foreground">
            {factor.label}
          </span>
          <span
            className={cn("w-6 shrink-0 text-center text-lg font-bold", GRADE_STYLES[factor.grade])}
            aria-label={`${factor.label}の評価は${factor.grade}`}
          >
            {factor.grade}
          </span>
          <span className="ml-auto text-sm tabular-nums text-foreground/80">{factor.value}</span>
        </li>
      ))}
    </ul>
  );
}
