/**
 * Notion データベース連携サービス。
 *
 * - saveDailyRecord: 1日分の観測＋判定を1ページとして保存
 * - getLatestRecord:  最新の保存レコードを取得（トップページ用）
 * - getScoreTrend:    直近N日のおすすめ度推移を取得（グラフ用）
 * - getHistory:       履歴一覧を取得（履歴ページ用）
 *
 * DBの列名は lib/config.ts の NOTION_PROPS で一元管理。
 * タイトル列名はDBスキーマから自動検出するためハードコードしない。
 */
import { Client } from "@notionhq/client";
import type {
  CreatePageParameters,
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NOTION_PROPS, notionConfig } from "@/lib/config";
import { scoreToStars, weatherCodeToJa } from "@/lib/utils";
import type { DailyRecord, HistoryRow, ScoreTrendPoint } from "@/types";

let cachedClient: Client | null = null;
let cachedTitleProp: string | null = null;

function getClient(): Client {
  if (!cachedClient) {
    cachedClient = new Client({ auth: notionConfig.token });
  }
  return cachedClient;
}

/** DBスキーマからタイトル列名を検出（結果はキャッシュ）。 */
async function getTitlePropName(): Promise<string> {
  if (cachedTitleProp) return cachedTitleProp;
  const db = await getClient().databases.retrieve({
    database_id: notionConfig.databaseId,
  });
  const entry = Object.entries(db.properties).find(([, p]) => p.type === "title");
  cachedTitleProp = entry?.[0] ?? "Name";
  return cachedTitleProp;
}

/**
 * 1日分のレコードを Notion に保存する（upsert）。
 *
 * 同じ日付の行が既にあれば新規作成せず更新する。
 * Cronの再実行や手動更新で同日の行が重複すると、
 * 「直近7日」のグラフが実際には数日分しか表示されなくなるため。
 */
export async function saveDailyRecord(record: DailyRecord): Promise<void> {
  const client = getClient();
  const titleProp = await getTitlePropName();
  const { wave, weather, judgement } = record;

  // 動的キー（タイトル列名の自動検出）を含むため、Notion SDK の型へ明示的に合わせる。
  const properties: CreatePageParameters["properties"] = {
    [titleProp]: {
      title: [{ text: { content: record.date } }],
    },
    [NOTION_PROPS.Date]: {
      date: { start: record.date },
    },
    [NOTION_PROPS.WaveHeight]: { number: round(wave.waveHeight) },
    [NOTION_PROPS.WavePeriod]: { number: round(wave.wavePeriod) },
    [NOTION_PROPS.WindDirection]: { number: round(wave.windDirection) },
    [NOTION_PROPS.WindSpeed]: { number: round(wave.windSpeed) },
    [NOTION_PROPS.Weather]: {
      rich_text: [{ text: { content: weather.weather } }],
    },
    [NOTION_PROPS.Temperature]: { number: round(weather.temperature) },
    [NOTION_PROPS.HighTemperature]: { number: round(weather.highTemperature) },
    [NOTION_PROPS.LowTemperature]: { number: round(weather.lowTemperature) },
    [NOTION_PROPS.RainProbability]: { number: round(weather.rainProbability) },
    [NOTION_PROPS.AIScore]: { number: judgement.score },
    [NOTION_PROPS.Recommendation]: {
      rich_text: [{ text: { content: scoreToStars(judgement.score) } }],
    },
    [NOTION_PROPS.Reason]: {
      rich_text: [{ text: { content: judgement.reason } }],
    },
    [NOTION_PROPS.CreatedAt]: {
      date: { start: record.createdAt },
    },
  };

  const existingPageId = await findPageIdByDate(record.date);

  if (existingPageId) {
    await client.pages.update({ page_id: existingPageId, properties });
    return;
  }

  await client.pages.create({
    parent: { database_id: notionConfig.databaseId },
    properties,
  });
}

/** 指定日付の行を探す。無ければ null。 */
async function findPageIdByDate(date: string): Promise<string | null> {
  try {
    const res = await getClient().databases.query({
      database_id: notionConfig.databaseId,
      filter: {
        property: NOTION_PROPS.Date,
        date: { equals: date },
      },
      page_size: 1,
    });
    const page = res.results.find(isFullPage);
    return page ? page.id : null;
  } catch (error) {
    // 検索に失敗した場合は新規作成にフォールバックする（保存を落とさない）
    console.error("[notion] 既存行の検索に失敗しました:", error);
    return null;
  }
}

