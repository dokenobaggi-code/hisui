import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * 背景写真を探す。
 * public/bg/ フォルダに画像を置くと、それが背景になる（名前は何でも可）。
 * 無ければイラストの風景を表示する。
 */
function findBackgroundPhoto(): string | null {
  const bgDir = path.join(process.cwd(), "public", "bg");
  if (existsSync(bgDir)) {
    try {
      const file = readdirSync(bgDir)
        .filter((f) => IMAGE_EXT.includes(path.extname(f).toLowerCase()))
        .sort()[0];
      if (file) return `/bg/${file}`;
    } catch {
      /* 読み取り失敗時はイラストへ */
    }
  }
  return null;
}

/**
 * 背景。
 * public/bg/ に写真があればそれを敷き、無ければヒスイ海岸のイラストを描く。
 * どちらも画面全体に固定し、内容は不透明カードの上に載るので読みやすさは保たれる。
 */
export function BackgroundScene() {
  const photo = findBackgroundPhoto();

  if (photo) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
        {/* 文字とカードを読みやすくするための薄いベール */}
        <div className="absolute inset-0 bg-background/45 dark:bg-background/70" />
      </div>
    );
  }

  return <BackgroundIllustration />;
}

/**
 * ヒスイ海岸をイメージした風景のイラスト（写真が無いときのフォールバック）。
 * 乱数は使わず、index から決定的に位置を決める（SSRのハイドレーション不一致を避けるため）。
 */
/** 砂利（小石）を決定的にばらまく。 */
const PEBBLES = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 89) % 1440;
  const y = 470 + ((i * 53) % 120);
  const r = 1.2 + ((i * 7) % 5) * 0.5;
  const o = 0.12 + ((i * 3) % 5) * 0.04;
  return { x, y, r, o };
});

/** 浜を歩く人影（相対位置）。 */
const PEOPLE = [
  { x: 470, y: 402, h: 22 },
  { x: 560, y: 410, h: 18 },
  { x: 690, y: 398, h: 24 },
  { x: 940, y: 408, h: 20 },
  { x: 1080, y: 396, h: 23 },
];

