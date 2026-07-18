import { CalendarClock, CloudSun, Thermometer, Waves, Wind, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FactorKey, Grade, WeatherEvaluation } from "@/types/recommendation";

/** 4段階評価の配色。 */
const GRADE_STYLES: Record<Grade, { text: string; bar: string }> = {
  "◎": { text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
  "○": { text: "text-sky-600 dark:text-sky-400", bar: "bg-sky-500" },
  "△": { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  "×": { text: "text-rose-600 dark:text-rose-400", bar: "bg-rose-500" },
};

/** 項目ごとのアイコン。 */
const FACTOR_ICON: Record<FactorKey, typeof Waves> = {
  wave: Waves,
  wind: Wind,
  previousDay: CalendarClock,
  weather: CloudSun,
  tide: Moon,
  temperature: Thermometer,
};

/**
 * 判定理由（項目別評価の一覧）。
 * 評価記号に加えて素点をバーで可視化し、どこが効いているか一目で分かるようにする。
 */
export function RecommendationReason({ factors }: { factors: WeatherEvaluation[] }) {
  return (
    <ul className="overflow-hidden rounded-2xl border border-border/60">
      {factors.map((factor, index) => {
        const style = GRADE_STYLES[factor.grade];
        const Icon = FACTOR_ICON[factor.key];

        return (
          <li
            key={factor.key}
            className={cn(
              "flex items-center gap-3 bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/60",
              index !== 0 && "border-t border-border/50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

            <span className="w-9 shrink-0 text-sm font-medium">{factor.label}</span>

            <span
              className={cn("w-5 shrink-0 text-center text-lg font-bold", style.text)}
              aria-label={`${factor.label}の評価は${factor.grade}`}
            >
              {factor.grade}
            </span>

            {/* 素点バー */}
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className={cn("block h-full rounded-full transition-all duration-700", style.bar)}
                style={{ width: `${Math.max(4, Math.round(factor.score))}%` }}
              />
            </span>

            <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {factor.value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
