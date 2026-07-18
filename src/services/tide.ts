/**
 * 潮位サービス。
 *
 * データソース: Open-Meteo Marine Weather API (`sea_level_height_msl`)
 *   - 平均海面(MSL)からの高さ (m) を1時間ごとに取得する。
 *   - APIキー不要 / 商用利用可 / 自動取得可（CC BY 4.0）
 *
 * ヒスイ拾いでは潮位が低いほど浜が広く露出し、探せる範囲が広がるため、
 * 「低いほど良い」という評価に用いる。
 */
import { location } from "@/lib/config";
import type { TideInfo } from "@/types/recommendation";

const MARINE_ENDPOINT = "https://marine-api.open-meteo.com/v1/marine";

interface MarineTideResponse {
  hourly?: {
    time?: string[];
    sea_level_height_msl?: (number | null)[];
  };
}

/** 取得失敗時に返す既定値（判定側で「不明」として中立に扱う）。 */
const UNKNOWN_TIDE: TideInfo = {
  seaLevel: null,
  trend: "unknown",
  dailyMin: null,
  dailyMax: null,
};

/** 現在時刻（対象タイムゾーン）の "YYYY-MM-DDTHH:00" を組み立てる。 */
function currentHourKey(timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:00`;
}

/** ヒスイ海岸周辺の潮位を取得する。失敗しても例外は投げず「不明」を返す。 */
export async function fetchTideInfo(): Promise<TideInfo> {
  const { latitude, longitude, timezone } = location;

  const url =
    `${MARINE_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
    `&hourly=sea_level_height_msl&forecast_days=1&timezone=${encodeURIComponent(timezone)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Open-Meteo 潮位リクエスト失敗 (${res.status})`);
    }

    const data = (await res.json()) as MarineTideResponse;
    const times = data.hourly?.time ?? [];
    const levels = data.hourly?.sea_level_height_msl ?? [];

    const valid = levels.filter((v): v is number => typeof v === "number");
    if (times.length === 0 || valid.length === 0) {
      return UNKNOWN_TIDE;
    }

    // 現在時刻に一致する時間帯を探す。見つからなければ中央値の位置を使う。
    const key = currentHourKey(timezone);
    let index = times.findIndex((t) => t.startsWith(key));
    if (index === -1) index = Math.min(times.length - 1, Math.floor(times.length / 2));

    const seaLevel = typeof levels[index] === "number" ? (levels[index] as number) : null;

    // 前後1時間の値から潮の動きを判定する。
    const prev = typeof levels[index - 1] === "number" ? (levels[index - 1] as number) : null;
    const next = typeof levels[index + 1] === "number" ? (levels[index + 1] as number) : null;

    let trend: TideInfo["trend"] = "unknown";
    if (seaLevel !== null) {
      const reference = next ?? prev;
      if (reference !== null) {
        const diff = next !== null ? next - seaLevel : seaLevel - (prev as number);
        if (Math.abs(diff) < 0.03) trend = "steady";
        else trend = diff > 0 ? "rising" : "falling";
      }
    }

    return {
      seaLevel,
      trend,
      dailyMin: Math.min(...valid),
      dailyMax: Math.max(...valid),
    };
  } catch (error) {
    console.error("[tide] 潮位の取得に失敗しました:", error);
    return UNKNOWN_TIDE;
  }
}
