/**
 * 環境変数の一元管理。
 * ハードコード禁止のため、外部設定はすべてここ経由で参照する。
 */

/** 必須の環境変数を取得。無ければ明示的にエラーにする（実行時のみ検証）。 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `環境変数 ${key} が未設定です。.env.local または Vercel の環境変数を確認してください。`,
    );
  }
  return value;
}

/** 任意の環境変数を既定値付きで取得。 */
function optionalEnv(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.trim() !== "" ? value : fallback;
}

/** 対象地点（ヒスイ海岸: 富山県朝日町・宮崎海岸周辺）の既定座標。 */
export const location = {
  latitude: Number(optionalEnv("HISUI_LATITUDE", "36.945")),
  longitude: Number(optionalEnv("HISUI_LONGITUDE", "137.545")),
  timezone: optionalEnv("HISUI_TIMEZONE", "Asia/Tokyo"),
  name: "ヒスイ海岸（富山県朝日町・宮崎海岸周辺）",
} as const;

/** OpenAI 設定（サーバー専用）。 */
export const openaiConfig = {
  get apiKey() {
    return requireEnv("OPENAI_API_KEY");
  },
  get model() {
    return optionalEnv("OPENAI_MODEL", "gpt-4o-mini");
  },
};

/** Notion 設定（サーバー専用）。 */
export const notionConfig = {
  get token() {
    return requireEnv("NOTION_TOKEN");
  },
  get databaseId() {
    return requireEnv("NOTION_DATABASE_ID");
  },
};

/** Cron 保護用シークレット（サーバー専用）。 */
export const cronConfig = {
  get secret() {
    return requireEnv("CRON_SECRET");
  },
};

/** Notion データベースのプロパティ名。DB側の列名と一致させる。 */
export const NOTION_PROPS = {
  Date: "Date",
  WaveHeight: "WaveHeight",
  WavePeriod: "WavePeriod",
  WindDirection: "WindDirection",
  WindSpeed: "WindSpeed",
  Weather: "Weather",
  Temperature: "Temperature",
  HighTemperature: "HighTemperature",
  LowTemperature: "LowTemperature",
  RainProbability: "RainProbability",
  AIScore: "AIScore",
  Recommendation: "Recommendation",
  Reason: "Reason",
  CreatedAt: "CreatedAt",
} as const;
