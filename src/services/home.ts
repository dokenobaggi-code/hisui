/**
 * トップページ用のデータ集約。
 * 保存済みレコード（Notion）を優先し、無ければライブ計算にフォールバックする。
 * これにより初回Cron実行前や環境変数未設定でも画面が壊れない。
 *
 * 潮位はNotionに保存していないため、表示のたびにライブ取得して
 * 「今日行くべき？」判定に用いる（取得失敗時は中立評価にフォールバック）。
 */
import { buildDailyRecord } from "@/services/pipeline";
import { getLatestRecord, getScoreTrend } from "@/services/notion";
import { fetchTideInfo } from "@/services/tide";
import { fetchPreviousDayInfo } from "@/services/previousDay";
import { evaluateRecommendation } from "@/services/recommendation";
import type { DailyRecord, ScoreTrendPoint } from "@/types";
import type { PreviousDayInfo, Recommendation, TideInfo } from "@/types/recommendation";

export interface HomeData {
  record: DailyRecord;
  trend: ScoreTrendPoint[];
  /** "notion": 保存済み / "live": その場で計算 */
  source: "notion" | "live";
  /** 「今日行くべき？」判定 */
  recommendation: Recommendation;
  tide: TideInfo;
  /** 前日の海況 */
  previousDay: PreviousDayInfo;
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

  const source: HomeData["source"] = record ? "notion" : "live";

  // フォールバック: その場で観測＋判定（保存はしない）
  const resolved = record ?? (await buildDailyRecord());

  // 潮位・前日海況はライブ取得（いずれも内部で例外を握りつぶし、失敗時は既定値を返す）
  const [tide, previousDay] = await Promise.all([fetchTideInfo(), fetchPreviousDayInfo()]);

  const recommendation = evaluateRecommendation(
    { wave: resolved.wave, weather: resolved.weather, tide, previousDay },
    // 既存のAI判定理由があればコメントとして活用する
    { aiComment: resolved.judgement.reason },
  );

  return {
    record: resolved,
    trend: trend.length > 0 ? trend : [{ date: resolved.date, score: resolved.judgement.score }],
    source,
    recommendation,
    tide,
    previousDay,
  };
}
