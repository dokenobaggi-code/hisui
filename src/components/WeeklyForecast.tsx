import { cn } from "@/lib/utils";
import type { DailyForecast } from "@/services/forecast";
import type { RecommendationTone } from "@/types/recommendation";

/** トーンごとの色。段階が一目で分かるようはっきり色分けする。 */
const TONE_BAR: Record<RecommendationTone, string> = {
  great: "bg-emerald-500",
  good: "bg-teal-500",
  fair: "bg-amber-500",
  poor: "bg-orange-500",
  bad: "bg-rose-500",
};

const TONE_TEXT: Record<RecommendationTone, string> = {
  great: "text-emerald-600 dark:text-emerald-400",
  good: "text-teal-600 dark:text-teal-400",
  fair: "text-amber-600 dark:text-amber-400",
  poor: "text-orange-600 dark:text-orange-400",
  bad: "text-rose-600 dark:text-rose-400",
};

/** 「7/19（土）」形式。 */
function formatDay(dateIso: string): { day: string; weekday: string } {
  const date = new Date(`${dateIso}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return { day: dateIso, weekday: "" };

  const day = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
  }).format(date);

  const weekday = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(date);

  return { day, weekday };
}

/** 土日は色を変えて、出かけやすい日を見つけやすくする。 */
function weekdayTone(weekday: string): string {
  if (weekday === "土") return "text-sky-700 dark:text-sky-400";
  if (weekday === "日") return "text-rose-700 dark:text-rose-400";
  return "text-muted-foreground";
}

/** 向こう1週間のおすすめ度。 */
export function WeeklyForecast({ days }: { days: DailyForecast[] }) {
  if (days.length === 0) return null;

  const best = days.reduce((a, b) =>
    b.recommendation.score.value > a.recommendation.score.value ? b : a,
  );

  return (
    <section className="space-y-5">
      <div className="rule-left space-y-1">
        <span className="label-en">This week</span>
        <h2 className="text-lg font-bold">週間おすすめ度</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_4px_16px_-10px_hsl(130_30%_28%/0.22)]">
        <ul>
          {days.map((day, index) => {
            const { day: label, weekday } = formatDay(day.date);
            const score = day.recommendation.score;
            const isBest = day.date === best.date && score.value >= 50;

            return (
              <li
                key={day.date}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors sm:gap-5 sm:px-5",
                  index !== 0 && "border-t border-border/60",
                  isBest && "bg-accent/50",
                )}
              >
                {/* 日付 */}
                <div className="flex w-14 shrink-0 items-baseline gap-1.5">
                  <span className="numeral text-sm">{label}</span>
                  <span className={cn("text-xs", weekdayTone(weekday))}>{weekday}</span>
                </div>

                {/* 天気と波 */}
                <div className="w-24 shrink-0 text-xs text-muted-foreground sm:w-32">
                  <span className="block truncate">{day.weather.weather}</span>
                  <span className="block truncate">
                    波 {day.wave.waveHeight.toFixed(1)}m・
                    {day.weather.highTemperature.toFixed(0)}℃
                  </span>
                </div>

                {/* スコアバー */}
                <div className="flex flex-1 items-center gap-3">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className={cn(
                        "block h-full rounded-full transition-all duration-700",
                        TONE_BAR[score.tone],
                      )}
                      style={{ width: `${Math.max(4, score.value)}%` }}
                    />
                  </span>
                  <span
                    className={cn(
                      "numeral w-8 shrink-0 text-right text-base",
                      TONE_TEXT[score.tone],
                    )}
                  >
                    {score.value}
                  </span>
                </div>

                {/* 見出しの日だけ印を添える */}
                <span className="w-12 shrink-0 text-right">
                  {isBest && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      狙い目
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        日別予報のため、潮位は加味していません（当日の判定とは数点前後することがあります）。
        波が高い日は安全を最優先にしてください。
      </p>
    </section>
  );
}
