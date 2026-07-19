/**
 * アプリ全体で共有するドメイン型。
 * サービス層・UI・APIはすべてここで定義した型を参照する。
 */

/** 波情報（Open-Meteo Marine API 由来） */
export interface WaveInfo {
  /** 有義波高 (m) */
  waveHeight: number;
  /** 波周期 (s) */
  wavePeriod: number;
  /** 波向き（度: 0=北, 90=東） */
  waveDirection: number;
  /** 風向き（度: 0=北, 90=東） */
  windDirection: number;
  /** 風速 (m/s) */
  windSpeed: number;
}

/** 天気予報（Open-Meteo Forecast API 由来） */
export interface WeatherInfo {
  /** 天気の日本語表現（例: 晴れ, くもり, 雨） */
  weather: string;
  /** WMO weather code */
  weatherCode: number;
  /** 現在（またはその日の代表）気温 (℃) */
  temperature: number;
  /** 最高気温 (℃) */
  highTemperature: number;
  /** 最低気温 (℃) */
  lowTemperature: number;
  /** 降水確率 (%) */
  rainProbability: number;
  /** その日のUVインデックス最大値（0〜11+）。取得できない場合は null */
  uvIndexMax: number | null;
}

/** AI判定結果 */
export interface AiJudgement {
  /** おすすめ度 1〜5 */
  score: number;
  /** おすすめ理由（日本語） */
  reason: string;
}

/** 1日分の観測＋判定をまとめたレコード */
export interface DailyRecord {
  /** ISO日付 (YYYY-MM-DD) */
  date: string;
  wave: WaveInfo;
  weather: WeatherInfo;
  judgement: AiJudgement;
  /** レコード生成時刻 (ISO 8601) */
  createdAt: string;
}

/** Notionから読み出した履歴行（UI表示用） */
export interface HistoryRow {
  id: string;
  date: string;
  score: number;
  waveHeight: number | null;
  windSpeed: number | null;
  weather: string;
  reason: string;
}

/** おすすめ度の星表現に使う推移データ点 */
export interface ScoreTrendPoint {
  date: string;
  score: number;
}
