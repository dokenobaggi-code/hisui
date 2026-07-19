import { Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PastWaveSummary } from "@/services/pastWaves";

/** 「7/12」形式と曜日。 */
function label(dateIso: string): { day: string; weekday: string } {
  const date = new Date(`${dateIso}T12:00:00+09:00`);
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

/** 波高に応じた棒の色。荒れた日ほど濃い珊瑚色に寄せる。 */
function barTone(height: number | null): string {
  if (height === null) return "bg-muted";
  if (height >= 2.0) return "bg-rose-500";
  if (height >= 1.2) return "bg-orange-500";
  if (height >= 0.6) return "bg-teal-500";
  return "bg-sky-400";
}

/**
 * 過去1週間の波の記録。
 * 荒れた日ほどヒスイが浜に拡散・打ち上げられる、という見立てで表示する。
 */
export function PastWaves({ summary }: { summary: PastWaveSummary }) {
  if (summary.days.length === 0) return null;

  // バーの高さを正規化（最大2.5mを100%目安に）
  const scaleMax = Math.max(2.5, summary.peak ?? 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-sky-500" />
          <CardTitle>過去1週間の波（ヒスイ拡散の目安）</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-1.5 sm:gap-3">
          {summary.days.map((d) => {
            const { day, weekday } = label(d.date);
            const h = d.maxWaveHeight;
            const heightPct = h !== null ? Math.max(6, (h / scaleMax) * 100) : 6;

            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {h !== null ? `${h.toFixed(1)}` : "—"}
                </span>
                <div className="flex h-24 w-full items-end justify-center">
                  <div
                    className={cn("w-full max-w-[26px] rounded-t-md transition-all", barTone(h))}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium">{day}</span>
                <span className="text-[9px] text-muted-foreground">{weekday}</span>
              </div>
            );
          })}
        </div>

        <p className="rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-foreground/80">
          {summary.comment}
        </p>
      </CardContent>
    </Card>
  );
}
