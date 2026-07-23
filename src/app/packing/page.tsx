import type { Metadata } from "next";
import { Backpack } from "lucide-react";
import { PackingList } from "@/components/PackingList";
import { todayIsoInJst } from "@/lib/utils";
import { location } from "@/lib/config";

export const metadata: Metadata = {
  title: "服装・持ち物",
  description:
    "ヒスイ海岸でのヒスイ拾いに向けた、夏・冬それぞれの服装と持ち物、あると便利な道具のガイド。",
};

export default function PackingPage() {
  const today = todayIsoInJst(location.timezone);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 border-b border-border/60 pb-8">
        <span className="label-en font-hand block">Packing list</span>
        <h1 className="flex items-center gap-2.5 text-2xl">
          <Backpack className="h-6 w-6 text-primary" />
          服装・持ち物
        </h1>
        <p className="text-xs tracking-wider text-muted-foreground">
          季節に合わせた服装と、あると便利な道具をまとめました。
        </p>
      </div>

      <PackingList todayIso={today} />

      <p className="rounded-2xl bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        濡れても大丈夫な服装がおすすめです。夏でも波にさらわれないよう、深い場所には入らないでください。
      </p>
    </div>
  );
}
