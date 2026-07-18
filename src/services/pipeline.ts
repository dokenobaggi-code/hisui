/**
 * 日次パイプライン。
 * ①波情報取得 → ②天気取得 → ③AI判定 → ④Notion保存 の流れを1関数に集約。
 * Cron と 手動更新（Server Action）から共通で呼び出す。
 */
import { judgeRecommendation } from "@/services/ai";
import { saveDailyRecord } from "@/services/notion";
import { fetchWaveInfo } from "@/services/wave";
import { fetchWeatherInfo } from "@/services/weather";
import { location } from "@/lib/config";
import { todayIsoInJst } from "@/lib/utils";
import type { DailyRecord } from "@/types";

/** 観測＋判定を実行して DailyRecord を組み立てる（保存はしない）。 */
export async function buildDailyRecord(): Promise<DailyRecord> {
  // ①②並行取得
  const [wave, weather] = await Promise.all([fetchWaveInfo(), fetchWeatherInfo()]);
  // ③AI判定
  const judgement = await judgeRecommendation(wave, weather);

  return {
    date: todayIsoInJst(location.timezone),
    wave,
    weather,
    judgement,
    createdAt: new Date().toISOString(),
  };
}

/** ①〜④を実行し、保存済みレコードを返す。 */
export async function runDailyPipeline(): Promise<DailyRecord> {
  const record = await buildDailyRecord();
  // ④Notion保存
  await saveDailyRecord(record);
  return record;
}
