"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshTodayAction } from "@/app/actions";
import { cn } from "@/lib/utils";

/** 手動で日次パイプラインを実行するボタン（Server Action呼び出し）。 */
export function RefreshButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await refreshTodayAction();
      setMessage(result.message);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
        <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
        {isPending ? "更新中…" : "今すぐ更新"}
      </Button>
      {message && <span className="text-xs text-muted-foreground">{message}</span>}
    </div>
  );
}
