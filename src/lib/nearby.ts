/**
 * ヒスイ海岸（富山県朝日町 宮崎・境海岸）周辺の宿泊施設・飲食店。
 *
 * 掲載方針:
 *  - 宿泊できる施設のみを「泊まる」に掲載する（キャンプ場等は対象外）
 *  - リンクは各施設の公式サイト・予約ページを優先する。無い場合は無理に載せない
 *  - 営業時間・料金・空室状況は変動するため保持せず、リンク先で確認してもらう
 *  - アクセスは出典で確認できた内容のみ記載し、不明な場合は推測しない
 *
 * 最寄駅:
 *  - あいの風とやま鉄道「越中宮崎駅」… ヒスイ海岸に最も近い駅
 *  - あいの風とやま鉄道「泊駅」… 朝日町の中心駅
 *  - 北陸新幹線「黒部宇奈月温泉駅」… 新幹線からの玄関口
 *
 * 出典: 各施設公式サイト / とやま観光ナビ / 朝日町観光協会 / 楽天トラベル / じゃらん / 食べログ
 */
import type { NearbySpot } from "@/types/spot";

/** Googleマップの検索リンク（座標を捏造しないため検索クエリ形式）。 */
function googleLink(query: string) {
  return {
    kind: "map" as const,
    label: "Googleで見る",
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  };
}

/**
 * 宿泊施設。ヒスイ海岸に近い順。
 * すべて宿泊可能な施設のみ。
 */
