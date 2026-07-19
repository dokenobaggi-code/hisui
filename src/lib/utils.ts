import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn/ui 標準の className マージヘルパー。 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** WMO weather code を日本語天気表現へ変換。 */
export function weatherCodeToJa(code: number): string {
  const map: Record<number, string> = {
    0: "快晴",
    1: "晴れ",
    2: "薄曇り",
    3: "くもり",
    45: "霧",
    48: "着氷性の霧",
    51: "弱い霧雨",
    53: "霧雨",
    55: "強い霧雨",
    56: "着氷性の霧雨",
    57: "強い着氷性の霧雨",
    61: "弱い雨",
    63: "雨",
    65: "強い雨",
    66: "着氷性の雨",
    67: "強い着氷性の雨",
    71: "弱い雪",
    73: "雪",
    75: "強い雪",
    77: "霧雪",
    80: "にわか雨",
    81: "強いにわか雨",
    82: "激しいにわか雨",
    85: "にわか雪",
    86: "強いにわか雪",
    95: "雷雨",
    96: "雹を伴う雷雨",
    99: "激しい雹を伴う雷雨",
  };
  return map[code] ?? "不明";
}

/** 風向き（度）を16方位の日本語へ変換。 */
export function degreesToCompassJa(deg: number): string {
  const dirs = [
    "北",
    "北北東",
    "北東",
    "東北東",
    "東",
    "東南東",
    "南東",
    "南南東",
    "南",
    "南南西",
    "南西",
    "西南西",
    "西",
    "西北西",
    "北西",
    "北北西",
  ];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return dirs[index] ?? "不明";
}

/** UVインデックスを「弱い/強い」などの区分と対策メッセージへ変換。 */
export function describeUvIndex(uv: number): {
  level: string;
  advice: string;
  tone: "low" | "moderate" | "high" | "veryhigh";
} {
  if (uv < 3) {
    return { level: "弱い", advice: "特別な対策は不要です。", tone: "low" };
  }
  if (uv < 6) {
    return {
      level: "中程度",
      advice: "日中は帽子や日焼け止めがあると安心です。",
      tone: "moderate",
    };
  }
  if (uv < 8) {
    return {
      level: "強い",
      advice: "帽子・日焼け止め・こまめな日陰休憩を。",
      tone: "high",
    };
  }
  if (uv < 11) {
    return {
      level: "非常に強い",
      advice: "長時間の浜歩きは日焼け対策を万全に。",
      tone: "veryhigh",
    };
  }
  return {
    level: "極端に強い",
    advice: "日中の外出は控えめに。対策を徹底してください。",
    tone: "veryhigh",
  };
}

/** スコア(1-5)を星文字列に変換。 */
export function scoreToStars(score: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(score)));
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
}

/** 日本標準時 (Asia/Tokyo) の YYYY-MM-DD を返す。 */
export function todayIsoInJst(timeZone = "Asia/Tokyo"): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

/** ISO日時を日本語の読みやすい表記へ整形。 */
export function formatJaDateTime(iso: string, timeZone = "Asia/Tokyo"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** ISO日付 (YYYY-MM-DD) を「M月D日(曜)」形式へ。 */
export function formatJaDate(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return dateIso;
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}
