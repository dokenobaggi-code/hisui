"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScoreTrendPoint } from "@/types";

interface ScoreChartProps {
  data: ScoreTrendPoint[];
}

/** M/D 形式の短いラベル。 */
function shortLabel(dateIso: string): string {
  const [, m, d] = dateIso.split("-");
  return m && d ? `${Number(m)}/${Number(d)}` : dateIso;
}

/** 過去7日間のおすすめ度推移グラフ。 */
export function ScoreChart({ data }: ScoreChartProps) {
  const chartData = data.map((p) => ({ label: shortLabel(p.date), score: p.score }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>過去7日間のおすすめ度推移</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            まだ十分な履歴がありません。日次更新が実行されると表示されます。
          </p>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="jadeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 48% 45%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(160 48% 45%)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value: number) => [`${value} / 5`, "おすすめ度"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                    color: "hsl(var(--card-foreground))",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(160 48% 40%)"
                  strokeWidth={2.5}
                  fill="url(#jadeFill)"
                  dot={{ r: 3, fill: "hsl(160 48% 40%)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
