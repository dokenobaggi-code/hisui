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
    <Card className="overflow-hidden">
      <div className="washi">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
          <div className="space-y-1.5">
            <span className="label-en">Today&apos;s rating</span>
            <CardTitle className="jade-text text-xl">今日のおすすめ度</CardTitle>
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

        <CardContent className="space-y-6 pb-7">
          {/* 安全警告はスコアより上に置き、最優先で目に入るようにする */}
          <SafetyAlertBanner safety={safety} />

          <RecommendationScore score={score} />

          <div className="space-y-2 rounded-2xl bg-background/60 px-4 py-3">
            <p className="text-sm leading-[1.9] text-foreground/90">{comment}</p>
            {commentSource === "ai" && !isDanger && (
              <p className="flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                AIによる所見
              </p>
            )}
          </div>

          {previousDayBonus?.applied && (
            <div className="flex gap-2.5 rounded-2xl border border-primary/30 bg-accent px-4 py-3">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-[1.9] text-foreground/85">
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
