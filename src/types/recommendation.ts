/**
 * 「今日行くべき？」おすすめ度判定に関する型定義。
 *
 * 判定ロジック（services/recommendation.ts）とUI（components/Recommendation*.tsx）は
 * すべてこの型を介してやり取りする。ロジック差し替え・AIコメント追加・
 * 過去データ比較などの拡張時も、この型を拡張するだけで済むようにしている。
 */

/** 評価対象の項目キー。項目を増やす場合はここに追加する。 */
export type FactorKey = "wave" | "wind" | "weather" | "temperature" | "previousDay";

/** 各項目の4段階評価。 */
export type Grade = "◎" | "○" | "△" | "×";

/** おすすめ度の星（1〜5）。 */
export type StarLevel = 1 | 2 | 3 | 4 | 5;

/** スコア帯を表すトーン。配色・アイコンの決定に使う。 */
export type RecommendationTone = "great" | "good" | "fair" | "poor" | "bad";

/**
 * 1項目分の評価結果。
 * 例: { key: "wave", label: "波", grade: "◎", value: "0.1 m", score: 85, ... }
 */
export interface WeatherEvaluation {
  key: FactorKey;
  /** 表示ラベル（波・風・天気・潮位・気温） */
  label: string;
  /** 4段階評価 */
  grade: Grade;
  /** この項目の素点（0〜100） */
  score: number;
  /** 総合スコアへの寄与度（重み。合計100） */
  weight: number;
  /** 実測値の表示用文字列（例: "0.1 m"）。取得できない場合は "—" */
  value: string;
  /** なぜこの評価なのかの一文（詳細表示に使用） */
  detail: string;
}

/** 総合スコアと、その見せ方に必要な情報。 */
export interface RecommendationScore {
  /** 0〜100点 */
  value: number;
  /** 1〜5の星 */
  stars: StarLevel;
  /** 「かなりおすすめ」などのラベル */
  label: string;
  /** 🟢🟡🟠🔴 */
  icon: string;
  /** 配色トーン */
  tone: RecommendationTone;
}

/** 判定理由（項目別評価＋詳細の箇条書き）。 */
export interface RecommendationReason {
  /** 波・風・天気・潮位・気温の評価一覧 */
  factors: WeatherEvaluation[];
  /** 「風速2m/sで歩きやすい」などの詳細行 */
  highlights: string[];
}

/** 安全に関する警告レベル。 */
export type SafetyLevel = "danger" | "caution" | "none";

/**
 * 安全アラート。
 * スコアの高低に関わらず最優先で表示する。
 * 高波など人命に関わる条件では danger とし、判定を最低ランクへ強制する。
 */
export interface SafetyAlert {
  level: SafetyLevel;
  /** 見出し（例: 「本日は危険です。海岸に近づかないでください」） */
  title: string;
  /** 補足説明 */
  message: string;
}

/** 前日の海況（荒れた翌日はヒスイが打ち上がりやすい）。 */
export interface PreviousDayInfo {
  /** 前日の最大波高 (m)。取得できない場合は null */
  maxWaveHeight: number | null;
  /** 前日の最大風速 (m/s) */
  maxWindSpeed: number | null;
  /** 前日の代表的な天気コード */
  weatherCode: number | null;
  /** 前日が荒れていたか */
  wasRough: boolean;
  /** 表示用の説明文 */
  description: string;
}

/** 「今日行くべき？」判定の最終結果。 */
export interface Recommendation {
  score: RecommendationScore;
  /** 2〜3行程度の一言コメント */
  comment: string;
  reason: RecommendationReason;
  /** コメントの生成元。将来AIコメントを足したときの出し分けに使う */
  commentSource: "ai" | "rule";
  /** 安全アラート（danger の場合はカード最上部に強調表示） */
  safety: SafetyAlert;
  /** 前日の海況による補正（該当しない場合は null） */
  previousDayBonus: {
    applied: boolean;
    points: number;
    message: string;
  } | null;
}

/** 潮位情報。 */
export interface TideInfo {
  /** 平均海面からの高さ (m)。取得できない場合は null */
  seaLevel: number | null;
  /** 潮の動き */
  trend: "rising" | "falling" | "steady" | "unknown";
  /** その日の最低潮位 (m) */
  dailyMin: number | null;
  /** その日の最高潮位 (m) */
  dailyMax: number | null;
}
