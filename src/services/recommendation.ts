/**
 * 「今日行くべき？」判定エンジン。
 *
 * 波・風・天気・潮位・気温をそれぞれ0〜100点で採点し、
 * 重み付き平均で総合スコア（0〜100）を算出する。
 *
 * 設計方針:
 * - 外部I/Oを持たない純粋関数。入力が同じなら出力も同じ（テスト・再現が容易）。
 * - 採点基準は FACTOR_WEIGHTS / 各 scoreXxx 関数に集約し、調整しやすくしている。
 * - コメントはルールベースで生成するが、AIコメントを渡せば差し替わる
 *   （将来「AIによる自然言語コメント」へ移行しやすい）。
 *
 * 判定基準は「一般的にヒスイ拾いに向く条件」を想定した経験則であり、
 * 厳密な科学的根拠に基づくものではない。
 */
import { degreesToCompassJa } from "@/lib/utils";
import type {
  Grade,
  PreviousDayInfo,
  Recommendation,
  RecommendationScore,
  SafetyAlert,
  StarLevel,
  TideInfo,
  WeatherEvaluation,
} from "@/types/recommendation";
import type { WaveInfo, WeatherInfo } from "@/types";

/**
 * 危険とみなす波高 (m)。
 * これ以上の場合はスコアに関わらず「行かないべき」と判定する。
 */
export const DANGER_WAVE_HEIGHT = 1.5;

/** 前日が荒れていた場合の加点（満点100に対して）。 */
export const PREVIOUS_DAY_BONUS_POINTS = 10;

/** 各項目の重み（合計100）。バランス調整はここだけ触ればよい。 */
export const FACTOR_WEIGHTS = {
  wave: 30,
  wind: 25,
  weather: 20,
  tide: 15,
  temperature: 10,
} as const;

/** 素点が取得できない場合に用いる中立点。 */
const NEUTRAL_SCORE = 60;

export interface EvaluateInput {
  wave: WaveInfo;
  weather: WeatherInfo;
  tide?: TideInfo;
  /** 前日の海況（荒れた翌日は加点される） */
  previousDay?: PreviousDayInfo;
}

export interface EvaluateOptions {
  /** AIが生成したコメント。渡された場合はこちらを優先して表示する。 */
  aiComment?: string;
}

// ---------- 項目別の採点 ----------

/**
 * 波の採点。
 * 荒れすぎは危険で拾いにくく、穏やかすぎると新しい石が上がりにくい。
 * 0.3〜0.8m 程度を最良とする。
 */
function scoreWave(waveHeight: number): number {
  if (waveHeight <= 0.15) return 80;
  if (waveHeight <= 0.3) return 90;
  if (waveHeight <= 0.8) return 100;
  if (waveHeight <= 1.2) return 75;
  if (waveHeight <= 1.8) return 45;
  if (waveHeight <= 2.5) return 20;
  return 5;
}

/** 風の採点。弱いほど歩きやすく、視界も安定する。 */
function scoreWind(windSpeed: number): number {
  if (windSpeed <= 2) return 100;
  if (windSpeed <= 4) return 85;
  if (windSpeed <= 6) return 65;
  if (windSpeed <= 9) return 40;
  if (windSpeed <= 12) return 20;
  return 5;
}

/** 天気の採点。WMOコードの基礎点から、降水確率に応じて減点する。 */
function scoreWeather(weatherCode: number, rainProbability: number): number {
  let base: number;
  if ([0, 1].includes(weatherCode)) base = 95;
  else if ([2, 3].includes(weatherCode)) base = 80;
  else if ([45, 48].includes(weatherCode)) base = 55;
  else if (weatherCode >= 51 && weatherCode <= 57) base = 45;
  else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) base = 30;
  else if ([95, 96, 99].includes(weatherCode)) base = 5;
  else if (weatherCode >= 61 && weatherCode <= 82) base = 25;
  else base = 60;

  const penalty = Math.max(0, Math.min(30, rainProbability * 0.3));
  return clamp(base - penalty);
}

/**
 * 潮位の採点。低いほど浜が広く露出し、探せる範囲が広がる。
 * 平均海面(MSL)からの高さ (m) で評価する。
 */
