import { CloudRain, Thermometer, CloudSun, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { describeUvIndex } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { WeatherInfo } from "@/types";

const UV_TONE: Record<ReturnType<typeof describeUvIndex>["tone"], string> = {
  low: "text-emerald-600 dark:text-emerald-400",
  moderate: "text-amber-600 dark:text-amber-400",
  high: "text-orange-600 dark:text-orange-400",
  veryhigh: "text-rose-600 dark:text-rose-400",
};

/** 現在の天気カード。 */
export function WeatherCard({ weather }: { weather: WeatherInfo }) {
  const uv = weather.uvIndexMax !== null ? describeUvIndex(weather.uvIndexMax) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <CloudSun className="h-5 w-5 text-amber-500" />
        <CardTitle>今日の天気</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold">{weather.weather || "—"}</span>
          <span className="text-3xl font-bold text-primary">
            {weather.temperature.toFixed(0)}
            <span className="text-base font-medium text-muted-foreground">℃</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-muted/50 p-3">
            <Thermometer className="mx-auto h-4 w-4 text-rose-500" />
            <div className="mt-1 text-xs text-muted-foreground">最高</div>
            <div className="font-semibold">{weather.highTemperature.toFixed(0)}℃</div>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <Thermometer className="mx-auto h-4 w-4 text-sky-500" />
            <div className="mt-1 text-xs text-muted-foreground">最低</div>
            <div className="font-semibold">{weather.lowTemperature.toFixed(0)}℃</div>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <CloudRain className="mx-auto h-4 w-4 text-blue-500" />
            <div className="mt-1 text-xs text-muted-foreground">降水確率</div>
            <div className="font-semibold">{weather.rainProbability.toFixed(0)}%</div>
          </div>
        </div>

        {/* 紫外線 */}
        {uv && weather.uvIndexMax !== null && (
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <Sun className={cn("h-5 w-5 shrink-0", UV_TONE[uv.tone])} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-muted-foreground">紫外線</span>
                <span className={cn("font-bold", UV_TONE[uv.tone])}>
                  {uv.level}
                </span>
                <span className="text-xs text-muted-foreground">
                  （UV {weather.uvIndexMax.toFixed(0)}）
                </span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/80">{uv.advice}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
