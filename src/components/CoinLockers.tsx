import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { MapPin, Train } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockerIllustration } from "@/components/LockerIllustration";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * 実写があればそれを、なければイラストを表示する。
 *
 * 写真の置き方（どちらでもOK・ファイル名は自由）:
 *  1) public/lockers/ フォルダを作り、その中に画像を1枚入れる（推奨・名前は何でも可）
 *  2) public/coin-lockers.jpg などの決め打ち名で置く
 */
function findLockerPhoto(): string | null {
  const publicDir = path.join(process.cwd(), "public");

  // 1) public/lockers/ の中の最初の画像
  const lockersDir = path.join(publicDir, "lockers");
  if (existsSync(lockersDir)) {
    try {
      const file = readdirSync(lockersDir)
        .filter((f) => IMAGE_EXT.includes(path.extname(f).toLowerCase()))
        .sort()[0];
      if (file) return `/lockers/${file}`;
    } catch {
      // 読み取り失敗時は次の候補へ
    }
  }

  // 2) 決め打ちのファイル名
  for (const name of ["coin-lockers.jpg", "coin-lockers.jpeg", "coin-lockers.png"]) {
    if (existsSync(path.join(publicDir, name))) return `/${name}`;
  }

  return null;
}

/** コインロッカーの拠点。 */
const LOCKERS = [
  {
    id: "station",
    name: "越中宮崎駅",
    icon: Train,
    points: [
      "ヒスイ海岸の最寄り駅",
      "100円を入れて、あとで戻ってくるタイプ（実質無料）",
    ],
  },
  {
    id: "terrace",
    name: "ヒスイテラス",
    icon: MapPin,
    points: [
      "観光拠点「ヒスイテラス」館内にも設置",
      "無料で使えるロッカー",
      "キャリーケースは入らない小さめサイズ",
    ],
  },
] as const;

/**
 * コインロッカーの案内。
 * 濡れた道具や荷物を預けたいときの拠点を、手書き風イラストとともに紹介する。
 */
export function CoinLockers() {
  const photo = findLockerPhoto();

  return (
    <Card className="dashed-frame border-none">
      <CardHeader className="pb-3">
        <CardTitle>コインロッカー</CardTitle>
        <p className="pt-1 text-xs text-muted-foreground">
          濡れた道具や荷物を預けたいときに。越中宮崎駅は100円リターン式、ヒスイテラスは無料で使えます。
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {photo ? (
            <figure className="mx-auto w-full max-w-[220px] shrink-0 sm:mx-0 sm:w-44">
              <Image
                src={photo}
                alt="越中宮崎駅のコインロッカー"
                width={320}
                height={320}
                className="w-full rounded-2xl border border-border object-cover"
              />
              <figcaption className="mt-1.5 text-center text-[11px] text-muted-foreground">
                写真は越中宮崎駅のロッカー
              </figcaption>
            </figure>
          ) : (
            <LockerIllustration className="mx-auto h-28 w-28 shrink-0 sm:mx-0" />
          )}

          <ul className="flex-1 space-y-4">
            {LOCKERS.map((locker) => {
              const Icon = locker.icon;
              return (
                <li key={locker.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-bold">{locker.name}</span>
                  </div>
                  <ul className="space-y-1 pl-6">
                    {locker.points.map((p) => (
                      <li
                        key={p}
                        className="relative text-sm text-foreground/80 before:absolute before:-left-4 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-4 rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          お問い合わせ：ヒスイテラス（越中宮崎駅前）TEL 0765-83-3015／開館 8:30〜17:00（4〜10月）・9:00〜15:30（11〜3月）。
          開館時間外は朝日町役場企画振興課 TEL 0765-83-1100。空き状況は変わるため、当日ご確認ください。
        </p>
      </CardContent>
    </Card>
  );
}
