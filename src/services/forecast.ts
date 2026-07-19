/**
 * 週間おすすめ度予報サービス。
 *
 * Open-Meteo から日別の予報（波高・風速・天気・気温・降水確率）を7日分取得し、
 * 各日について判定エンジンでおすすめ度を算出する。
 *
 * past_days=1 を付けて前日分も取得することで、
 * 「前日が荒れていたか」を各日について正しく評価できる。
 *
 * 注意: 潮位は日別予報に含めていないため、週間予報では中立扱いとなる。
 *       当日の詳細判定（トップのカード）とは数点ずれることがある。
 */
import { location } from "@/lib/config";
import { weatherCodeToJa } from "@/lib/utils";
import { evaluateRecommendation } from "@/services/recommendation";
import type { WaveInfo, WeatherInfo } from "@/types";
import type { PreviousDayInfo, Recommendation } from "@/types/recommendation";

const MARINE_ENDPOINT = "https://marine-api.open-meteo.com/v1/marine";
const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

/** 予報として扱う日数（当日を含む）。 */
const FORECAST_DAYS = 7;

export interface DailyForecast {
  /** YYYY-MM-DD */
  date: string;
  wave: WaveInfo;
  weather: WeatherInfo;
  recommendation: Recommendation;
}

interface MarineDaily {
  daily?: {
    time?: string[];
    wave_height_max?: (number | null)[];
    wave_period_max?: (number | null)[];
    wave_direction_dominant?: (number | null)[];
  };
}

interface ForecastDaily {
  daily?: {
    time?: string[];
    weather_code?: (number | null)[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_probability_max?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    wind_direction_10m_dominant?: (number | null)[];
    uv_index_max?: (number | null)[];
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    // 日別予報は頻繁には変わらないため1時間キャッシュする
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Open-Meteo 週間予報の取得に失敗 (${res.status})`);
  return (await res.json()) as T;
}

function num(arr: (number | null)[] | undefined, i: number): number | null {
  const v = arr?.[i];
  return typeof v === "number" ? v : null;
}

/** 指定インデックスの日を前日情報として組み立てる。 */
function buildPreviousDay(
  marine: MarineDaily,
  forecast: ForecastDaily,
  index: number,
): PreviousDayInfo | undefined {
  if (index < 0) return undefined;

  const maxWaveHeight = num(marine.daily?.wave_height_max, index);
  const maxWindSpeed = num(forecast.daily?.wind_speed_10m_max, index);
  const weatherCode = num(forecast.daily?.weather_code, index);

  if (maxWaveHeight === null && maxWindSpeed === null && weatherCode === null) {
    return undefined;
  }

  const roughCodes = [63, 65, 66, 67, 73, 75, 81, 82, 85, 86, 95, 96, 99];
  const wasRough =
    (maxWaveHeight !== null && maxWaveHeight >= 1.2) ||
    (maxWindSpeed !== null && maxWindSpeed >= 9) ||
    (weatherCode !== null && roughCodes.includes(weatherCode));

  const parts: string[] = [];
  if (maxWaveHeight !== null) parts.push(`最大波高${maxWaveHeight.toFixed(1)}m`);
  if (weatherCode !== null) parts.push(weatherCodeToJa(weatherCode));

  const summary = parts.length > 0 ? `前日は${parts.join("・")}` : "前日";

  return {
    maxWaveHeight,
    maxWindSpeed,
    weatherCode,
    wasRough,
    description: wasRough
      ? `${summary}と荒れていました。ヒスイが打ち上げられている可能性があります。`
      : `${summary}で落ち着いていました。`,
  };
}

/**
 * 当日から7日分のおすすめ度予報を取得する。
 * 失敗しても例外は投げず、空配列を返す（UI側で非表示にする）。
 */
export async function fetchWeeklyForecast(): Promise<DailyForecast[]> {
  const { latitude, longitude, timezone } = location;
  const tz = encodeURIComponent(timezone);

  try {
    const marineUrl =
      `${MARINE_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
      `&daily=wave_height_max,wave_period_max,wave_direction_dominant` +
      `&past_days=1&forecast_days=${FORECAST_DAYS}&timezone=${tz}`;

    const forecastUrl =
      `${FORECAST_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
      `precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max` +
      `&wind_speed_unit=ms&past_days=1&forecast_days=${FORECAST_DAYS}&timezone=${tz}`;

    const [marine, forecast] = await Promise.all([
      fetchJson<MarineDaily>(marineUrl),
      fetchJson<ForecastDaily>(forecastUrl),
    ]);

    const times = forecast.daily?.time ?? [];
    const results: DailyForecast[] = [];

    // past_days=1 のため index 0 は前日。index 1 以降が当日〜。
    for (let i = 1; i < times.length; i += 1) {
      const date = times[i];
      if (!date) continue;

      const wave: WaveInfo = {
        waveHeight: num(marine.daily?.wave_height_max, i) ?? 0,
        wavePeriod: num(marine.daily?.wave_period_max, i) ?? 0,
        waveDirection: num(marine.daily?.wave_direction_dominant, i) ?? 0,
        windDirection: num(forecast.daily?.wind_direction_10m_dominant, i) ?? 0,
        windSpeed: num(forecast.daily?.wind_speed_10m_max, i) ?? 0,
      };

      const weatherCode = num(forecast.daily?.weather_code, i) ?? 0;
      const high = num(forecast.daily?.temperature_2m_max, i) ?? 0;
      const low = num(forecast.daily?.temperature_2m_min, i) ?? 0;

      const weather: WeatherInfo = {
        weather: weatherCodeToJa(weatherCode),
        weatherCode,
        // 日別予報のため、日中の代表値として最高・最低の中間を用いる
        temperature: Math.round(((high + low) / 2) * 10) / 10,
        highTemperature: high,
        lowTemperature: low,
        rainProbability: num(forecast.daily?.precipitation_probability_max, i) ?? 0,
        uvIndexMax: num(forecast.daily?.uv_index_max, i),
      };

      const recommendation = evaluateRecommendation({
        wave,
        weather,
        previousDay: buildPreviousDay(marine, forecast, i - 1),
      });

      results.push({ date, wave, weather, recommendation });
    }

    return results;
  } catch (error) {
    console.error("[forecast] 週間予報の取得に失敗しました:", error);
    return [];
  }
}
