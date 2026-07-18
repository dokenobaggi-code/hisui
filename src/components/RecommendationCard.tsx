"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationScore } from "@/components/RecommendationScore";
import { RecommendationReason } from "@/components/RecommendationReason";
import { RecommendationDetail } from "@/components/RecommendationDetail";
import { SafetyAlertBanner } from "@/components/SafetyAlertBanner";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

/**
 * 「今日行くべき？」判定カード。
 *
 * スコア・一言コメント・項目別評価をまとめて表示し、
 * 「詳細を見る」で判定理由の内訳を開閉できる。
 */
export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [open, setOpen] = useState(false);
  const { score, comment, reason, commentSource, safety, previousDayBonus } = recommendation;
  const isDanger = safety.level === "danger";

  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="hisui-gradient">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
          <div className="space-y-0.5">
            <CardTitle className="text-base">今日行くべき？</CardTitle>
            <p className="text-xs text-muted-foreground">ヒスイ拾いのおすすめ度</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            {open ? "閉じる" : "詳細を見る"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
            />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 安全警告はスコアより上に置き、最優先で目に入るようにする */}
          <SafetyAlertBanner safety={safety} />

          <RecommendationScore score={score} />

          <div className="space-y-1.5">
            <p className="text-sm leading-relaxed text-foreground/90">{comment}</p>
            {commentSource === "ai" && !isDanger && (
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                AIによるコメント
              </p>
            )}
          </div>

          {previousDayBonus?.applied && (
            <div className="flex gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm leading-relaxed text-foreground/85">
                {previousDayBonus.message}
              </p>
            </div>
          )}

          <RecommendationReason factors={reason.factors} />

          {open && (
            <RecommendationDetail factors={reason.factors} scoreValue={score.value} />
          )}
        </CardContent>
      </div>
    </Card>
  );
}
