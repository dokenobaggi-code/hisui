# ヒスイ拾い予報 🟢

富山県朝日町・宮崎海岸周辺の**ヒスイ海岸**で、波情報と天気予報を毎日自動取得し、
**AIが「今日のヒスイ拾いおすすめ度（★1〜5）」を判定**するWebサイトのNext.jsプロジェクトです。

- 毎日 **05:00 (JST)** に自動実行：波取得 → 天気取得 → OpenAI判定 → Notion保存 → サイト更新
- トップページ：今日のおすすめ度・理由・波・天気・過去7日推移グラフ・ワンポイント・最終更新
- 履歴ページ：Notionに蓄積した記録の一覧
- ヒスイ配色（白 × エメラルドグリーン × 淡いブルー）・ダークモード・レスポンシブ対応

---

## 技術スタック

| 項目 | 採用 |
| --- | --- |
| フレームワーク | Next.js 14（App Router） |
| 言語 | TypeScript（strict） |
| スタイル | Tailwind CSS + shadcn/ui |
| グラフ | Recharts |
| ダークモード | next-themes |
| データ保存 | Notion API（`@notionhq/client`） |
| AI判定 | OpenAI API（`openai`） |
| 波・天気 | Open-Meteo（**APIキー不要 / 商用可 / 自動取得可**・CC BY 4.0） |
| 定期実行 | Vercel Cron |
| デプロイ | Vercel（GitHub連携で `main` push により自動デプロイ） |

> データソースについて：波・天気は [Open-Meteo](https://open-meteo.com/) を利用しています。
> APIキー不要で、非営利・商用ともに利用可能（データは CC BY 4.0、出典表記を推奨）。
> 自動取得（cron）も許容されています。キー方式の別APIに差し替えたい場合は
> `src/services/wave.ts` / `src/services/weather.ts` を実装差し替えするだけで対応できます。

---

## ディレクトリ構成

```
src/
  app/
    api/cron/route.ts   # 日次Cronエンドポイント（①〜⑤）
    history/page.tsx     # 履歴ページ
    layout.tsx           # 共通レイアウト（テーマ/ヘッダ/フッタ）
    page.tsx             # トップページ
    actions.ts           # Server Actions（手動更新）
    globals.css          # テーマ変数・配色
  components/            # UI・機能コンポーネント
    ui/                  # shadcn/ui（card/button/badge/table）
  lib/                   # config（環境変数）/ utils / tips
  services/              # wave / weather / ai / notion / pipeline / home
  hooks/                 # useMounted など
  types/                 # ドメイン型
  scripts/seed.mjs       # ローカル検証用シード
```

---

## セットアップ手順

詳細は [`SETUP.md`](./SETUP.md) を参照してください（Notion / OpenAI / GitHub / Vercel の具体手順つき）。概要は以下。

### 1. 依存インストール

```bash
npm install
```

### 2. 環境変数

`.env.example` を `.env.local` にコピーして値を設定します。

```bash
cp .env.example .env.local
```

| 変数 | 内容 |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI APIキー |
| `OPENAI_MODEL` | 使用モデル（任意・既定 `gpt-4o-mini`） |
| `NOTION_TOKEN` | Notion内部インテグレーションのトークン |
| `NOTION_DATABASE_ID` | 保存先データベースID |
| `WEATHER_API_KEY` | 任意（Open-Meteo利用時は不要） |
| `WAVE_API_KEY` | 任意（Open-Meteo利用時は不要） |
| `CRON_SECRET` | Cron保護用の任意ランダム文字列 |
| `HISUI_LATITUDE` / `HISUI_LONGITUDE` / `HISUI_TIMEZONE` | 対象地点（任意・既定はヒスイ海岸） |

### 3. 開発サーバー

```bash
npm run dev
# http://localhost:3000
```

> `.env.local` が未設定でも、トップページは波・天気（キー不要）＋ルールベース判定で表示されます。
> Notion保存やOpenAI判定を試すには各キーの設定が必要です。

### 4. 当日データを手動生成（任意）

開発サーバー起動中に別ターミナルで：

```bash
npm run seed
```

---

## Notion データベースの列

以下の列を作成してください（型は [`SETUP.md`](./SETUP.md) 参照）。

`Date` / `WaveHeight` / `WavePeriod` / `WindDirection` / `WindSpeed` /
`Weather` / `Temperature` / `HighTemperature` / `LowTemperature` /
`RainProbability` / `AIScore` / `Recommendation` / `Reason` / `CreatedAt`

---

## 定期実行（Vercel Cron）

`vercel.json` で `/api/cron` を毎日 **20:00 UTC = 05:00 JST** に実行します。

```json
{ "crons": [{ "path": "/api/cron", "schedule": "0 20 * * *" }] }
```

Cronエンドポイントは `Authorization: Bearer <CRON_SECRET>`（Vercelが自動付与）または
`?secret=<CRON_SECRET>` で保護されます。

---

## AI判定について

`src/services/ai.ts` で、波高・波周期・風速・風向・天気・降水確率をOpenAIに渡し、
おすすめ度（1〜5）と理由を生成します。OpenAIが利用できない場合は、
安全側に倒したルールベース判定へ自動フォールバックします（サイトを止めないため）。

---

## 将来の拡張

サービス層・型・コンポーネントを分離しているため、以下を追加しやすい構成です。

- ヒスイ拾いスポット紹介 / ヒスイ図鑑 / 見分け方（`app/` にページ追加）
- ユーザー投稿（`services/` にデータソース追加）
- 過去データ分析 / おすすめ日ランキング（`services/notion.ts` のクエリ拡張）

---

## コード品質

```bash
npm run typecheck   # 型チェック（strict）
npm run lint        # ESLint
npm run format      # Prettier整形
```

---

## ライセンス / 注意

- 気象・海況データ：© Open-Meteo.com（CC BY 4.0）
- 本サイトの表示は参考情報です。実際の海況は現地・自治体の情報を確認し、安全第一で行動してください。
