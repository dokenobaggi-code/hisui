import Link from "next/link";
import { Backpack, ArrowRight } from "lucide-react";
import { JadePair } from "@/components/JadeIllustration";
import { RecommendationCard } from "@/components/RecommendationCard";
import { WaveCard } from "@/components/WaveCard";
import { WeatherCard } from "@/components/WeatherCard";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { PastWaves } from "@/components/PastWaves";
import { AppraisalSchedule } from "@/components/AppraisalSchedule";
import { SectionHeading } from "@/components/SectionHeading";
import { TipCard } from "@/components/TipCard";
import { RefreshButton } from "@/components/RefreshButton";
import { getHomeData } from "@/services/home";
import { getTipOfDay } from "@/lib/tips";
import { formatJaDateTime, todayIsoInJst } from "@/lib/utils";
import { location } from "@/lib/config";

// Notionの最新データを都度反映するため動的レンダリング。
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { record, source, recommendation, weekly, pastWaves } = await getHomeData();
  const tip = getTipOfDay(record.date);
  const today = todayIsoInJst(location.timezone);

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {/* 表題 */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <JadePair className="h-16 w-24 shrink-0" />
          <div className="space-y-1.5">
            <span className="label-en font-hand block">Hisui Beach · Toyama</span>
            <h1 className="jade-text font-round text-3xl font-bold sm:text-4xl">ヒスイ拾いナビ</h1>
            <p className="text-xs tracking-wider text-muted-foreground">{location.name}</p>
          </div>
        </div>
        <RefreshButton />
      </section>

      <RecommendationCard recommendation={recommendation} />

      <section className="space-y-5">
        <SectionHeading en="Conditions">今日の海と空</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          <WaveCard wave={record.wave} />
          <WeatherCard weather={record.weather} />
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading en="This week">週間おすすめ度</SectionHeading>
        <WeeklyForecast days={weekly} />
      </section>

      <section className="space-y-5">
        <SectionHeading en="Past week">ヒスイの拡散ぐあい</SectionHeading>
        <PastWaves summary={pastWaves} />
      </section>

      <section className="space-y-5">
        <SectionHeading en="Stone appraisal">拾った石を鑑定してもらう</SectionHeading>
        <AppraisalSchedule todayIso={today} />
      </section>

      {/* 服装・持ち物への誘導 */}
      <Link
        href="/packing"
        className="lift flex items-center gap-4 rounded-2xl border border-primary/25 bg-accent/50 p-5 transition-colors hover:bg-accent"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Backpack className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-round font-bold">服装・持ち物をチェック</span>
          <span className="block text-xs text-muted-foreground">
            夏・冬の服装、あると便利な道具はこちら
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
      </Link>

      <TipCard tip={tip} />

      <p className="border-t border-border/60 pt-6 text-right text-[11px] tracking-wider text-muted-foreground">
        最終更新 {formatJaDateTime(record.createdAt, location.timezone)}
        {source === "live" && "（リアルタイム計算・未保存）"}
      </p>
    </div>
  );
}
