import { CloudRain, Thermometer, CloudSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeatherInfo } from "@/types";

/** 現在の天気カード。 */
export function WeatherCard({ weather }: { weather: WeatherInfo }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <CloudSun className="h-5 w-5 text-amber-500" />
        <CardTitle>現在の天気</CardTitle>
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
          <div className="rounded-lg bg-muted/50 p-3">
            <Thermometer className="mx-auto h-4 w-4 text-rose-500" />
            <div className="mt-1 text-xs text-muted-foreground">最高</div>
            <div className="font-semibold">{weather.highTemperature.toFixed(0)}℃</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <Thermometer className="mx-auto h-4 w-4 text-sky-500" />
            <div className="mt-1 text-xs text-muted-foreground">最低</div>
            <div className="font-semibold">{weather.lowTemperature.toFixed(0)}℃</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <CloudRain className="mx-auto h-4 w-4 text-blue-500" />
            <div className="mt-1 text-xs text-muted-foreground">降水確率</div>
            <div className="font-semibold">{weather.rainProbability.toFixed(0)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
