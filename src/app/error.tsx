"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * トップページのエラー表示。
 * 外部API（Open-Meteo / Notion / OpenAI）が同時に失敗した場合などに表示される。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page] レンダリング中にエラーが発生しました:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-destructive/30">
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>データを表示できませんでした</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            波・天気データの取得中に問題が発生しました。通信環境が不安定か、データ提供元が一時的に応答していない可能性があります。しばらく待ってから再度お試しください。
          </p>

          {error.digest && (
            <p className="rounded-md bg-muted/60 px-3 py-2 font-mono text-xs text-muted-foreground">
              エラーID: {error.digest}
            </p>
          )}

          <Button onClick={reset} variant="default" size="sm">
            <RefreshCw className="h-4 w-4" />
            再試行する
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