function BackgroundIllustration() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 空のグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a9d8ec] via-[#dcefef] to-[#f4eee1] dark:from-[#122630] dark:via-[#152220] dark:to-[#141a16]" />

      {/* 太陽の光 */}
      <div className="absolute right-[16%] top-[5%] h-52 w-52 rounded-full bg-[#fdeeb4]/60 blur-3xl dark:bg-[#3a4a2f]/40" />

      {/* 雲（重ねてふんわり） */}
      <div className="absolute left-[8%] top-[12%] h-12 w-52 rounded-full bg-white/70 blur-2xl dark:bg-white/5" />
      <div className="absolute left-[38%] top-[7%] h-9 w-36 rounded-full bg-white/60 blur-2xl dark:bg-white/5" />
      <div className="absolute right-[22%] top-[17%] h-10 w-44 rounded-full bg-white/55 blur-2xl dark:bg-white/5" />
      <div className="absolute left-[62%] top-[22%] h-7 w-28 rounded-full bg-white/45 blur-xl dark:bg-white/5" />

      <svg
        className="absolute bottom-0 left-0 h-[62vh] max-h-[620px] w-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4fa1b8" />
            <stop offset="55%" stopColor="#79bfd1" />
            <stop offset="100%" stopColor="#a6d7e0" />
          </linearGradient>
          <linearGradient id="seaDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123236" />
            <stop offset="100%" stopColor="#1d444a" />
          </linearGradient>
          <linearGradient id="beach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfc1a6" />
            <stop offset="100%" stopColor="#e0d5bf" />
          </linearGradient>
          <linearGradient id="beachDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#221d16" />
            <stop offset="100%" stopColor="#191512" />
          </linearGradient>
        </defs>

        {/* 遠景の山（霞んで薄い） */}
        <path
          d="M0 250 Q180 150 380 210 Q600 275 820 175 Q1040 78 1260 180 Q1360 226 1440 195 L1440 300 L0 300 Z"
          className="fill-[#b7cec5] dark:fill-[#223129]"
          opacity="0.6"
        />
        {/* 中景の山 */}
        <path
          d="M0 285 Q220 205 440 250 Q650 292 860 232 Q1080 168 1300 240 Q1380 266 1440 250 L1440 320 L0 320 Z"
          className="fill-[#94b8aa] dark:fill-[#1d2c25]"
          opacity="0.8"
        />
        {/* 左の岬（手前・濃い） */}
        <path
          d="M0 320 Q90 235 240 268 Q360 296 430 288 L430 340 L0 340 Z"
          className="fill-[#6f9a8b] dark:fill-[#182420]"
        />

        {/* 海 */}
        <path
          d="M0 300 Q360 284 720 300 Q1080 316 1440 296 L1440 430 L0 430 Z"
          fill="url(#sea)"
          className="dark:hidden"
        />
        <path
          d="M0 300 Q360 284 720 300 Q1080 316 1440 296 L1440 430 L0 430 Z"
          fill="url(#seaDark)"
          className="hidden dark:block"
        />

        {/* 波のライン（沖から浜へ） */}
        {[318, 336, 356].map((y, i) => (
          <path
            key={y}
            d={`M0 ${y} Q360 ${y - 8} 720 ${y} Q1080 ${y + 8} 1440 ${y - 4}`}
            fill="none"
            className="stroke-white/40 dark:stroke-white/10"
            strokeWidth={1.5 + i * 0.5}
          />
        ))}

        {/* テトラポッド（左の防波堤） */}
        {[
          { x: 40, y: 360 },
          { x: 90, y: 372 },
          { x: 140, y: 366 },
          { x: 70, y: 384 },
          { x: 120, y: 388 },
        ].map((t, i) => (
          <g key={i} className="fill-[#5f6b66] dark:fill-[#2b3330]" opacity="0.85">
            <circle cx={t.x} cy={t.y} r="11" />
            <rect x={t.x - 3} y={t.y - 14} width="6" height="16" rx="3" />
            <rect
              x={t.x - 12}
              y={t.y - 3}
              width="24"
              height="6"
              rx="3"
              transform={`rotate(${i % 2 ? 40 : -40} ${t.x} ${t.y})`}
            />
          </g>
        ))}

        {/* 波打ち際の白泡 */}
        <path
          d="M0 388 Q360 366 720 388 Q1080 410 1440 382 L1440 416 Q1080 440 720 416 Q360 394 0 416 Z"
          className="fill-white/75 dark:fill-white/12"
        />
        {/* 濡れた砂の照り */}
        <path
          d="M0 406 Q360 386 720 406 Q1080 428 1440 402 L1440 440 Q1080 462 720 440 Q360 420 0 440 Z"
          className="fill-[#c3d3ce]/50 dark:fill-[#2a3a3a]/40"
        />

        {/* 小石の浜 */}
        <path
          d="M0 416 Q360 396 720 416 Q1080 438 1440 412 L1440 600 L0 600 Z"
          fill="url(#beach)"
          className="dark:hidden"
        />
        <path
          d="M0 416 Q360 396 720 416 Q1080 438 1440 412 L1440 600 L0 600 Z"
          fill="url(#beachDark)"
          className="hidden dark:block"
        />

        {/* 砂利の粒 */}
        {PEBBLES.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            className="fill-[#8a7f68] dark:fill-[#4a4234]"
            opacity={p.o}
          />
        ))}

        {/* 浜を歩く人影 */}
        {PEOPLE.map((person, i) => (
          <g key={i} className="fill-[#4a4a48] dark:fill-[#0f1512]" opacity="0.75">
            <circle cx={person.x} cy={person.y - person.h} r={person.h * 0.16} />
            <rect
              x={person.x - person.h * 0.12}
              y={person.y - person.h * 0.82}
              width={person.h * 0.24}
              height={person.h * 0.82}
              rx={person.h * 0.1}
            />
          </g>
        ))}
      </svg>

      {/* 下側をほんの少し明るく持ち上げて、コンテンツの土台をなじませる */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />
    </div>
  );
}
