/**
 * AI判定サービス。
 *
 * OpenAI API を用いて、波・天気データから
 * 「ヒスイ拾いおすすめ度(1〜5)」と「おすすめ理由」を生成する。
 *
 * 判定で考慮する要素: 波高・波周期・風速・風向・天気・降水確率。
 * OpenAI が利用不可の場合はルールベースの簡易判定にフォールバックする
 * （サイトを止めないための保険。通常運用では OpenAI を使用）。
 */
import OpenAI from "openai";
import { openaiConfig } from "@/lib/config";
import { degreesToCompassJa } from "@/lib/utils";
import type { AiJudgement, WaveInfo, WeatherInfo } from "@/types";

const SYSTEM_PROMPT = `あなたは富山県のヒスイ海岸でのヒスイ拾いに精通したアドバイザーです。
与えられた海況・気象データから、その日のヒスイ拾いのおすすめ度を判定します。

ヒスイ拾いの一般的な経験則:
- 波が高い日や荒天の翌日は、海底のヒスイが浜へ打ち上げられやすい一方で、波が高すぎる当日は危険で拾いにくい。
- 波高がおおむね0.5〜1.5m程度で、風が弱く、視界が良い（晴れ〜くもり）と探しやすい。
- 波高2m以上や強風・雷雨・高い降水確率は、安全面・視認性で不利。
- 波周期が長いうねりは打ち上げに寄与しやすい。
- 沖からの風（陸方向へ吹く風）は打ち上げにやや有利。

出力は必ず次のJSON形式のみ:
{"score": 1〜5の整数, "reason": "50〜120字程度の日本語の理由"}
理由は安全への配慮も踏まえ、具体的な数値に触れて説明してください。`;

function buildUserPrompt(wave: WaveInfo, weather: WeatherInfo): string {
  return [
    "以下のデータでヒスイ拾いのおすすめ度を判定してください。",
    `- 波高: ${wave.waveHeight.toFixed(1)} m`,
    `- 波周期: ${wave.wavePeriod.toFixed(1)} s`,
    `- 波向き: ${degreesToCompassJa(wave.waveDirection)}（${Math.round(wave.waveDirection)}°）`,
    `- 風速: ${wave.windSpeed.toFixed(1)} m/s`,
    `- 風向き: ${degreesToCompassJa(wave.windDirection)}（${Math.round(wave.windDirection)}°）`,
    `- 天気: ${weather.weather}`,
    `- 降水確率: ${Math.round(weather.rainProbability)} %`,
    `- 最高/最低気温: ${weather.highTemperature.toFixed(0)} / ${weather.lowTemperature.toFixed(0)} ℃`,
  ].join("\n");
}

/** ルールベースの簡易フォールバック判定。 */
export function heuristicJudgement(wave: WaveInfo, weather: WeatherInfo): AiJudgement {
  let score = 3;

  if (wave.waveHeight <= 1.0) score += 1;
  if (wave.waveHeight <= 0.5) score += 1;
  if (wave.waveHeight >= 1.8) score -= 1;
  if (wave.waveHeight >= 2.5) score -= 1;

  if (wave.windSpeed <= 4) score += 1;
  if (wave.windSpeed >= 9) score -= 1;

  if (weather.rainProbability >= 60) score -= 1;
  if ([95, 96, 99].includes(weather.weatherCode)) score -= 1;
  if ([0, 1, 2].includes(weather.weatherCode)) score += 1;

  score = Math.max(1, Math.min(5, score));

  const reason =
    `波高${wave.waveHeight.toFixed(1)}m・風速${wave.windSpeed.toFixed(1)}m/s・` +
    `${weather.weather}（降水確率${Math.round(weather.rainProbability)}%）の条件から簡易判定しました。` +
    (score >= 4
      ? "比較的探しやすい海況です。安全に気をつけて楽しんでください。"
      : score <= 2
        ? "波や天候の条件が不利です。無理はせず安全を優先してください。"
        : "条件は標準的です。波打ち際の様子を見ながら楽しみましょう。");

  return { score, reason };
}

/** OpenAI によるおすすめ度判定。失敗時はフォールバックする。 */
export async function judgeRecommendation(
  wave: WaveInfo,
  weather: WeatherInfo,
): Promise<AiJudgement> {
  try {
    const client = new OpenAI({ apiKey: openaiConfig.apiKey });

    const completion = await client.chat.completions.create({
      model: openaiConfig.model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(wave, weather) },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("OpenAI から空の応答が返りました。");

    const parsed = JSON.parse(content) as { score?: number; reason?: string };
    const score = Math.max(1, Math.min(5, Math.round(Number(parsed.score))));
    const reason = (parsed.reason ?? "").trim();

    if (!Number.isFinite(score) || reason === "") {
      throw new Error("OpenAI の応答を解釈できませんでした。");
    }

    return { score, reason };
  } catch (error) {
    console.error("[ai] OpenAI判定に失敗。フォールバックを使用します:", error);
    return heuristicJudgement(wave, weather);
  }
}
