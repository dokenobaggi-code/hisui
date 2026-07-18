/**
 * ヒスイ海岸（富山県朝日町 宮崎・境海岸）周辺の宿泊・飲食スポット。
 *
 * 出典:
 *  - 朝日町観光協会「あさひ暮らし旅」 https://www.asahi-tabi.com/asahi_kanko/stay/
 *  - 朝日町ホームページ（名物たら汁）
 *  - 楽天トラベル / 食べログ
 *
 * 掲載方針:
 *  - 営業時間・料金・空室状況は変動するため保持しない（リンク先で確認してもらう）
 *  - 距離・所要時間は出典で確認できたものだけ記載し、不明な場合は null にする
 *
 * 最寄駅: あいの風とやま鉄道「越中宮崎駅」（ヒスイ海岸に最も近い駅）
 */
import type { NearbySpot } from "@/types/spot";

/** Googleマップの検索リンクを組み立てる（座標を捏造しないため検索クエリ形式）。 */
function mapLink(query: string) {
  return {
    kind: "map" as const,
    label: "地図で見る",
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  };
}

/** 宿泊施設。ヒスイ海岸に近い順に並べている。 */
export const ACCOMMODATIONS: readonly NearbySpot[] = [
  {
    id: "misaki",
    name: "民宿 岬",
    category: "both",
    description:
      "宮崎海岸（ヒスイ海岸）沿いに建つ民宿。海側の部屋からは日本海を一望できます。ヒスイ拾いや海水浴の拠点に便利で、新鮮な海の幸が味わえます。",
    tags: ["海の幸", "海が見える部屋", "駅近"],
    access: {
      fromCoast: "ヒスイ海岸沿い（海に面する）",
      transit: "あいの風とやま鉄道 越中宮崎駅から徒歩約5分",
      car: null,
    },
    links: [
      {
        kind: "booking",
        label: "楽天トラベルで予約",
        url: "https://travel.rakuten.co.jp/HOTEL/37354/37354.html",
      },
      {
        kind: "info",
        label: "施設情報",
        url: "https://www.kurobe-unazukionseneki.jp/spot/0765822489/",
      },
      mapLink("民宿 岬 富山県朝日町 宮崎"),
    ],
    isBeachfront: true,
    // 楽天トラベルの施設ページ travel.rakuten.co.jp/HOTEL/37354/ より
    rakutenHotelNo: 37354,
  },
  {
    id: "ariiso",
    name: "料理旅館 有磯",
    category: "both",
    description:
      "ヒスイ海岸に面した料理旅館。海水浴やヒスイ拾いの拠点に最適で、日帰りでの昼食や宴会にも利用できます。",
    tags: ["料理旅館", "日帰り昼食可", "宴会"],
    access: {
      fromCoast: "ヒスイ海岸に面する",
      transit: null,
      car: null,
    },
    links: [
      { kind: "official", label: "公式サイト", url: "https://www.asahimachi.com/ariiso/" },
      mapLink("料理旅館 有磯 富山県朝日町"),
    ],
    isBeachfront: true,
  },
  {
    id: "camp",
    name: "朝日ヒスイ海岸オートキャンプ場",
    category: "stay",
    description:
      "「日本の渚百選」のヒスイ海岸が目の前に広がるキャンプ場。海水浴やBBQのほか、釣りやウインドサーフィンなど海辺の遊びが楽しめます。",
    tags: ["キャンプ", "BBQ", "海が目の前"],
    access: {
      fromCoast: "ヒスイ海岸が目の前",
      transit: null,
      car: null,
    },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahi_kanko/stay/",
      },
      mapLink("朝日ヒスイ海岸オートキャンプ場"),
    ],
    isBeachfront: true,
  },
  {
    id: "akebono",
    name: "旅館 あけぼの",
    category: "both",
    description:
      "日本海の新鮮なカニ、タラをはじめとした魚料理が自慢の旅館。黒部峡谷へのアクセスも良く、観光の拠点として便利です。",
    tags: ["カニ", "タラ", "魚料理"],
    access: {
      fromCoast: "ヒスイ海岸まで車で約5分",
      transit: null,
      car: "黒部峡谷まで車で約20分",
    },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahimachi/347/",
      },
      mapLink("旅館 あけぼの 富山県朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "kinkai",
    name: "ドライブイン きんかい",
    category: "both",
    description:
      "1階は地元ドライバーにも人気のドライブイン、2階は宿泊できるお宿。名物のたら汁や漁師直送の海鮮が味わえます。",
    tags: ["たら汁", "海鮮", "食事のみ利用可"],
    access: {
      fromCoast: null,
      transit: null,
      car: "国道8号「たら汁街道」沿い",
    },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahi_kanko/stay/",
      },
      mapLink("ドライブイン きんかい 朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "shiroyamaso",
    name: "旅館 城山荘",
    category: "both",
    description:
      "郷土料理のたら汁をはじめ、海の幸を中心とした夕食が評判。Wi-Fiや洗濯機も備え、長期滞在にも対応しています。",
    tags: ["たら汁", "海の幸", "長期滞在向け"],
    access: { fromCoast: null, transit: null, car: null },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahi_kanko/stay/",
      },
      mapLink("旅館 城山荘 富山県朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "ogawa",
    name: "小川温泉元湯 ホテルおがわ",
    category: "stay",
    description:
      "山あいに佇む秘湯の一軒宿。開湯400年、源泉かけ流しの炭酸水素塩泉で、古くから湯治の湯として親しまれています。",
    tags: ["温泉", "源泉かけ流し", "秘湯"],
    access: { fromCoast: null, transit: null, car: null },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahi_kanko/stay/",
      },
      mapLink("小川温泉元湯 ホテルおがわ"),
    ],
    isBeachfront: false,
  },
  {
    id: "monza",
    name: "料理旅館 紋左",
    category: "both",
    description:
      "朝日町の中心部にあり、山・川・海いずれの観光拠点にも便利な料理旅館。地産地消の食材を使った料理が味わえます。",
    tags: ["地産地消", "料理旅館"],
    access: { fromCoast: null, transit: null, car: null },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahi_kanko/stay/",
      },
      mapLink("料理旅館 紋左 朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "matasaburo",
    name: "ゲストハウス 又三郎",
    category: "stay",
    description:
      "一棟貸しの家主滞在型ゲストハウス。着物の着付けや踊りの体験のほか、地区内でヨガ・藍染・陶芸、ヒスイ探しなどの体験もできます。",
    tags: ["一棟貸し", "体験プログラム"],
    access: { fromCoast: null, transit: null, car: null },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahi_kanko/stay/",
      },
      mapLink("ゲストハウス 又三郎 朝日町"),
    ],
    isBeachfront: false,
  },
] as const;

