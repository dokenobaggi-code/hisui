import { ExternalLink, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { APPRAISAL_CALENDAR_URL, getAppraisalWeek } from "@/lib/appraisal";

/** 曜日ラベル。 */
function dayLabel(dateIso: string): { day: string; weekday: string; tone: string } {
  const date = new Date(`${dateIso}T12:00:00+09:00`);
  const day = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    day: "numeric",
  }).format(date);
  const weekday = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(date);
  const tone =
    weekday === "土"
      ? "text-sky-700 dark:text-sky-400"
      : weekday === "日"
        ? "text-rose-700 dark:text-rose-400"
        : "text-muted-foreground";
  return { day, weekday, tone };
}

/**
 * フォッサマグナミュージアム「石の鑑定」の週間見込み。
 * おすすめ度とは連動しない、独立した参考情報。
 */
export function AppraisalSchedule({ todayIso }: { todayIso: string }) {
  const week = getAppraisalWeek(todayIso, 7);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Gem className="h-5 w-5 text-primary" />
          <CardTitle>ヒスイ鑑定カレンダー</CardTitle>
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          糸魚川・フォッサマグナミュージアムで拾った石を無料鑑定してもらえます（今週の見込み）。
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <ul className="grid grid-cols-7 gap-1.5">
          {week.map((d) => {
            const { day, weekday, tone } = dayLabel(d.date);
            return (
              <li
                key={d.date}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center",
                  d.likelyOpen
                    ? "border-primary/30 bg-accent/60"
                    : "border-border/60 bg-muted/30",
                  d.isToday && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                )}
              >
                <span className={cn("text-[10px]", tone)}>{weekday}</span>
                <span className="text-sm font-bold">{day}</span>
                <span
                  className={cn(
                    "text-base leading-none",
                    d.likelyOpen ? "text-primary" : "text-muted-foreground/50",
                  )}
                  aria-label={d.likelyOpen ? "鑑定あり見込み" : "鑑定なし見込み"}
                >
                  {d.likelyOpen ? "◎" : "×"}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          ◎＝鑑定あり見込み（主に土日） ／ ×＝なし見込み。
          臨時鑑定や休館で変わることがあります。おでかけ前に
          <a
            href={APPRAISAL_CALENDAR_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="mx-0.5 inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
          >
            公式カレンダー
            <ExternalLink className="h-3 w-3" />
          </a>
          で必ずご確認ください（鑑定券は当日9:00配布・抽選）。
        </p>
      </CardContent>
    </Card>
  );
}
