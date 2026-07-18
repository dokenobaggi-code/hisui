/**
 * 波情報サービス。
 *
 * データソース: Open-Meteo Marine Weather API + Weather Forecast API
 *   - https://open-meteo.com/en/docs/marine-weather-api
 *   - APIキー不要 / 非営利・商用利用可 / 自動取得可（CC BY 4.0）
 *   - 出典表記の推奨: "Weather data by Open-Meteo.com"
 *
 * 波高・波周期・波向きは Marine API から、
 * 風速・風向きは Forecast API（10m）から取得する。
 */
import { location } from "@/lib/config";
import type { WaveInfo } from "@/types";

const MARINE_ENDPOINT = "https://marine-api.open-meteo.com/v1/marine";
const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

interface MarineResponse {
  current?: {
    wave_height?: number;
    wave_period?: number;
    wave_direction?: number;
  };
}

interface WindResponse {
  current?: {
    wind_speed_10m?: number;
    wind_direction_10m?: number;
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    // 常に最新を取得（キャッシュしない）
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Open-Meteo リクエスト失敗 (${res.status}): ${url}`);
  }
  return (await res.json()) as T;
}

/** ヒスイ海岸周辺の現在の波情報を取得する。 */
export async function fetchWaveInfo(): Promise<WaveInfo> {
  const { latitude, longitude, timezone } = location;

  const marineUrl =
    `${MARINE_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
    `&current=wave_height,wave_period,wave_direction&timezone=${encodeURIComponent(timezone)}`;

  const windUrl =
    `${FORECAST_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
    `&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timezone=${encodeURIComponent(timezone)}`;

  const [marine, wind] = await Promise.all([
    fetchJson<MarineResponse>(marineUrl),
    fetchJson<WindResponse>(windUrl),
  ]);

  return {
    waveHeight: marine.current?.wave_height ?? 0,
    wavePeriod: marine.current?.wave_period ?? 0,
    waveDirection: marine.current?.wave_direction ?? 0,
    windDirection: wind.current?.wind_direction_10m ?? 0,
    windSpeed: wind.current?.wind_speed_10m ?? 0,
  };
}
