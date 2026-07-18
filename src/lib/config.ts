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

/**
 * 楽天ウェブサービス（楽天トラベル空室検索API）設定。
 *
 * すべて任意。未設定の場合はリアルタイム空室表示のみ無効化され、
 * 周辺スポットの静的な掲載は通常どおり動作する。
 *
 * applicationId と accessKey の両方が必要（accessKey は2024年以降の必須項目）。
 * https://webservice.rakuten.co.jp/app/list で確認できる。
 */
export const rakutenConfig = {
  get applicationId(): string | null {
    return process.env.RAKUTEN_APPLICATION_ID?.trim() || null;
  },
  get accessKey(): string | null {
    return process.env.RAKUTEN_ACCESS_KEY?.trim() || null;
  },
  /** 楽天アフィリエイトID（任意）。設定するとリンクがアフィリエイト経由になる。 */
  get affiliateId(): string | null {
    return process.env.RAKUTEN_AFFILIATE_ID?.trim() || null;
  },
  /** 空室検索が利用可能か */
  get isEnabled(): boolean {
    return this.applicationId !== null && this.accessKey !== null;
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
