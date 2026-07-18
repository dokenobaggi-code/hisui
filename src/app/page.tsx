import { Waves } from "lucide-react";
import { RecommendationCard } from "@/components/RecommendationCard";
import { WaveCard } from "@/components/WaveCard";
import { WeatherCard } from "@/components/WeatherCard";
import { ScoreChart } from "@/components/ScoreChart";
import { TipCard } from "@/components/TipCard";
import { RefreshButton } from "@/components/RefreshButton";
import { getHomeData } from "@/services/home";
import { getTipOfDay } from "@/lib/tips";
import { formatJaDateTime } from "@/lib/utils";
import { location } from "@/lib/config";

// Notionの最新データを都度反映するため動的レンダリング。
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { record, trend, source, recommendation } = await getHomeData();
  const tip = getTipOfDay(record.date);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Waves className="h-7 w-7 text-primary" />
            今日のヒスイ拾い予報
          </h1>
          <p className="text-sm text-muted-foreground">{location.name}</p>
        </div>
        <RefreshButton />
      </section>

      {/* 一目で判断できるよう、総合判定を最上部に配置する */}
      <RecommendationCard recommendation={recommendation} />

      <div className="grid gap-6 sm:grid-cols-2">
        <WaveCard wave={record.wave} />
        <WeatherCard weather={record.weather} />
      </div>

      <ScoreChart data={trend} />

      <TipCard tip={tip} />

      <p className="text-right text-xs text-muted-foreground">
        最終更新: {formatJaDateTime(record.createdAt, location.timezone)}
        {source === "live" && "（リアルタイム計算・未保存）"}
      </p>
    </div>
  );
}
