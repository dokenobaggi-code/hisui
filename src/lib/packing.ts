/**
 * ヒスイ拾いの持ち物リスト。
 * 季節で服装・靴が変わるため、夏・冬で分けて定義する。
 * 道具は季節共通。
 */

export type Season = "summer" | "winter";

export interface PackingGroup {
  title: string;
  items: { label: string; note?: string; recommended?: boolean }[];
}

export interface SeasonPacking {
  season: Season;
  label: string;
  /** 補足（冬の「普通の服でも可」など） */
  caption?: string;
  groups: PackingGroup[];
}

/** 共通の道具メモ。 */
export const TOOLS_NOTE =
  "道具は何もなくても拾えますが、スコップか「ヒスイ棒」があると砂利をかき分けやすく便利です。";

export const PACKING: Record<Season, SeasonPacking> = {
  summer: {
    season: "summer",
    label: "夏",
    groups: [
      {
        title: "服装",
        items: [
          { label: "半袖" },
          { label: "海パン" },
          { label: "帽子", recommended: true },
        ],
      },
      {
        title: "靴",
        items: [
          { label: "マリンシューズ", recommended: true },
          { label: "サンダル" },
          { label: "運動靴", note: "海に入らない場合は普通の運動靴でも可" },
        ],
      },
    ],
  },
  winter: {
    season: "winter",
    label: "冬",
    caption: "普通の服でも拾えます。",
    groups: [
      {
        title: "服装",
        items: [
          { label: "ウェーダー", recommended: true },
          { label: "防寒着" },
        ],
      },
      {
        title: "靴",
        items: [
          { label: "ウェーダー" },
          { label: "マリンシューズ" },
          { label: "運動靴", note: "海に入らない場合は普通の運動靴でも可" },
        ],
      },
    ],
  },
};

/** 月から季節を推定する（5〜10月＝夏、11〜4月＝冬）。 */
export function seasonOf(dateIso: string): Season {
  const month = Number(dateIso.split("-")[1] ?? "0");
  return month >= 5 && month <= 10 ? "summer" : "winter";
}
