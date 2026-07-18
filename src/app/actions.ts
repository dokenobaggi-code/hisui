"use server";

import { revalidatePath } from "next/cache";
import { runDailyPipeline } from "@/services/pipeline";

/**
 * 手動更新用の Server Action。
 * ①〜④を実行してNotionへ保存し、トップ・履歴を再検証する。
 * 管理用途を想定（UIのボタンから呼び出し）。
 */
export async function refreshTodayAction(): Promise<{ ok: boolean; message: string }> {
  try {
    const record = await runDailyPipeline();
    revalidatePath("/");
    revalidatePath("/history");
    return {
      ok: true,
      message: `更新しました（${record.date}・おすすめ度 ${record.judgement.score}/5）`,
    };
  } catch (error) {
    console.error("[action] 手動更新に失敗:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "更新に失敗しました。",
    };
  }
}
