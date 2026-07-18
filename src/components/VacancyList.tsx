import { BedDouble, ExternalLink } from "lucide-react";
import type { NearbySpot, VacancySearchResult } from "@/types/spot";

interface VacancyListProps {
  result: VacancySearchResult;
  /** 掲載済みの宿。ここに含まれる施設は重複表示しない */
  knownSpots: readonly NearbySpot[];
}

/**
 * 楽天トラベルのリアルタイム空室一覧。
 *
 * 掲載リストに載っていない宿だけをここに表示する
 * （掲載済みの宿は各カード内に空室バッジとして表示されるため）。
 * APIキー未設定時は、設定方法への案内を控えめに表示する。
 */
export function VacancyList({ result, knownSpots }: VacancyListProps) {
  // APIキー未設定・取得失敗時は何も表示しない。
  // 理由はサーバーログにのみ残し、訪問者には開発者向けメッセージを見せない。
  if (!result.available) return null;

  const knownNos = new Set(
    knownSpots.map((s) => s.rakutenHotelNo).filter((n): n is number => typeof n === "number"),
  );
  const others = result.hotels.filter((h) => !knownNos.has(h.hotelNo));

  if (others.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-accent/30 p-4">
      <div className="flex items-center gap-2">
        <BedDouble className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">
          今夜空室のある周辺の宿（楽天トラベル）
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        {result.checkinDate} 〜 {result.checkoutDate}・大人2名・ヒスイ海岸から半径3km
      </p>

      <ul className="space-y-2">
        {others.map((hotel) => (
          <li
            key={hotel.hotelNo}
            className="flex flex-wrap items-center gap-2 rounded-md bg-background/70 px-3 py-2"
          >
            <span className="text-sm font-medium">{hotel.hotelName}</span>
            {hotel.minCharge !== null && (
              <span className="text-sm text-muted-foreground">
                {hotel.minCharge.toLocaleString()}円〜
              </span>
            )}
            {hotel.planListUrl && (
              <a
                href={hotel.planListUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                プランを見る
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
