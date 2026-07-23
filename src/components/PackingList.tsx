"use client";

import { useState } from "react";
import { Check, Footprints, Shirt, Shovel, Sun, Snowflake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PACKING, TOOLS_NOTE, seasonOf, type Season } from "@/lib/packing";

const GROUP_ICON: Record<string, typeof Shirt> = {
  服装: Shirt,
  靴: Footprints,
};

/**
 * 持ち物リスト。
 * 今日の月から夏/冬を初期選択し、タブで切り替えられる。
 */
export function PackingList({ todayIso }: { todayIso: string }) {
  const [season, setSeason] = useState<Season>(seasonOf(todayIso));
  const data = PACKING[season];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>ヒスイ拾いの持ち物</CardTitle>

          {/* 季節切り替え */}
          <div className="flex rounded-full bg-muted p-0.5">
            {(["summer", "winter"] as const).map((s) => {
              const Icon = s === "summer" ? Sun : Snowflake;
              const active = season === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeason(s)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-colors",
                    active
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {PACKING[s].label}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {data.groups.map((group) => {
            const Icon = GROUP_ICON[group.title] ?? Shirt;
            return (
              <div key={group.title} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">{group.title}</span>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.label} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-snug">
                        {item.label}
                        {item.recommended && (
                          <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                            おすすめ
                          </span>
                        )}
                        {item.note && (
                          <span className="block text-xs text-muted-foreground">{item.note}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {data.caption && (
          <p className="text-xs text-muted-foreground">{data.caption}</p>
        )}

        {/* 道具（季節共通） */}
        <div className="flex items-start gap-2.5 rounded-xl bg-muted/50 p-3">
          <Shovel className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <span className="text-sm font-bold">道具</span>
            <p className="text-xs leading-relaxed text-foreground/80">{TOOLS_NOTE}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