/** 直近の保存レコードを DailyRecord として取得。無ければ null。 */
export async function getLatestRecord(): Promise<DailyRecord | null> {
  const res = await queryByDateDesc(1);
  const page = res.results.find(isFullPage);
  return page ? pageToDailyRecord(page) : null;
}

/** 直近 days 日のおすすめ度推移（古い順）。 */
export async function getScoreTrend(days = 7): Promise<ScoreTrendPoint[]> {
  const res = await queryByDateDesc(days);
  const points = res.results.filter(isFullPage).map((page) => ({
    date: readDate(page, NOTION_PROPS.Date) ?? "",
    score: readNumber(page, NOTION_PROPS.AIScore) ?? 0,
  }));
  return points.filter((p) => p.date !== "").reverse();
}

/** 履歴一覧（新しい順）。 */
export async function getHistory(limit = 60): Promise<HistoryRow[]> {
  const res = await queryByDateDesc(limit);
  return res.results.filter(isFullPage).map((page) => ({
    id: page.id,
    date: readDate(page, NOTION_PROPS.Date) ?? "",
    score: readNumber(page, NOTION_PROPS.AIScore) ?? 0,
    waveHeight: readNumber(page, NOTION_PROPS.WaveHeight),
    windSpeed: readNumber(page, NOTION_PROPS.WindSpeed),
    weather: readRichText(page, NOTION_PROPS.Weather),
    reason: readRichText(page, NOTION_PROPS.Reason),
  }));
}

// ---------- 内部ヘルパー ----------

async function queryByDateDesc(pageSize: number): Promise<QueryDatabaseResponse> {
  return getClient().databases.query({
    database_id: notionConfig.databaseId,
    // Notionが自動生成する空行や、手動で追加された未入力行を除外する。
    filter: {
      property: NOTION_PROPS.Date,
      date: { is_not_empty: true },
    },
    sorts: [{ property: NOTION_PROPS.Date, direction: "descending" }],
    page_size: pageSize,
  });
}

function isFullPage(
  result: QueryDatabaseResponse["results"][number],
): result is PageObjectResponse {
  return result.object === "page" && "properties" in result;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function readNumber(page: PageObjectResponse, prop: string): number | null {
  const p = page.properties[prop];
  return p && p.type === "number" ? p.number : null;
}

function readDate(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop];
  return p && p.type === "date" ? (p.date?.start ?? null) : null;
}

function readRichText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop];
  if (p && p.type === "rich_text") {
    return p.rich_text.map((t) => t.plain_text).join("");
  }
  if (p && p.type === "select") {
    return p.select?.name ?? "";
  }
  return "";
}

function pageToDailyRecord(page: PageObjectResponse): DailyRecord {
  return {
    date: readDate(page, NOTION_PROPS.Date) ?? "",
    createdAt: readDate(page, NOTION_PROPS.CreatedAt) ?? page.created_time,
    wave: {
      waveHeight: readNumber(page, NOTION_PROPS.WaveHeight) ?? 0,
      wavePeriod: readNumber(page, NOTION_PROPS.WavePeriod) ?? 0,
      waveDirection: 0,
      windDirection: readNumber(page, NOTION_PROPS.WindDirection) ?? 0,
      windSpeed: readNumber(page, NOTION_PROPS.WindSpeed) ?? 0,
    },
    weather: {
      weather: readRichText(page, NOTION_PROPS.Weather),
      weatherCode: 0,
      temperature: readNumber(page, NOTION_PROPS.Temperature) ?? 0,
      highTemperature: readNumber(page, NOTION_PROPS.HighTemperature) ?? 0,
      lowTemperature: readNumber(page, NOTION_PROPS.LowTemperature) ?? 0,
      rainProbability: readNumber(page, NOTION_PROPS.RainProbability) ?? 0,
      uvIndexMax: null,
    },
    judgement: {
      score: readNumber(page, NOTION_PROPS.AIScore) ?? 0,
      reason: readRichText(page, NOTION_PROPS.Reason),
    },
  };
}

// weatherCodeToJa は将来の拡張（コード→表示）用に re-export。
export { weatherCodeToJa };
