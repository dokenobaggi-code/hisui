/**
 * 周辺スポット（宿泊・飲食）の型定義。
 *
 * 営業時間・料金・空室状況は変動が激しく、静的データで持つと必ず陳腐化するため、
 * このアプリでは「変わりにくい情報（名称・立地・特徴・公式/予約先URL）」だけを保持し、
 * 最新の営業状況は各リンク先で確認してもらう方針とする。
 *
 * 将来、楽天トラベルAPIやじゃらんAPI等で空室・料金を動的取得する場合も、
 * この型に `availability` などを追加するだけで対応できる。
 */

/** スポットの種別。 */
export type SpotCategory = "stay" | "eat" | "both" | "info";

/** 外部リンク種別。 */
export type SpotLinkKind = "official" | "booking" | "tabelog" | "map" | "info";

export interface SpotLink {
  kind: SpotLinkKind;
  label: string;
  url: string;
}

/** ヒスイ海岸からの距離感。実測値が確認できたものだけ具体値を持つ。 */
export interface SpotAccess {
  /** ヒスイ海岸からの距離・所要時間（確認できた表現のみ。無い場合は null） */
  fromCoast: string | null;
  /** 公共交通機関でのアクセス（無い場合は null） */
  transit: string | null;
  /** 車でのアクセス（無い場合は null） */
  car: string | null;
}

export interface NearbySpot {
  id: string;
  name: string;
  category: SpotCategory;
  /** 特徴の説明 */
  description: string;
  /** 名物・特徴のタグ（たら汁、海の幸 など） */
  tags: string[];
  access: SpotAccess;
  links: SpotLink[];
  /** ヒスイ海岸に面している・目の前など、特に近い施設を強調するため */
  isBeachfront: boolean;
  /** 楽天トラベルの施設番号。分かっている場合のみ、リアルタイム空室と紐付ける */
  rakutenHotelNo?: number;
}

/**
 * 楽天トラベル空室検索APIから得られるリアルタイム空室情報。
 * APIキー未設定時は取得しないため、UI側は null を許容すること。
 */
export interface VacancyInfo {
  hotelNo: number;
  hotelName: string;
  /** 最安料金（円）。取得できない場合は null */
  minCharge: number | null;
  /** 予約プラン一覧ページ */
  planListUrl: string | null;
  /** 施設情報ページ */
  hotelInformationUrl: string | null;
  /** 検索条件（表示用） */
  checkinDate: string;
  checkoutDate: string;
}

/** 空室検索の実行結果。 */
export interface VacancySearchResult {
  /** 施設番号をキーにした空室情報 */
  byHotelNo: Record<number, VacancyInfo>;
  /** 検索でヒットした全施設（掲載リストに無い宿も含む） */
  hotels: VacancyInfo[];
  checkinDate: string;
  checkoutDate: string;
  /** APIキー未設定・エラー時は false */
  available: boolean;
  /** 利用できない理由（UI表示用） */
  unavailableReason: string | null;
}
