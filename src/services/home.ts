/**
 * トップページ用のデータ集約。
 * 保存済みレコード（Notion）を優先し、無ければライブ計算にフォールバックする。
 * これにより初回Cron実行前や環境変数未設定でも画面が壊れない。
 */
import { buildDailyRecord } from "@/services/pipeline";
import { getLatestRecord, getScoreTrend } from "@/services/notion";
import type { DailyRecord, ScoreTrendPoint } from "@/types";

export interface HomeData {
  record: DailyRecord;
  trend: ScoreTrendPoint[];
  /** "notion": 保存済み / "live": その場で計算 */
  source: "notion" | "live";
}

export async function getHomeData(): Promise<HomeData> {
  let record: DailyRecord | null = null;
  let trend: ScoreTrendPoint[] = [];

  try {
    record = await getLatestRecord();
    trend = await getScoreTrend(7);
  } catch (error) {
    console.error("[home] Notion取得に失敗。ライブ計算にフォールバックします:", error);
  }

  if (record) {
    return { record, trend, source: "notion" };
  }

  // フォールバック: その場で観測＋判定（保存はしない）
  const live = await buildDailyRecord();
  return {
    record: live,
    trend: trend.length > 0 ? trend : [{ date: live.date, score: live.judgement.score }],
    source: "live",
  };
}
