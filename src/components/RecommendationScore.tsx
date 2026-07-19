import { JadeStone, type JadeTone } from "@/components/JadeIllustration";
import { JadeRating } from "@/components/JadeRating";
import { cn } from "@/lib/utils";
import type { RecommendationScore as ScoreType } from "@/types/recommendation";

/** tone ごとの文字色とラベルのチップ色（フラットで落ち着いた面）。 */
const TONE: Record<
  ScoreType["tone"],
  { num: string; chip: string; label: string }
> = {
  great: { num: "text-[#2f5f41]", chip: "bg-[#3f7d55] text-[#f4f9f0]", label: "text-[#3f7d55]" },
  good: { num: "text-[#3a6449]", chip: "bg-[#4f8560] text-[#f4f9f0]", label: "text-[#4f8560]" },
  fair: { num: "text-[#6b6d3f]", chip: "bg-[#8a8f52] text-[#faf8ec]", label: "text-[#7c8047]" },
  poor: { num: "text-[#755a39]", chip: "bg-[#9c7a4e] text-[#faf5ea]", label: "text-[#8a6c44]" },
  bad: { num: "text-[#734b41]", chip: "bg-[#9c6a5e] text-[#faf1ee]", label: "text-[#8a5c50]" },
};

/**
 * おすすめ度のスコア表示。
 * ヒスイの原石イラストの中に点数を置く、フラットで手描き調の見せ方。
 */
export function RecommendationScore({ score }: { score: ScoreType }) {
  const tone = TONE[score.tone];
  const jadeTone = score.tone as JadeTone;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      {/* 原石の中に点数 */}
      <JadeStone tone={jadeTone} className="h-32 w-32 shrink-0 drop-shadow-sm">
        <span className={cn("numeral text-[2.6rem] leading-none", tone.num)}>{score.value}</span>
        <span className={cn("text-[10px] font-bold tracking-[0.2em]", tone.num)}>/ 100</span>
      </JadeStone>

      {/* ラベルと評価 */}
      <div className="flex flex-col items-center gap-3 sm:items-start">
        <span className={cn("text-xs font-bold tracking-[0.18em]", tone.label)}>
          今日のヒスイ拾い
        </span>
        <span
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-bold tracking-wide shadow-sm",
            tone.chip,
          )}
        >
          {score.label}
        </span>
        <JadeRating score={score.stars} size={22} />
      </div>
    </div>
  );
}
