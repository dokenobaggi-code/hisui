import type { Metadata } from "next";
import { Bed, KeyRound, MapPin, UtensilsCrossed } from "lucide-react";
import { NearbySpotCard } from "@/components/NearbySpotCard";
import { VacancyList } from "@/components/VacancyList";
import { CoinLockers } from "@/components/CoinLockers";
import { ACCOMMODATIONS, INFO_SPOTS, RESTAURANTS } from "@/lib/nearby";
import { searchVacancies, tonightParams } from "@/services/rakutenTravel";
import { todayIsoInJst } from "@/lib/utils";
import { location } from "@/lib/config";

export const metadata: Metadata = {
  title: "周辺情報",
  description:
    "ヒスイ海岸（富山県朝日町 宮崎・境海岸）周辺の宿泊施設・飲食店・コインロッカー。公共交通機関でのアクセス、公式・予約サイト、食べログへのリンクをまとめています。",
};

// 空室状況は変動するため動的レンダリング。
export const dynamic = "force-dynamic";

/** ページ内リンク（目次）。セクションが増えたらここに足すだけでよい。 */
const SECTIONS = [
  { id: "stay", label: "泊まる", icon: Bed },
  { id: "eat", label: "ごはん", icon: UtensilsCrossed },
  { id: "locker", label: "ロッカー", icon: KeyRound },
  { id: "info", label: "立ち寄る", icon: MapPin },
] as const;

export default async function NearbyPage() {
  const today = todayIsoInJst(location.timezone);
  const vacancies = await searchVacancies(tonightParams(today));

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-2 border-b border-border/60 pb-8">
        <span className="label-en font-hand block">Around Hisui Beach</span>
        <h1 className="flex items-center gap-2.5 text-2xl">
          <MapPin className="h-6 w-6 text-primary" />
          周辺情報
        </h1>
        <p className="text-xs tracking-wider text-muted-foreground">
          ヒスイ海岸（富山県朝日町 宮崎・境海岸）周辺の宿・ごはん・コインロッカーです。
        </p>
      </div>

      {/* 目次：各セクションへジャンプ */}
      <nav
        aria-label="ページ内目次"
        className="sticky top-16 z-30 -mx-2 rounded-xl border border-border/60 bg-background/90 p-2 backdrop-blur"
      >
        <ul className="flex gap-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.id} className="flex-1">
                <a
                  href={`#${section.id}`}
                  className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <section id="stay" className="scroll-mt-32 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Bed className="h-5 w-5 text-primary" />
          泊まる
        </h2>
        <p className="text-sm text-muted-foreground">
          ヒスイ海岸に近い順に並べています。荒天の翌朝は狙い目なので、前泊すると朝いちばんの浜を歩けます。
        </p>

        <VacancyList result={vacancies} knownSpots={ACCOMMODATIONS} />

        <div className="grid gap-4">
          {ACCOMMODATIONS.map((spot) => (
            <NearbySpotCard
              key={spot.id}
              spot={spot}
              vacancy={
                spot.rakutenHotelNo ? vacancies.byHotelNo[spot.rakutenHotelNo] : undefined
              }
            />
          ))}
        </div>
      </section>

      <section id="eat" className="scroll-mt-32 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          ごはん
        </h2>
        <p className="text-sm text-muted-foreground">
          この地域の名物は、スケトウダラとごぼう・ねぎを味噌で煮込んだ郷土料理「たら汁」です。国道8号沿いは
          「たら汁街道」と呼ばれ、味の異なる店が軒を連ねています。
        </p>
        <div className="grid gap-4">
          {RESTAURANTS.map((spot) => (
            <NearbySpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      <section id="locker" className="scroll-mt-32 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <KeyRound className="h-5 w-5 text-primary" />
          コインロッカー
        </h2>
        <CoinLockers />
      </section>

      <section id="info" className="scroll-mt-32 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <MapPin className="h-5 w-5 text-primary" />
          立ち寄る
        </h2>
        <div className="grid gap-4">
          {INFO_SPOTS.map((spot) => (
            <NearbySpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>

      <p className="rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        ※ 営業時間・定休日・料金・空室状況は変動します。おでかけ前に各施設の公式サイト・予約サイト・食べログで最新の情報をご確認ください。
      </p>
    </div>
  );
}
