/**
 * 前日の海況取得サービス。
 *
 * ヒスイ拾いでは「荒れた翌日」が狙い目とされる。
 * 荒天時の高波が海底のヒスイを浜へ打ち上げ、波が落ち着いた翌日に
 * 拾いやすい状態になるため、前日のコンディションを判定に加味する。
 *
 * データソース: Open-Meteo（`past_days=1` で前日実績を取得）
 *   - Marine API: 前日の波高
 *   - Forecast API: 前日の最大風速・天気コード
 */
import { location } from "@/lib/config";
import { weatherCodeToJa } from "@/lib/utils";
import type { PreviousDayInfo } from "@/types/recommendation";

const MARINE_ENDPOINT = "https://marine-api.open-meteo.com/v1/marine";
const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

/** この波高を超えた日は「荒れていた」とみなす。 */
const ROUGH_WAVE_THRESHOLD = 1.2;
/** この風速を超えた日も「荒れていた」とみなす。 */
const ROUGH_WIND_THRESHOLD = 9;
/** 荒天とみなすWMOコード（雨・雪・雷）。 */
const ROUGH_WEATHER_CODES = [
  63, 65, 66, 67, 73, 75, 81, 82, 85, 86, 95, 96, 99,
];

const UNKNOWN: PreviousDayInfo = {
  maxWaveHeight: null,
  maxWindSpeed: null,
  weatherCode: null,
  wasRough: false,
  description: "前日のデータを取得できませんでした。",
};

interface MarinePastResponse {
  daily?: {
    time?: string[];
    wave_height_max?: (number | null)[];
  };
}

interface ForecastPastResponse {
  daily?: {
    time?: string[];
    wind_speed_10m_max?: (number | null)[];
    weather_code?: (number | null)[];
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Open-Meteo 前日データ取得失敗 (${res.status})`);
  return (await res.json()) as T;
}

/** 前日の海況を取得する。失敗しても例外は投げず「不明」を返す。 */
export async function fetchPreviousDayInfo(): Promise<PreviousDayInfo> {
  const { latitude, longitude, timezone } = location;
  const tz = encodeURIComponent(timezone);

  try {
    const marineUrl =
      `${MARINE_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
      `&daily=wave_height_max&past_days=1&forecast_days=1&timezone=${tz}`;

    const forecastUrl =
      `${FORECAST_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
      `&daily=wind_speed_10m_max,weather_code&wind_speed_unit=ms` +
      `&past_days=1&forecast_days=1&timezone=${tz}`;

    const [marine, forecast] = await Promise.all([
      fetchJson<MarinePastResponse>(marineUrl),
      fetchJson<ForecastPastResponse>(forecastUrl),
    ]);

    // past_days=1 の場合、配列の先頭[0]が前日、[1]が当日。
    const maxWaveHeight = numberAt(marine.daily?.wave_height_max, 0);
    const maxWindSpeed = numberAt(forecast.daily?.wind_speed_10m_max, 0);
    const weatherCode = numberAt(forecast.daily?.weather_code, 0);

    if (maxWaveHeight === null && maxWindSpeed === null && weatherCode === null) {
      return UNKNOWN;
    }

    const roughByWave = maxWaveHeight !== null && maxWaveHeight >= ROUGH_WAVE_THRESHOLD;
    const roughByWind = maxWindSpeed !== null && maxWindSpeed >= ROUGH_WIND_THRESHOLD;
    const roughByWeather = weatherCode !== null && ROUGH_WEATHER_CODES.includes(weatherCode);
    const wasRough = roughByWave || roughByWind || roughByWeather;

    return {
      maxWaveHeight,
      maxWindSpeed,
      weatherCode,
      wasRough,
      description: buildDescription({
        maxWaveHeight,
        maxWindSpeed,
        weatherCode,
        wasRough,
      }),
    };
  } catch (error) {
    console.error("[previousDay] 前日データの取得に失敗しました:", error);
    return UNKNOWN;
  }
}

function numberAt(arr: (number | null)[] | undefined, index: number): number | null {
  const v = arr?.[index];
  return typeof v === "number" ? v : null;
}

function buildDescription(info: Omit<PreviousDayInfo, "description">): string {
  const parts: string[] = [];
  if (info.maxWaveHeight !== null) parts.push(`最大波高${info.maxWaveHeight.toFixed(1)}m`);
  if (info.maxWindSpeed !== null) parts.push(`最大風速${info.maxWindSpeed.toFixed(1)}m/s`);
  if (info.weatherCode !== null) parts.push(weatherCodeToJa(info.weatherCode));

  const summary = parts.length > 0 ? `前日は${parts.join("・")}` : "前日のデータ";

  return info.wasRough
    ? `${summary}と荒れていました。海底のヒスイが浜へ打ち上げられている可能性があります。`
    : `${summary}で、比較的落ち着いていました。`;
}
