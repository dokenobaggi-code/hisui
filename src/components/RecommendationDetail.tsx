import { cn } from "@/lib/utils";
import type { Grade, WeatherEvaluation } from "@/types/recommendation";

const GRADE_STYLES: Record<Grade, string> = {
  "◎": "text-emerald-600 dark:text-emerald-400",
  "○": "text-sky-600 dark:text-sky-400",
  "△": "text-amber-600 dark:text-amber-400",
  "×": "text-rose-600 dark:text-rose-400",
};

interface RecommendationDetailProps {
  factors: WeatherEvaluation[];
  /** 総合スコアの内訳を補足する文言 */
  scoreValue: number;
}

/**
 * 「なぜこの評価なのか」の詳細表示。
 * 各項目の評価理由と、総合スコアへの寄与度（重み）を示す。
 */
export function RecommendationDetail({ factors, scoreValue }: RecommendationDetailProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-background/60 p-4">
      <p className="text-xs text-muted-foreground">
        波・風・天気・潮位・気温をそれぞれ採点し、重み付けして{scoreValue}点と判定しました。
      </p>

      <ul className="space-y-2.5">
        {factors.map((factor) => (
          <li key={factor.key} className="flex gap-2.5 text-sm">
            <span
              className={cn("mt-0.5 shrink-0 font-bold", GRADE_STYLES[factor.grade])}
              aria-hidden="true"
            >
              {factor.grade}
            </span>
            <div className="space-y-0.5">
              <p className="leading-relaxed text-foreground/90">{factor.detail}</p>
              <p className="text-xs text-muted-foreground">
                {factor.label}の配点 {factor.weight}点 / 素点 {Math.round(factor.score)}点
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
        ※ 判定は一般的にヒスイ拾いに向くとされる条件をもとにした目安です。実際の海況は現地の情報を確認し、安全を最優先にしてください。
      </p>
    </div>
  );
}
