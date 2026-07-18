import {
  Bed,
  ExternalLink,
  Footprints,
  Car,
  MapPin,
  UtensilsCrossed,
  Info as InfoIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NearbySpot, SpotCategory, VacancyInfo } from "@/types/spot";

const CATEGORY_ICON: Record<SpotCategory, typeof Bed> = {
  stay: Bed,
  eat: UtensilsCrossed,
  both: Bed,
  info: InfoIcon,
};

const CATEGORY_LABEL: Record<SpotCategory, string> = {
  stay: "宿泊",
  eat: "食事",
  both: "宿泊・食事",
  info: "観光案内",
};

interface NearbySpotCardProps {
  spot: NearbySpot;
  /** 楽天トラベルのリアルタイム空室情報（未取得・対象外の場合は undefined） */
  vacancy?: VacancyInfo;
}

/** 周辺スポット1件分のカード。 */
export function NearbySpotCard({ spot, vacancy }: NearbySpotCardProps) {
  const Icon = CATEGORY_ICON[spot.category];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Icon className="h-5 w-5 shrink-0 text-primary" />
          <CardTitle className="text-base">{spot.name}</CardTitle>
          {spot.isBeachfront && (
            <Badge className="bg-primary/15 text-primary">ヒスイ海岸すぐ</Badge>
          )}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">{CATEGORY_LABEL[spot.category]}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-foreground/85">{spot.description}</p>

        {/* 楽天トラベルAPIが有効な場合のみ、リアルタイムの空室・最安料金を表示 */}
        {vacancy && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              空室あり
            </span>
            {vacancy.minCharge !== null && (
              <span className="text-sm text-foreground/85">
                最安 {vacancy.minCharge.toLocaleString()}円〜
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {vacancy.checkinDate} 〜 {vacancy.checkoutDate}・大人2名
            </span>
            {vacancy.planListUrl && (
              <a
                href={vacancy.planListUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-auto inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                プランを見る
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {spot.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {spot.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* アクセス情報（確認できた項目のみ表示） */}
        {(spot.access.fromCoast || spot.access.transit || spot.access.car) && (
          <ul className="space-y-1.5 rounded-lg bg-muted/40 p-3 text-sm">
            {spot.access.fromCoast && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                <span>{spot.access.fromCoast}</span>
              </li>
            )}
            {spot.access.transit && (
              <li className="flex items-start gap-2">
                <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{spot.access.transit}</span>
              </li>
            )}
            {spot.access.car && (
              <li className="flex items-start gap-2">
                <Car className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{spot.access.car}</span>
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {spot.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
