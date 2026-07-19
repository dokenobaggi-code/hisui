/**
 * 過去1週間の波情報サービス。
 *
 * ヒスイは、荒天時の高波で海底からかき出され、浜へ拡散・打ち上げられる。
 * そのため「ここ数日どれだけ波が荒れたか」は、今どれだけヒスイが
 * 浜に散らばっているかの目安になる。過去7日間の日別波高を取得して見せる。
 *
 * データソース: Open-Meteo Marine API（past_days=7）
 */
import { location } from "@/lib/config";

const MARINE_ENDPOINT = "https://marine-api.open-meteo.com/v1/marine";

export interface PastWaveDay {
  /** YYYY-MM-DD */
  date: string;
  /** その日の最大波高 (m) */
  maxWaveHeight: number | null;
}

export interface PastWaveSummary {
  days: PastWaveDay[];
  /** 期間中の最大波高 (m) */
  peak: number | null;
  /** 荒れた日（1.2m以上）が何日あったか */
  roughDays: number;
  /** 拡散の目安コメント */
  comment: string;
}

interface MarinePastResponse {
  daily?: {
    time?: string[];
    wave_height_max?: (number | null)[];
  };
}

const EMPTY: PastWaveSummary = {
  days: [],
  peak: null,
  roughDays: 0,
  comment: "",
};

/** 過去7日間（当日を除く直近7日）の波高を取得する。失敗時は空を返す。 */
export async function fetchPastWeekWaves(): Promise<PastWaveSummary> {
  const { latitude, longitude, timezone } = location;

  const url =
    `${MARINE_ENDPOINT}?latitude=${latitude}&longitude=${longitude}` +
    `&daily=wave_height_max&past_days=7&forecast_days=1&timezone=${encodeURIComponent(timezone)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Open-Meteo 過去波情報の取得に失敗 (${res.status})`);

    const data = (await res.json()) as MarinePastResponse;
    const times = data.daily?.time ?? [];
    const heights = data.daily?.wave_height_max ?? [];

    // 末尾が当日。それを除いた直近7日を過去として扱う。
    const days: PastWaveDay[] = times.slice(0, 7).map((date, i) => ({
      date,
      maxWaveHeight: typeof heights[i] === "number" ? (heights[i] as number) : null,
    }));

    const valid = days
      .map((d) => d.maxWaveHeight)
      .filter((v): v is number => typeof v === "number");

    if (valid.length === 0) return EMPTY;

    const peak = Math.max(...valid);
    const roughDays = valid.filter((v) => v >= 1.2).length;

    return {
      days,
      peak,
      roughDays,
      comment: buildComment(peak, roughDays),
    };
  } catch (error) {
    console.error("[pastWaves] 過去の波情報の取得に失敗しました:", error);
    return EMPTY;
  }
}

function buildComment(peak: number, roughDays: number): string {
  if (roughDays >= 3 || peak >= 2.0) {
    return `直近1週間で最大${peak.toFixed(1)}mまで波が上がり、荒れた日が${roughDays}日ありました。浜にヒスイが拡散・打ち上げられている可能性が高い時期です。`;
  }
  if (roughDays >= 1 || peak >= 1.2) {
    return `直近1週間の最大波高は${peak.toFixed(1)}m。ほどよく波があった日があり、新しい石が打ち上げられているかもしれません。`;
  }
  return `直近1週間は最大${peak.toFixed(1)}mと比較的穏やかでした。浜のヒスイは動きが少なめの時期かもしれません。`;
}
