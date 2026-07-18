# セットアップ手順（あなたの操作が必要な工程）

このプロジェクトは、コード自体は完成済みです。以下は **ログイン・アカウント操作が必要なため、あなた自身に実施いただく工程** です。上から順に進めてください。

所要時間の目安：30〜45分。

---

## 0. 事前準備

- Node.js 18.18 以上（推奨 20 LTS）… `node -v` で確認
- Git … `git -v` で確認
- アカウント：GitHub / Vercel / Notion / OpenAI

プロジェクトを作業フォルダへ配置します（PowerShell）。

```powershell
mkdir C:\dev\hisui -Force
# このプロジェクトの中身を C:\dev\hisui にコピー（zipを展開 or フォルダを移動）
cd C:\dev\hisui
npm install
```

---

## 1. OpenAI APIキーの取得

1. https://platform.openai.com/api-keys にログイン
2. **Create new secret key** を押す
3. 表示されたキー（`sk-...`）をコピー（**一度しか表示されません**）
4. 支払い方法が未登録なら **Billing** で登録（無料枠が切れると 401/429 になります）

→ 後で `.env.local` の `OPENAI_API_KEY` に設定します。

---

## 2. Notion データベースの作成とインテグレーション

### 2-1. データベースを作る

1. Notionで新規ページを作成し、`/database` → **Table - Full page** を追加
2. 下記の列を作成（**列名・型を正確に**）

| 列名 | 型 |
| --- | --- |
| （既定のタイトル列） | Title ※名前は任意。中身は日付が入ります |
| `Date` | Date |
| `WaveHeight` | Number |
| `WavePeriod` | Number |
| `WindDirection` | Number |
| `WindSpeed` | Number |
| `Weather` | Text |
| `Temperature` | Number |
| `HighTemperature` | Number |
| `LowTemperature` | Number |
| `RainProbability` | Number |
| `AIScore` | Number |
| `Recommendation` | Text |
| `Reason` | Text |
| `CreatedAt` | Date |

> タイトル列は消せません。名前は「Name」でも「タイトル」でも構いません
> （アプリがスキーマから自動検出して日付を書き込みます）。

### 2-2. インテグレーションを作る

1. https://www.notion.so/my-integrations → **New integration**
2. 名前（例：`hisui-bot`）を付け、対象ワークスペースを選択して作成
3. **Internal Integration Token**（`ntn_...` または `secret_...`）をコピー
   → `.env.local` の `NOTION_TOKEN`

### 2-3. データベースにインテグレーションを接続

1. 作成したデータベースのページを開く
2. 右上 **…（メニュー）** → **Connections（接続）** → 先ほどのインテグレーションを追加

### 2-4. データベースIDを取得

データベースをブラウザで開いたときのURL：

```
https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                       └──────────── この32文字がID ────────────┘
```

この32文字を `.env.local` の `NOTION_DATABASE_ID` に設定します（ハイフンあり/なしどちらでも可）。

---

## 3. `.env.local` を記入

`C:\dev\hisui\.env.local` を開き、実際の値を入れます。

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEATHER_API_KEY=
WAVE_API_KEY=
CRON_SECRET=（長いランダム文字列。下記コマンドで生成可）
HISUI_LATITUDE=36.945
HISUI_LONGITUDE=137.545
HISUI_TIMEZONE=Asia/Tokyo
```

`CRON_SECRET` の生成（PowerShell）：

```powershell
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

### 動作確認（ローカル）

```powershell
npm run dev
# 別ターミナルで
npm run seed   # Notionに1件保存され、トップ/履歴に反映されればOK
```

---

## 4. GitHub リポジトリへ push

> ⚠️ 認証（GitHubログイン）が必要な工程です。

```powershell
cd C:\dev\hisui
git init
git add .
git commit -m "chore: initial commit - ヒスイ拾い予報"
git branch -M main
```

GitHubで空のリポジトリ（例：`hisui`）を作成後：

```powershell
git remote add origin https://github.com/<あなたのユーザー名>/hisui.git
git push -u origin main
```

> 初回pushでブラウザ認証（またはPersonal Access Token）を求められます。画面の指示に従ってください。
> `.env.local` は `.gitignore` 済みのため push されません（キーは漏れません）。

---

## 5. Vercel へデプロイ

> ⚠️ 認証（Vercelログイン）が必要な工程です。

1. https://vercel.com にGitHubアカウントでログイン
2. **Add New… → Project** → 先ほどの `hisui` リポジトリを **Import**
3. Framework は自動で **Next.js** が選択されます。そのまま進めます
4. **Environment Variables** に `.env.local` と同じ内容を登録：
   - `OPENAI_API_KEY` / `OPENAI_MODEL` / `NOTION_TOKEN` / `NOTION_DATABASE_ID`
   - `CRON_SECRET`（← Vercel Cronの認可に必須）
   - `HISUI_LATITUDE` / `HISUI_LONGITUDE` / `HISUI_TIMEZONE`（任意）
   - `WEATHER_API_KEY` / `WAVE_API_KEY`（Open-Meteo利用時は空でOK）
5. **Deploy** を押す

これで `main` ブランチへ push するたびに自動デプロイされます。

### Cron の確認

- `vercel.json` の設定により、Vercelプロジェクトの **Settings → Cron Jobs** に
  `/api/cron`（毎日 20:00 UTC = 05:00 JST）が登録されます。
- 手動実行して確認する場合（本番URL）：

```
https://<あなたのドメイン>.vercel.app/api/cron?secret=<CRON_SECRET>
```

> Vercel Cron は Hobbyプランで「1日1回」まで対応。本設定は1日1回のため問題ありません。

---

## 6. 最終動作確認

- トップページ：おすすめ度・理由・波・天気・グラフ・ワンポイント・最終更新が表示される
- 履歴ページ：Notionのレコードが一覧表示される
- Notionデータベース：Cron実行後に新しい行が追加される

---

## トラブルシューティング

| 症状 | 原因 / 対処 |
| --- | --- |
| トップは出るが履歴が空 | Cronがまだ動いていない。`npm run seed` か `/api/cron?secret=...` で1件生成 |
| `NOTION_TOKEN が未設定` エラー | `.env.local`（ローカル）/ Vercel環境変数（本番）を確認 |
| Notion保存で `object_not_found` | データベースにインテグレーションを **Connections** で接続したか確認 |
| Notion保存で `validation_error` | 列名が README の通りか、型が一致しているか確認 |
| OpenAIが 401/429 | キー誤り or 請求未設定 or レート超過。フォールバック判定に切り替わります |
| Cronが動かない | Vercelに `CRON_SECRET` を設定したか、`vercel.json` がデプロイに含まれるか確認 |