export const ACCOMMODATIONS: readonly NearbySpot[] = [
  {
    id: "misaki",
    name: "民宿 岬",
    category: "both",
    description:
      "宮崎海岸（ヒスイ海岸）沿いに建つ民宿。海側の部屋からは日本海を一望できます。ヒスイ拾いや海水浴の拠点に便利で、新鮮な海の幸が味わえます。",
    tags: ["海の幸", "海が見える部屋", "駅から徒歩5分"],
    access: {
      fromCoast: "ヒスイ海岸沿い（海に面する）",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「越中宮崎駅」から徒歩約5分。駅から歩いて行けます。",
      car: null,
    },
    links: [
      {
        kind: "booking",
        label: "楽天トラベルで予約",
        url: "https://travel.rakuten.co.jp/HOTEL/37354/37354.html",
      },
      googleLink("民宿 岬 富山県朝日町 宮崎"),
    ],
    isBeachfront: true,
    rakutenHotelNo: 37354,
  },
  {
    id: "ariiso",
    name: "料理旅館 有磯",
    category: "both",
    description:
      "ヒスイ海岸に面した料理旅館。名物のタラ汁をはじめ、鮮度抜群の魚料理が味わえます。宿泊のほか、日帰りの昼食や宴会にも利用できます。",
    tags: ["たら汁", "魚料理", "日帰り昼食可", "駅から徒歩1分"],
    access: {
      fromCoast: "ヒスイ海岸に面する",
      transitAvailable: true,
      transit:
        "あいの風とやま鉄道「越中宮崎駅」から徒歩約1分。北陸新幹線「黒部宇奈月温泉駅」からは「あさひまちエクスプレス」（要予約）で約25分。",
      car: "朝日ICから車で約8分",
    },
    links: [
      { kind: "official", label: "公式サイト", url: "https://www.asahimachi.com/ariiso/" },
      {
        kind: "booking",
        label: "楽天トラベルで予約",
        url: "https://travel.rakuten.co.jp/HOTEL/41374/41374.html",
      },
      { kind: "booking", label: "じゃらんで予約", url: "https://www.jalan.net/yad312647/" },
      googleLink("料理旅館 有磯 富山県朝日町 宮崎"),
    ],
    isBeachfront: true,
    rakutenHotelNo: 41374,
  },
  {
    id: "kinkai",
    name: "料理旅館 ドライブイン きんかい",
    category: "both",
    description:
      "1階は地元の人や長距離ドライバーに人気のドライブイン、2階が宿泊できるお宿。名物のタラ汁や漁師直送の海鮮が味わえます。鉄分を多く含む赤いお湯の風呂も特徴です。",
    tags: ["たら汁", "海鮮", "赤いお湯の風呂", "駅から徒歩7分"],
    access: {
      fromCoast: "ヒスイ海岸周辺（国道8号沿い）",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「越中宮崎駅」から徒歩約7分。駅から歩いて行けます。",
      car: "朝日ICから車で約8分（大型車も駐車可）",
    },
    links: [
      {
        kind: "booking",
        label: "近畿日本ツーリストで予約",
        url: "https://yado.knt.co.jp/st/S160117/",
      },
      {
        kind: "tabelog",
        label: "食べログで見る",
        url: "https://tabelog.com/toyama/A1602/A160203/16000043/",
      },
      googleLink("ドライブインきんかい 富山県朝日町 境"),
    ],
    isBeachfront: false,
  },
  {
    id: "akebono",
    name: "旅館 あけぼの",
    category: "both",
    description:
      "日本海の新鮮なカニ、タラをはじめとした魚料理が自慢の旅館。黒部峡谷へも車で約20分と、観光の拠点に便利です。",
    tags: ["カニ", "タラ", "魚料理"],
    access: {
      fromCoast: "ヒスイ海岸まで車で約5分",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「泊駅」から徒歩約11分。駅から歩いて行けます。",
      car: "朝日ICから車で約5分",
    },
    links: [googleLink("旅館 あけぼの 富山県朝日町")],
    isBeachfront: false,
  },
  {
    id: "monza",
    name: "料理旅館 紋左",
    category: "both",
    description:
      "朝日町の中心部にあり、山・川・海いずれの観光拠点にも便利な料理旅館。地産地消の食材を使った料理が自慢で、タラ汁やバタバタ茶が味わえます。季節限定でカニ料理・アワビ料理も提供しています。",
    tags: ["たら汁", "バタバタ茶", "地産地消", "季節限定のカニ"],
    access: {
      fromCoast: null,
      transitAvailable: true,
      transit: "あいの風とやま鉄道「泊駅」から徒歩約11分（約810m）。駅から歩いて行けます。",
      car: null,
    },
    links: [
      { kind: "official", label: "公式サイト", url: "https://www.toyama-monza.com/" },
      googleLink("料理旅館 紋左 富山県朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "shiroyamaso",
    name: "旅館 城山荘",
    category: "both",
    description:
      "郷土料理のたら汁をはじめ、海の幸を中心とした夕食が評判。契約農家から仕入れるコシヒカリも好評です。Wi-Fiや洗濯機を備え、長期滞在にも対応しています。",
    tags: ["たら汁", "海の幸", "長期滞在向け", "Wi-Fi"],
    access: {
      fromCoast: null,
      transitAvailable: true,
      transit:
        "あいの風とやま鉄道「泊駅」から約1.6km・徒歩約20分。歩けますが、タクシーなら約5分です。",
      car: "朝日ICから約3km・車で約5分",
    },
    links: [
      { kind: "official", label: "公式サイト", url: "https://r.goope.jp/shiroyamasou/" },
      { kind: "booking", label: "じゃらんで予約", url: "https://www.jalan.net/yad312199/" },
      googleLink("旅館 城山荘 富山県朝日町 横尾"),
    ],
    isBeachfront: false,
  },
  {
    id: "ogawa",
    name: "小川温泉元湯 ホテルおがわ",
    category: "stay",
    description:
      "山あいに佇む秘湯の一軒宿。開湯400年、源泉かけ流しの天然温泉で、古くから湯治の湯として親しまれています。ヒスイ拾いの後にゆっくり温まりたい人向けです。",
    tags: ["温泉", "源泉かけ流し", "秘湯", "無料送迎あり"],
    access: {
      fromCoast: null,
      transitAvailable: true,
      transit:
        "駅からは離れていますが、無料送迎バスがあります（要予約）。あいの風とやま鉄道「泊駅」へは14〜16時、北陸新幹線「黒部宇奈月温泉駅」へは14時・15時・16時にお迎え。徒歩では行けないため、必ず事前予約してください。",
      car: "朝日ICから国道8号経由で約15分",
    },
    links: [
      { kind: "official", label: "公式サイト", url: "https://www.ogawaonsen.co.jp/" },
      {
        kind: "booking",
        label: "楽天トラベルで予約",
        url: "https://travel.rakuten.co.jp/HOTEL/1971/1971.html",
      },
      { kind: "booking", label: "じゃらんで予約", url: "https://www.jalan.net/yad316854/" },
      googleLink("小川温泉元湯 ホテルおがわ"),
    ],
    isBeachfront: false,
    rakutenHotelNo: 1971,
  },
  {
    id: "matasaburo",
    name: "ゲストハウス 又三郎",
    category: "stay",
    description:
      "笹川地区にある一棟貸しの家主滞在型ゲストハウス。日本舞踊師範のホストによる着物の着付けや踊りの体験のほか、ヨガ・藍染・陶芸、ヒスイ探しなどの体験もできます。",
    tags: ["一棟貸し", "体験プログラム", "古民家"],
    access: {
      fromCoast: null,
      transitAvailable: false,
      transit:
        "山あいの笹川地区にあり、公共交通機関だけで行くのは困難です。あいの風とやま鉄道「泊駅」からタクシー、またはレンタカーの利用をおすすめします。予約時に送迎の可否を確認してください。",
      car: null,
    },
    links: [googleLink("ゲストハウス 又三郎 富山県朝日町 笹川")],
    isBeachfront: false,
  },
] as const;

/** 飲食店。1軒ずつ掲載し、それぞれ食べログとGoogleのリンクを持たせる。 */
export const RESTAURANTS: readonly NearbySpot[] = [
  {
    id: "sakae",
    name: "栄食堂",
    category: "eat",
    description:
      "国道8号「たら汁街道」沿いの食堂。アルミ鍋でドンと出てくるたら汁が名物で、たら・ごぼう・ねぎというシンプルな具材ながら、たらの旨みが汁にしみ出た味わいが評判です。定食や丼もの、魚料理も揃います。",
    tags: ["たら汁", "定食", "郷土料理"],
    access: {
      fromCoast: "ヒスイ海岸周辺（国道8号沿い）",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「越中宮崎駅」から徒歩約15分。駅から歩いて行けます。",
      car: "国道8号沿い・駐車場あり",
    },
    links: [
      {
        kind: "tabelog",
        label: "食べログで見る",
        url: "https://tabelog.com/toyama/A1602/A160203/16000563/",
      },
      googleLink("栄食堂 富山県朝日町 宮崎"),
    ],
    isBeachfront: false,
  },
  {
    id: "kanamori",
    name: "金森ドライブイン（ドライブイン金森）",
    category: "eat",
    description:
      "1968年創業、たら汁街道沿いの老舗ドライブイン。テーブルと座敷を合わせて約80席と広く、大型トラックも停められる駐車場を備えています。新鮮で豪快なたら汁が味わえます。",
    tags: ["たら汁", "老舗", "広い駐車場"],
    access: {
      fromCoast: "ヒスイ海岸周辺（国道8号沿い）",
      transitAvailable: true,
      transit:
        "あいの風とやま鉄道「越中宮崎駅」が最寄りです。国道8号沿いのため、徒歩の場合は車道の通行にご注意ください。",
      car: "国道8号沿い・大型車も駐車可",
    },
    links: [
      {
        kind: "tabelog",
        label: "食べログで見る",
        url: "https://tabelog.com/toyama/A1602/A160203/16004328/",
      },
      googleLink("ドライブイン金森 富山県朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "kinkai-eat",
    name: "ドライブイン きんかい",
    category: "eat",
    description:
      "名物タラ汁定食が人気のドライブイン。漁師直送の海鮮や旬の料理も味わえます。宿泊もできる料理旅館です。",
    tags: ["たら汁定食", "海鮮", "宿泊も可"],
    access: {
      fromCoast: "ヒスイ海岸周辺（国道8号沿い）",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「越中宮崎駅」から徒歩約7分。駅から歩いて行けます。",
      car: "朝日ICから車で約8分（大型車も駐車可）",
    },
    links: [
      {
        kind: "tabelog",
        label: "食べログで見る",
        url: "https://tabelog.com/toyama/A1602/A160203/16000043/",
      },
      googleLink("ドライブインきんかい 富山県朝日町 境"),
    ],
    isBeachfront: false,
  },
  {
    id: "ariiso-eat",
    name: "料理旅館 有磯（日帰り昼食）",
    category: "eat",
    description:
      "ヒスイ海岸に面した料理旅館。宿泊しなくても、日帰りの昼食や宴会で利用できます。名物のタラ汁と鮮度抜群の魚料理が味わえ、ヒスイ拾いの前後の食事に便利な立地です。",
    tags: ["たら汁", "魚料理", "海が目の前", "駅から徒歩1分"],
    access: {
      fromCoast: "ヒスイ海岸に面する",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「越中宮崎駅」から徒歩約1分。駅を出てすぐです。",
      car: "朝日ICから車で約8分",
    },
    links: [
      {
        kind: "tabelog",
        label: "食べログで見る",
        url: "https://tabelog.com/toyama/A1602/A160203/16005285/",
      },
      { kind: "official", label: "公式サイト", url: "https://www.asahimachi.com/ariiso/" },
      googleLink("料理旅館 有磯 富山県朝日町 宮崎"),
    ],
    isBeachfront: true,
  },
  {
    id: "yui",
    name: "お食事処 結",
    category: "eat",
    description: "懐かしい雰囲気の店内が印象的な食事処。地元の食材を使った料理が楽しめます。",
    tags: ["食事処", "地元の味"],
    access: {
      fromCoast: null,
      transitAvailable: true,
      transit:
        "あいの風とやま鉄道「越中宮崎駅」または「泊駅」が最寄りです。訪問前に食べログ・Googleマップで最新の場所と営業時間をご確認ください。",
      car: null,
    },
    links: [
      {
        kind: "tabelog",
        label: "食べログで探す",
        url: "https://tabelog.com/rstLst/?vs=1&sk=%E3%81%8A%E9%A3%9F%E4%BA%8B%E5%87%A6%20%E7%B5%90%20%E6%9C%9D%E6%97%A5%E7%94%BA",
      },
      googleLink("お食事処 結 富山県朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "tabelog-area",
    name: "その他のお店を探す",
    category: "eat",
    description:
      "宮崎・境海岸（ヒスイ海岸）周辺で営業中の飲食店を、食べログのランキングから探せます。上記以外の店や、最新の営業時間・定休日はこちらから確認してください。",
    tags: ["一覧", "ランチ"],
    access: {
      fromCoast: "ヒスイ海岸周辺",
      transitAvailable: true,
      transit: "越中宮崎駅・泊駅周辺のお店が中心です。",
      car: null,
    },
    links: [
      {
        kind: "tabelog",
        label: "食べログで周辺のお店を見る",
        url: "https://tabelog.com/lunch/toyama/S9/S131915/COND-0-2-1-0-0-0/",
      },
    ],
    isBeachfront: false,
  },
];

/** 観光・情報拠点。 */
export const INFO_SPOTS: readonly NearbySpot[] = [
  {
    id: "hisui-terrace",
    name: "ヒスイテラス",
    category: "info",
    description:
      "ヒスイ海岸のすぐ目の前にある観光拠点。ヒスイ探しのガイドが常駐しており、拾った石を見てもらうこともできます。屋上・屋外・屋内のテラスから海を眺めながら休憩できます。",
    tags: ["観光案内", "ヒスイ鑑定", "休憩"],
    access: {
      fromCoast: "ヒスイ海岸すぐ目の前",
      transitAvailable: true,
      transit: "あいの風とやま鉄道「越中宮崎駅」が最寄りです。",
      car: null,
    },
    links: [googleLink("ヒスイテラス 富山県朝日町")],
    isBeachfront: true,
  },
];
