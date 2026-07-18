import { location } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 py-8">
      <div className="container space-y-1 text-center text-xs text-muted-foreground">
        <p>{location.name}</p>
        <p>
          気象・海況データ:{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Open-Meteo.com
          </a>
          （CC BY 4.0）／ おすすめ度判定: OpenAI
        </p>
        <p className="pt-2">
          ※ 表示は参考情報です。実際の海況は現地・自治体の情報を確認し、安全第一で行動してください。
        </p>
      </div>
    </footer>
  );
}
