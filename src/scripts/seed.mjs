/**
 * ローカル検証用シードスクリプト。
 * 起動中の開発サーバー(/api/cron)を叩いて、当日の1件を即時生成・保存する。
 *
 * 使い方:
 *   1) 別ターミナルで `npm run dev` を起動
 *   2) `node src/scripts/seed.mjs`（CRON_SECRET は .env.local から読み込み）
 *
 * 依存を増やさないため .env.local を簡易パースして使用する。
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../../.env.local");

function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf8");
    const env = {};
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv(envPath);
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const secret = env.CRON_SECRET ?? process.env.CRON_SECRET ?? "";

const url = `${baseUrl}/api/cron${secret ? `?secret=${encodeURIComponent(secret)}` : ""}`;

console.log(`POST ${baseUrl}/api/cron ...`);
const res = await fetch(url, { method: "POST" });
const body = await res.json();
console.log("status:", res.status);
console.log("body:", JSON.stringify(body, null, 2));
process.exit(res.ok ? 0 : 1);
