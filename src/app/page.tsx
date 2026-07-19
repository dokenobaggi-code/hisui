import { JadePair } from "@/components/JadeIllustration";
import { RecommendationCard } from "@/components/RecommendationCard";
import { WaveCard } from "@/components/WaveCard";
import { WeatherCard } from "@/components/WeatherCard";
import { WeeklyForecast } from "@/components/WeeklyForecast";
import { PastWaves } from "@/components/PastWaves";
import { AppraisalSchedule } from "@/components/AppraisalSchedule";
import { ScoreChart } from "@/components/ScoreChart";
import { TipCard } from "@/components/TipCard";
import { RefreshButton } from "@/components/RefreshButton";
import { getHomeData } from "@/services/home";
import { getTipOfDay } from "@/lib/tips";
import { formatJaDateTime, todayIsoInJst } from "@/lib/utils";
import { location } from "@/lib/config";

// Notionの最新データを都度反映するため動的レンダリング。
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { record, trend, source, recommendation, weekly, pastWaves } = await getHomeData();
  const tip = getTipOfDay(record.date);
  const today = todayIsoInJst(location.timezone);

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      {/* 表題 */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <JadePair className="h-16 w-24 shrink-0" />
          <div className="space-y-1.5">
            <span className="label-en">Hisui Beach · Toyama</span>
            <h1 className="jade-text text-3xl font-bold sm:text-4xl">ヒスイ拾い予報</h1>
            <p className="text-xs tracking-wider text-muted-foreground">{location.name}</p>
          </div>
        </div>
        <RefreshButton />
      </section>

      <RecommendationCard recommendation={recommendation} />

      <section className="space-y-5">
        <div className="rule-left space-y-1">
          <span className="label-en">Conditions</span>
          <h2 className="text-lg font-bold">今日の海と空</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <WaveCard wave={record.wave} />
          <WeatherCard weather={record.weather} />
        </div>
      </section>

      <WeeklyForecast days={weekly} />

      <section className="space-y-5">
        <div className="rule-left space-y-1">
          <span className="label-en">Past week</span>
          <h2 className="text-lg font-bold">ヒスイの拡散ぐあい</h2>
        </div>
        <PastWaves summary={pastWaves} />
      </section>

      <section className="space-y-5">
        <div className="rule-left space-y-1">
          <span className="label-en">Stone appraisal</span>
          <h2 className="text-lg font-bold">拾った石を鑑定してもらう</h2>
        </div>
        <AppraisalSchedule todayIso={today} />
      </section>

      <section className="space-y-5">
        <div className="rule-left space-y-1">
          <span className="label-en">Records</span>
          <h2 className="text-lg font-bold">これまでの推移</h2>
        </div>
        <ScoreChart data={trend} />
      </section>

      <TipCard tip={tip} />

      <p className="border-t border-border/70 pt-6 text-right text-[11px] tracking-wider text-muted-foreground">
        最終更新 {formatJaDateTime(record.createdAt, location.timezone)}
        {source === "live" && "（リアルタイム計算・未保存）"}
      </p>
    </div>
  );
}
