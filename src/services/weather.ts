/**
 * 天気予報サービス。
 *
 * データソース: Open-Meteo Weather Forecast API
 *   - https://open-meteo.com/en/docs
 *   - APIキー不要 / 非営利・商用利用可 / 自動取得可（CC BY 4.0）
 *
 * 取得項目: 天気・気温・降水確率・最高気温・最低気温
 */
import { location } from "@/lib/config";
import { weatherCodeToJa } from "@/lib/utils";
import type { WeatherInfo } from "@/types";

const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
    uv_index_max?: (number | null)[];
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo リクエスト失敗 (${res.status}): ${url}`);
  }
  return (await res.json()) as T;
}

/** ヒスイ海岸周辺の当日の天気予報を取得する。 */
export async function fetchWeatherInfo(): Promise<WeatherInfo> {
  const { latitude, longitude, timezone } = location;

  const url =
    `${FORECAST_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,uv_index_max` +
    `&forecast_days=1&timezone=${encodeURIComponent(timezone)}`;

  const data = await fetchJson<ForecastResponse>(url);

  // 当日の代表天気は daily の weather_code を優先し、無ければ current。
  const dailyCode = data.daily?.weather_code?.[0];
  const currentCode = data.current?.weather_code;
  const weatherCode = dailyCode ?? currentCode ?? 0;

  return {
    weather: weatherCodeToJa(weatherCode),
    weatherCode,
    temperature: data.current?.temperature_2m ?? data.daily?.temperature_2m_max?.[0] ?? 0,
    highTemperature: data.daily?.temperature_2m_max?.[0] ?? 0,
    lowTemperature: data.daily?.temperature_2m_min?.[0] ?? 0,
    rainProbability: data.daily?.precipitation_probability_max?.[0] ?? 0,
    uvIndexMax:
      typeof data.daily?.uv_index_max?.[0] === "number" ? data.daily.uv_index_max[0]! : null,
  };
}
