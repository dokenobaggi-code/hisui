import { Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { degreesToCompassJa } from "@/lib/utils";
import type { WaveInfo } from "@/types";

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

/** 現在の波情報カード。 */
export function WaveCard({ wave }: { wave: WaveInfo }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Waves className="h-5 w-5 text-sky-500" />
        <CardTitle>現在の波情報</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Metric label="波高" value={wave.waveHeight.toFixed(1)} unit="m" />
        <Metric label="波周期" value={wave.wavePeriod.toFixed(1)} unit="s" />
        <Metric
          label="風速"
          value={wave.windSpeed.toFixed(1)}
          unit="m/s"
        />
        <Metric
          label="風向き"
          value={degreesToCompassJa(wave.windDirection)}
        />
      </CardContent>
    </Card>
  );
}