function scoreTide(seaLevel: number | null): number {
  if (seaLevel === null) return NEUTRAL_SCORE;
  if (seaLevel <= -0.2) return 100;
  if (seaLevel <= -0.05) return 85;
  if (seaLevel <= 0.1) return 65;
  if (seaLevel <= 0.25) return 45;
  return 25;
}

/** 気温の採点。長時間浜を歩くため、極端な暑さ・寒さを減点する。 */
function scoreTemperature(temperature: number): number {
  if (temperature >= 15 && temperature <= 25) return 100;
  if (temperature >= 10 && temperature < 15) return 75;
  if (temperature > 25 && temperature <= 30) return 75;
  if (temperature >= 5 && temperature < 10) return 50;
  if (temperature > 30 && temperature <= 33) return 45;
  if (temperature >= 0 && temperature < 5) return 30;
  if (temperature > 33 && temperature <= 35) return 25;
  return 15;
}

// ---------- 補助 ----------

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

/** 素点を4段階評価へ変換。 */
function toGrade(score: number): Grade {
  if (score >= 85) return "◎";
  if (score >= 65) return "○";
  if (score >= 40) return "△";
  return "×";
}

/** 総合スコアからスコア表示情報を組み立てる。 */
export function toRecommendationScore(value: number): RecommendationScore {
  const rounded = Math.round(clamp(value));
  let stars: StarLevel;
  let label: string;
  let icon: string;
  let tone: RecommendationScore["tone"];

  if (rounded >= 90) {
    stars = 5;
    label = "かなりおすすめ";
    icon = "🟢";
    tone = "great";
  } else if (rounded >= 70) {
    stars = 4;
    label = "おすすめ";
    icon = "🟢";
    tone = "good";
  } else if (rounded >= 50) {
    stars = 3;
    label = "条件次第";
    icon = "🟡";
    tone = "fair";
  } else if (rounded >= 30) {
    stars = 2;
    label = "あまりおすすめしません";
    icon = "🟠";
    tone = "poor";
  } else {
    stars = 1;
    label = "おすすめしません";
    icon = "🔴";
    tone = "bad";
  }

  return { value: rounded, stars, label, icon, tone };
}

/** 潮の動きの日本語表現。 */
function tideTrendJa(trend: TideInfo["trend"]): string {
  switch (trend) {
    case "rising":
      return "上げ潮";
    case "falling":
      return "下げ潮";
    case "steady":
      return "横ばい";
    default:
      return "不明";
  }
}

// ---------- 項目別評価の組み立て ----------

function buildFactors(input: EvaluateInput): WeatherEvaluation[] {
  const { wave, weather, tide } = input;
  const seaLevel = tide?.seaLevel ?? null;

  const waveScore = scoreWave(wave.waveHeight);
  const windScore = scoreWind(wave.windSpeed);
  const weatherScore = scoreWeather(weather.weatherCode, weather.rainProbability);
  const tideScore = scoreTide(seaLevel);
  const tempScore = scoreTemperature(weather.temperature);

  return [
    {
      key: "wave",
      label: "波",
      grade: toGrade(waveScore),
      score: waveScore,
      weight: FACTOR_WEIGHTS.wave,
      value: `${wave.waveHeight.toFixed(1)} m`,
      detail: describeWave(wave.waveHeight, wave.wavePeriod),
    },
    {
      key: "wind",
      label: "風",
      grade: toGrade(windScore),
      score: windScore,
      weight: FACTOR_WEIGHTS.wind,
      value: `${wave.windSpeed.toFixed(1)} m/s`,
      detail: describeWind(wave.windSpeed, wave.windDirection),
    },
    {
      key: "weather",
      label: "天気",
      grade: toGrade(weatherScore),
      score: weatherScore,
      weight: FACTOR_WEIGHTS.weather,
      value: weather.weather || "—",
      detail: describeWeather(weather.weather, weather.rainProbability),
    },
    {
      key: "tide",
      label: "潮位",
      grade: toGrade(tideScore),
      score: tideScore,
      weight: FACTOR_WEIGHTS.tide,
      value: seaLevel === null ? "—" : `${seaLevel.toFixed(2)} m`,
      detail: describeTide(seaLevel, tide?.trend ?? "unknown"),
    },
    {
      key: "temperature",
      label: "気温",
      grade: toGrade(tempScore),
      score: tempScore,
      weight: FACTOR_WEIGHTS.temperature,
      value: `${weather.temperature.toFixed(0)} ℃`,
      detail: describeTemperature(weather.temperature),
    },
  ];
}

