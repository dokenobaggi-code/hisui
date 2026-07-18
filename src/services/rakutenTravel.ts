/**
 * 楽天トラベル空室検索API サービス。
 *
 * ドキュメント: https://webservice.rakuten.co.jp/documentation/vacant-hotel-search
 * エンドポイント: https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426
 *
 * 認証には applicationId（クエリ）と accessKey（ヘッダーまたはクエリ）の両方が必要。
 * どちらも https://webservice.rakuten.co.jp/app/list で確認できる。
 *
 * 環境変数が未設定でもアプリは動作する（空室表示のみ無効化される）。
 */
import { location, rakutenConfig } from "@/lib/config";
import type { VacancyInfo, VacancySearchResult } from "@/types/spot";

const ENDPOINT = "https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426";

/** 緯度経度検索の半径 (km)。APIの制約により 0.1〜3.0 の範囲。 */
const SEARCH_RADIUS_KM = 3;

interface RakutenHotelBasicInfo {
  hotelNo?: number;
  hotelName?: string;
  hotelMinCharge?: number | null;
  planListUrl?: string;
  hotelInformationUrl?: string;
}

interface RakutenResponse {
  hotels?: Array<{
    hotel?: Array<{ hotelBasicInfo?: RakutenHotelBasicInfo }>;
  }>;
  error?: string;
  error_description?: string;
}

export interface VacancySearchParams {
  /** YYYY-MM-DD */
  checkinDate: string;
  /** YYYY-MM-DD */
  checkoutDate: string;
  /** 大人人数（1〜10） */
  adultNum?: number;
}

/** 指定日から n 日後の YYYY-MM-DD を返す。 */
function addDays(dateIso: string, days: number): string {
  const d = new Date(`${dateIso}T00:00:00+09:00`);
  d.setDate(d.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: location.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** 今夜の宿泊（当日チェックイン・翌日チェックアウト）の検索条件を作る。 */
export function tonightParams(todayIso: string): VacancySearchParams {
  return {
    checkinDate: todayIso,
    checkoutDate: addDays(todayIso, 1),
    adultNum: 2,
  };
}

function disabled(reason: string, params: VacancySearchParams): VacancySearchResult {
  return {
    byHotelNo: {},
    hotels: [],
    checkinDate: params.checkinDate,
    checkoutDate: params.checkoutDate,
    available: false,
    unavailableReason: reason,
  };
}

/**
 * ヒスイ海岸周辺の空室を検索する。
 * APIキー未設定・API障害時も例外は投げず、available: false を返す。
 */
export async function searchVacancies(
  params: VacancySearchParams,
): Promise<VacancySearchResult> {
  const { applicationId, accessKey, affiliateId } = rakutenConfig;

  if (!applicationId || !accessKey) {
    return disabled("楽天トラベルAPIキーが未設定のため、空室情報は表示していません。", params);
  }

  const query = new URLSearchParams({
    applicationId,
    format: "json",
    // 世界測地系・度単位で緯度経度を指定する（datumType=1）
    datumType: "1",
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    searchRadius: String(SEARCH_RADIUS_KM),
    checkinDate: params.checkinDate,
    checkoutDate: params.checkoutDate,
    adultNum: String(params.adultNum ?? 2),
  });

  if (affiliateId) query.set("affiliateId", affiliateId);

  try {
    const res = await fetch(`${ENDPOINT}?${query.toString()}`, {
      // 空室状況は変動するため短時間だけキャッシュする
      next: { revalidate: 600 },
      headers: {
        Accept: "application/json",
        accessKey,
      },
    });

    if (!res.ok) {
      // 該当施設が無い場合もエラーコードが返るため、404系は「空室なし」として扱う
      if (res.status === 404) {
        return {
          byHotelNo: {},
          hotels: [],
          checkinDate: params.checkinDate,
          checkoutDate: params.checkoutDate,
          available: true,
          unavailableReason: null,
        };
      }
      throw new Error(`楽天トラベルAPI エラー (${res.status})`);
    }

    const data = (await res.json()) as RakutenResponse;

    const hotels: VacancyInfo[] = (data.hotels ?? [])
      .map((entry) => entry.hotel?.find((h) => h.hotelBasicInfo)?.hotelBasicInfo)
      .filter((info): info is RakutenHotelBasicInfo => Boolean(info?.hotelNo))
      .map((info) => ({
        hotelNo: info.hotelNo as number,
        hotelName: info.hotelName ?? "",
        minCharge: typeof info.hotelMinCharge === "number" ? info.hotelMinCharge : null,
        planListUrl: info.planListUrl ?? null,
        hotelInformationUrl: info.hotelInformationUrl ?? null,
        checkinDate: params.checkinDate,
        checkoutDate: params.checkoutDate,
      }));

    const byHotelNo: Record<number, VacancyInfo> = {};
    for (const hotel of hotels) byHotelNo[hotel.hotelNo] = hotel;

    return {
      byHotelNo,
      hotels,
      checkinDate: params.checkinDate,
      checkoutDate: params.checkoutDate,
      available: true,
      unavailableReason: null,
    };
  } catch (error) {
    console.error("[rakuten] 空室検索に失敗しました:", error);
    return disabled("空室情報を取得できませんでした。時間をおいて再度お試しください。", params);
  }
}
