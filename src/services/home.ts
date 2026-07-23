/**
 * トップページ用のデータ集約。
 * 保存済みレコード（Notion）を優先し、無ければライブ計算にフォールバックする。
 * これにより初回Cron実行前や環境変数未設定でも画面が壊れない。
 */
import { buildDailyRecord } from "@/services/pipeline";
import { getLatestRecord } from "@/services/notion";
import { fetchPreviousDayInfo } from "@/services/previousDay";
import { fetchWeeklyForecast, type DailyForecast } from "@/services/forecast";
import { fetchPastWeekWaves, type PastWaveSummary } from "@/services/pastWaves";
import { evaluateRecommendation } from "@/services/recommendation";
import type { DailyRecord } from "@/types";
import type { PreviousDayInfo, Recommendation } from "@/types/recommendation";

export interface HomeData {
  record: DailyRecord;
  /** "notion": 保存済み / "live": その場で計算 */
  source: "notion" | "live";
  /** 今日のおすすめ度判定 */
  recommendation: Recommendation;
  /** 前日の海況 */
  previousDay: PreviousDayInfo;
  /** 向こう1週間のおすすめ度 */
  weekly: DailyForecast[];
  /** 過去1週間の波（ヒスイ拡散の目安） */
  pastWaves: PastWaveSummary;
}

export async function getHomeData(): Promise<HomeData> {
  let record: DailyRecord | null = null;

  try {
    record = await getLatestRecord();
  } catch (error) {
    console.error("[home] Notion取得に失敗。ライブ計算にフォールバックします:", error);
  }

  const source: HomeData["source"] = record ? "notion" : "live";

  // フォールバック: その場で観測＋判定（保存はしない）
  const resolved = record ?? (await buildDailyRecord());

  // 前日海況・週間予報・過去の波はライブ取得
  //（いずれも内部で例外を握りつぶし、失敗時は既定値を返す）
  const [previousDay, weekly, pastWaves] = await Promise.all([
    fetchPreviousDayInfo(),
    fetchWeeklyForecast(),
    fetchPastWeekWaves(),
  ]);

  const recommendation = evaluateRecommendation(
    { wave: resolved.wave, weather: resolved.weather, previousDay },
    // 既存のAI判定理由があればコメントとして活用する
    { aiComment: resolved.judgement.reason },
  );

  return {
    record: resolved,
    source,
    recommendation,
    previousDay,
    weekly,
    pastWaves,
  };
}
