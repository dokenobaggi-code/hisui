import type { Metadata } from "next";
import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryTable } from "@/components/HistoryTable";
import { getHistory } from "@/services/notion";
import type { HistoryRow } from "@/types";

export const metadata: Metadata = {
  title: "履歴",
  description: "過去のヒスイ拾いおすすめ度・波高・風速・天気・理由の一覧。",
};

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  let rows: HistoryRow[] = [];
  let errored = false;

  try {
    rows = await getHistory(60);
  } catch (error) {
    console.error("[history] Notion取得に失敗:", error);
    errored = true;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2 border-b border-border/70 pb-8">
        <span className="label-en">Records</span>
        <h1 className="flex items-center gap-2.5 text-2xl">
          <History className="h-5 w-5 text-primary" />
          おすすめ度の履歴
        </h1>
        <p className="text-xs tracking-wider text-muted-foreground">
          日次で保存されたヒスイ拾いおすすめ度の記録です。
        </p>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-2">
          {rows.length > 0 ? (
            <HistoryTable rows={rows} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {errored
                ? "履歴の取得に失敗しました。Notionの環境変数設定を確認してください。"
                : "まだ履歴がありません。日次更新が実行されると記録が表示されます。"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
