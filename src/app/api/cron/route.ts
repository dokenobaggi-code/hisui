/**
 * 日次Cron エンドポイント。
 * Vercel Cron から毎日 05:00 (JST) に呼び出される。
 * 処理: ①波情報取得 → ②天気取得 → ③OpenAI判定 → ④Notion保存 → ⑤サイト再検証
 *
 * 保護: Authorization ヘッダ or ?secret= の CRON_SECRET を検証する。
 * Vercel Cron は "Authorization: Bearer <CRON_SECRET>" を自動付与する。
 */
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { runDailyPipeline } from "@/services/pipeline";
import { cronConfig } from "@/lib/config";

// 外部APIに依存するため常に動的・Nodeランタイムで実行。
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  let expected: string;
  try {
    expected = cronConfig.secret;
  } catch {
    // CRON_SECRET 未設定時は保護なしで通す（ローカル検証用）。本番では必ず設定すること。
    console.warn("[cron] CRON_SECRET 未設定のため認可チェックをスキップします。");
    return true;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${expected}`) return true;

  const secretParam = request.nextUrl.searchParams.get("secret");
  return secretParam === expected;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const record = await runDailyPipeline();
    revalidatePath("/");

    return NextResponse.json({
      ok: true,
      date: record.date,
      score: record.judgement.score,
      savedAt: record.createdAt,
    });
  } catch (error) {
    console.error("[cron] 日次処理に失敗:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

// 手動トリガ（管理用）にも対応。
export async function POST(request: NextRequest) {
  return handle(request);
}