function describeWave(height: number, period: number): string {
  const base = `波高${height.toFixed(1)}m・周期${period.toFixed(1)}s`;
  if (height <= 0.15) return `${base}。非常に穏やかで安全に歩けますが、新しい石の打ち上げは少なめです。`;
  if (height <= 0.8) return `${base}。歩きやすく、石も打ち上がりやすい理想的な状態です。`;
  if (height <= 1.2) return `${base}。やや波がありますが、波打ち際に注意すれば探せます。`;
  if (height <= 1.8) return `${base}。波が高めです。波打ち際には近づきすぎないでください。`;
  return `${base}。波が高く危険です。無理せず日を改めることをおすすめします。`;
}

function describeWind(speed: number, direction: number): string {
  const dir = degreesToCompassJa(direction);
  const base = `風速${speed.toFixed(1)}m/s（${dir}の風）`;
  if (speed <= 2) return `${base}。ほぼ無風で歩きやすい条件です。`;
  if (speed <= 4) return `${base}。弱い風で快適に探せます。`;
  if (speed <= 6) return `${base}。やや風がありますが、探索に大きな支障はありません。`;
  if (speed <= 9) return `${base}。風が強く、砂が舞って探しにくい可能性があります。`;
  return `${base}。強風です。安全面からもおすすめできません。`;
}

function describeWeather(weather: string, rainProbability: number): string {
  const rain = `降水確率${Math.round(rainProbability)}%`;
  if (rainProbability >= 70) return `${weather}・${rain}。雨で視界が悪く、石の判別がしにくい状況です。`;
  if (rainProbability >= 40) return `${weather}・${rain}。雨具の準備をしておくと安心です。`;
  return `${weather}・${rain}。視界がよく石を見分けやすい天気です。`;
}

function describeTide(seaLevel: number | null, trend: TideInfo["trend"]): string {
  if (seaLevel === null) return "潮位データを取得できませんでした。中立として評価しています。";
  const base = `潮位${seaLevel.toFixed(2)}m（${tideTrendJa(trend)}）`;
  if (seaLevel <= -0.05) return `${base}。潮が引いて浜が広く、探せる範囲が広がっています。`;
  if (seaLevel <= 0.1) return `${base}。標準的な潮位です。`;
  return `${base}。潮が高く、歩ける浜が狭くなっています。干潮の時間帯を狙うと有利です。`;
}

function describeTemperature(temperature: number): string {
  const base = `気温${temperature.toFixed(0)}℃`;
  if (temperature >= 15 && temperature <= 25) return `${base}。長時間の探索でも快適な気温です。`;
  if (temperature > 25 && temperature <= 30) return `${base}。暑いので水分補給を忘れずに。`;
  if (temperature > 30) return `${base}。熱中症に注意し、朝夕の涼しい時間帯をおすすめします。`;
  if (temperature >= 10) return `${base}。やや肌寒いので上着があると安心です。`;
  return `${base}。冷え込みます。防寒対策をしっかりしてください。`;
}

// ---------- コメント生成 ----------

/** 総合評価と、良い点・悪い点から2〜3文のコメントを組み立てる。 */
function buildComment(score: RecommendationScore, factors: WeatherEvaluation[]): string {
  const sorted = [...factors].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const positives = factors.filter((f) => f.score >= 85).map((f) => f.label);
  const negatives = factors.filter((f) => f.score < 40).map((f) => f.label);

  const head =
    score.stars >= 4
      ? "今日はヒスイ探しに向いた条件です。"
      : score.stars === 3
        ? "今日は条件がやや分かれます。"
        : "今日はあまり条件がよくありません。";

  const positivePart =
    positives.length > 0
      ? `${positives.join("・")}の条件が良好です。`
      : best
        ? `${best.label}の条件は比較的良好です。`
        : "";

  const negativePart =
    negatives.length > 0
      ? `一方で${negatives.join("・")}に注意が必要です。`
      : worst && worst.score < 65
        ? `${worst.label}はやや不利な条件です。`
        : "安全に気をつけて楽しんでください。";

  return `${head}${positivePart}${negativePart}`;
}

// ---------- 安全判定 ----------

/**
 * 安全アラートを判定する。
 * 波高 DANGER_WAVE_HEIGHT (1.5m) 以上は、他の条件がどれだけ良くても危険とみなす。
 */
