/**
 * フォッサマグナミュージアム「石の鑑定」の開催日を推定する。
 *
 * 石の鑑定は主に土曜・日曜に実施されている（2026年7月の公式カレンダーでは
 * すべての土日が鑑定日「◎」、平日は「×」）。ただし臨時鑑定日「◆」や
 * 休館・変更もあるため、ここでは「土日を目安として表示」し、
 * 最終判断は必ず公式カレンダーで確認してもらう方針とする。
 *
 * ※ 特定日をハードコードしないのは、月ごとに変わる情報を古いまま
 *   表示してしまうのを避けるため。曜日ルールなら陳腐化しない。
 *
 * 公式カレンダー: https://fmm.geo-itoigawa.com/info/appraisal/
 */

export const APPRAISAL_CALENDAR_URL = "https://fmm.geo-itoigawa.com/info/appraisal/";

export interface AppraisalDay {
  /** YYYY-MM-DD */
  date: string;
  /** 鑑定実施の見込み（土日=あり） */
  likelyOpen: boolean;
  /** 今日かどうか */
  isToday: boolean;
}

/** JSTの YYYY-MM-DD 文字列を Date（正午JST基準）へ。 */
function parseJst(dateIso: string): Date {
  return new Date(`${dateIso}T12:00:00+09:00`);
}

/** 今日から days 日分の鑑定見込みカレンダーを返す。 */
export function getAppraisalWeek(todayIso: string, days = 7): AppraisalDay[] {
  const base = parseJst(todayIso);
  const result: AppraisalDay[] = [];

  for (let i = 0; i < days; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

    result.push({
      date: iso,
      likelyOpen: isWeekendJst(d),
      isToday: i === 0,
    });
  }

  return result;
}

/** JST基準で土日かどうかを判定。 */
function isWeekendJst(date: Date): boolean {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(date);
  return wd === "Sat" || wd === "Sun";
}
