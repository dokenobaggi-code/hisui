import type { Metadata } from "next";
import { Bed, MapPin, UtensilsCrossed } from "lucide-react";
import { NearbySpotCard } from "@/components/NearbySpotCard";
import { VacancyList } from "@/components/VacancyList";
import { ACCOMMODATIONS, INFO_SPOTS, RESTAURANTS } from "@/lib/nearby";
import { searchVacancies, tonightParams } from "@/services/rakutenTravel";
import { todayIsoInJst } from "@/lib/utils";
import { location } from "@/lib/config";

export const metadata: Metadata = {
  title: "周辺の宿・ごはん",
  description:
    "ヒスイ海岸（富山県朝日町 宮崎・境海岸）周辺の宿泊施設と飲食店。アクセス、予約サイト・食べログへのリンクをまとめています。",
};

// 空室状況は変動するため動的レンダリング。
export const dynamic = "force-dynamic";

export default async function NearbyPage() {
  const today = todayIsoInJst(location.timezone);
  const vacancies = await searchVacancies(tonightParams(today));

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <MapPin className="h-7 w-7 text-primary" />
          周辺の宿・ごはん
        </h1>
        <p className="text-sm text-muted-foreground">
          ヒスイ海岸（富山県朝日町 宮崎・境海岸）周辺の宿泊施設と食事処です。
        </p>
      </div>

      <section className="space-y-4">
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

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          食べる
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

      <section className="space-y-4">
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
        掲載情報は朝日町観光協会「あさひ暮らし旅」および朝日町公式サイトを参考にしています。
      </p>
    </div>
  );
}