export function evaluateSafety(wave: WaveInfo, weather: WeatherInfo): SafetyAlert {
  if (wave.waveHeight >= DANGER_WAVE_HEIGHT) {
    return {
      level: "danger",
      title: "本日は危険です。海岸に行かないでください",
      message:
        `波高が${wave.waveHeight.toFixed(1)}mあります。` +
        `高波は不意に足元をさらい、海に引き込まれる危険があります。` +
        `波が落ち着くまで海岸への立ち入りは避けてください。`,
    };
  }

  if ([95, 96, 99].includes(weather.weatherCode)) {
    return {
      level: "danger",
      title: "本日は危険です。海岸に行かないでください",
      message:
        "雷雨が予想されています。海岸や砂浜は落雷の危険が高い場所です。天候が回復するまで待ってください。",
    };
  }

  if (wave.waveHeight >= 1.0 || wave.windSpeed >= 10) {
    return {
      level: "caution",
      title: "注意が必要です",
      message:
        `波高${wave.waveHeight.toFixed(1)}m・風速${wave.windSpeed.toFixed(1)}m/sです。` +
        `波打ち際には近づきすぎず、単独での行動は避けてください。`,
    };
  }

  return { level: "none", title: "", message: "" };
}

// ---------- 公開API ----------

/**
 * 波・天気・潮位・前日の海況から「今日行くべき？」を判定する。
 *
 * 判定の優先順位:
 *   1. 安全判定（波高1.5m以上などは最低ランクへ強制）
 *   2. 各項目の重み付きスコア
 *   3. 前日が荒れていた場合の加点
 *
 * @param input 判定に使う観測値
 * @param options AIコメントなどの任意設定
 */
export function evaluateRecommendation(
  input: EvaluateInput,
  options: EvaluateOptions = {},
): Recommendation {
  const factors = buildFactors(input);
  const safety = evaluateSafety(input.wave, input.weather);

  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weighted = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const baseScore = totalWeight === 0 ? 0 : weighted / totalWeight;

  // 前日が荒れていた場合、当日が安全な範囲であれば加点する。
  const previousDay = input.previousDay;
  const bonusApplies =
    previousDay?.wasRough === true && safety.level !== "danger" && input.wave.waveHeight < 1.2;

  const bonusPoints = bonusApplies ? PREVIOUS_DAY_BONUS_POINTS : 0;

  // 危険時はスコアを最低ランク（★1帯）へ強制する。
  const finalValue = safety.level === "danger" ? Math.min(baseScore, 20) : baseScore + bonusPoints;

  const score = toRecommendationScore(finalValue);

  const highlights = factors.map((f) => f.detail);
  if (previousDay && previousDay.description !== "") {
    highlights.push(previousDay.description);
  }

  const comment = buildFinalComment({
    score,
    factors,
    safety,
    bonusApplies,
    aiComment: options.aiComment,
  });

  return {
    score,
    comment: comment.text,
    commentSource: comment.source,
    safety,
    previousDayBonus: previousDay
      ? {
          applied: bonusApplies,
          points: bonusPoints,
          message: bonusApplies
            ? `前日が荒れていたため +${bonusPoints}点。新しいヒスイが打ち上がっている可能性があります。`
            : previousDay.description,
        }
      : null,
    reason: { factors, highlights },
  };
}

/** 安全警告・前日ボーナスを踏まえた最終コメントを組み立てる。 */
function buildFinalComment(params: {
  score: RecommendationScore;
  factors: WeatherEvaluation[];
  safety: SafetyAlert;
  bonusApplies: boolean;
  aiComment?: string;
}): { text: string; source: "ai" | "rule" } {
  const { score, factors, safety, bonusApplies, aiComment } = params;

  // 危険時は、AIコメントより安全メッセージを優先する。
  if (safety.level === "danger") {
    return { text: safety.message, source: "rule" };
  }

  const trimmed = aiComment?.trim();
  const base = trimmed && trimmed !== "" ? trimmed : buildComment(score, factors);
  const source: "ai" | "rule" = trimmed && trimmed !== "" ? "ai" : "rule";

  const bonusSentence = bonusApplies
    ? "前日が荒れていたため、新しいヒスイが打ち上げられている可能性があります。"
    : "";

  return { text: `${base}${bonusSentence}`, source };
}