/** 飲食店・食事処。 */
export const RESTAURANTS: readonly NearbySpot[] = [
  {
    id: "tarajiru-kaido",
    name: "たら汁街道（国道8号沿い）",
    category: "eat",
    description:
      "ヒスイ海岸に近い国道8号沿いに、名物「たら汁」の看板を掲げた店が軒を連ねるエリア。スケトウダラ・ごぼう・ねぎ・味噌というシンプルな郷土料理で、店ごとに味が異なります。ヒスイ拾いの前後の食事に最適です。",
    tags: ["たら汁", "郷土料理", "エリア"],
    access: {
      fromCoast: "ヒスイ海岸周辺",
      transit: null,
      car: "国道8号沿い",
    },
    links: [
      {
        kind: "info",
        label: "たら汁街道を見る（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/sanpo/2023/07/19/5800/",
      },
      {
        kind: "info",
        label: "名物たら汁（朝日町）",
        url: "https://www.town.asahi.toyama.jp/kankojouhou/tokusanhin/tabemono/1450750203552.html",
      },
    ],
    isBeachfront: false,
  },
  {
    id: "tabelog-area",
    name: "ヒスイ海岸周辺のお店を探す",
    category: "eat",
    description:
      "宮崎・境海岸（ヒスイ海岸）周辺で営業中の飲食店を、食べログのランキングから探せます。最新の営業時間・定休日はこちらで確認してください。",
    tags: ["食べログ", "ランチ", "一覧"],
    access: { fromCoast: "ヒスイ海岸周辺", transit: null, car: null },
    links: [
      {
        kind: "tabelog",
        label: "食べログで周辺のお店を見る",
        url: "https://tabelog.com/lunch/toyama/S9/S131915/COND-0-2-1-0-0-0/",
      },
    ],
    isBeachfront: false,
  },
  {
    id: "sakae",
    name: "栄食堂",
    category: "eat",
    description:
      "たら汁街道の食堂。たら・ごぼう・ねぎというシンプルな具材ながら、たらの旨みが汁にしみ出た味わいが評判です。",
    tags: ["たら汁", "食堂"],
    access: { fromCoast: null, transit: null, car: "国道8号「たら汁街道」沿い" },
    links: [
      {
        kind: "tabelog",
        label: "食べログで探す",
        url: "https://tabelog.com/rstLst/?vs=1&sk=%E6%A0%84%E9%A3%9F%E5%A0%82%20%E6%9C%9D%E6%97%A5%E7%94%BA",
      },
      mapLink("栄食堂 富山県朝日町 宮崎"),
    ],
    isBeachfront: false,
  },
  {
    id: "kanamori",
    name: "ドライブイン金森",
    category: "eat",
    description:
      "たら汁街道沿いのドライブイン。新鮮で豪快な郷土料理のたら汁が味わえます。",
    tags: ["たら汁", "ドライブイン"],
    access: { fromCoast: null, transit: null, car: "国道8号「たら汁街道」沿い" },
    links: [
      {
        kind: "info",
        label: "紹介記事（KNB）",
        url: "https://www.knb.ne.jp/nannan/5559/",
      },
      mapLink("ドライブイン金森 朝日町"),
    ],
    isBeachfront: false,
  },
  {
    id: "yui",
    name: "お食事処 結",
    category: "eat",
    description: "朝日町の食事処。地元の食材を使った料理が楽しめます。",
    tags: ["食事処"],
    access: { fromCoast: null, transit: null, car: null },
    links: [
      {
        kind: "info",
        label: "施設情報（朝日町観光協会）",
        url: "https://www.asahi-tabi.com/asahimachi/333/",
      },
      mapLink("お食事処 結 朝日町"),
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
      "ヒスイ海岸を望む町の観光拠点。ヒスイ探しのガイドが常駐しており、拾った石を見てもらうこともできます。屋上・屋外・屋内のテラスでヒスイ海岸を眺めながら休憩できます。",
    tags: ["観光案内", "ヒスイ鑑定", "休憩"],
    access: { fromCoast: "ヒスイ海岸を望む立地", transit: null, car: null },
    links: [
      {
        kind: "info",
        label: "ヒスイテラスを見る",
        url: "https://www.asahi-tabi.com/category/%E3%83%92%E3%82%B9%E3%82%A4%E3%83%86%E3%83%A9%E3%82%B9/",
      },
      mapLink("ヒスイテラス 朝日町"),
    ],
    isBeachfront: true,
  },
];
