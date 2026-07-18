import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SafetyAlert } from "@/types/recommendation";

/**
 * 安全アラートのバナー。
 * danger の場合はスコアより上に強く表示し、行動を止めることを最優先にする。
 */
export function SafetyAlertBanner({ safety }: { safety: SafetyAlert }) {
  if (safety.level === "none") return null;

  const isDanger = safety.level === "danger";

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        isDanger
          ? "border-destructive/40 bg-destructive/10"
          : "border-amber-500/40 bg-amber-500/10",
      )}
    >
      {isDanger ? (
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
      ) : (
        <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      )}
      <div className="space-y-1">
        <p
          className={cn(
            "text-sm font-bold",
            isDanger ? "text-destructive" : "text-amber-700 dark:text-amber-300",
          )}
        >
          {safety.title}
        </p>
        <p className="text-sm leading-relaxed text-foreground/85">{safety.message}</p>
      </div>
    </div>
  );
}
