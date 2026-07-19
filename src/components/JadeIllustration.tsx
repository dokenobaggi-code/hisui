/**
 * ヒスイのフラットイラスト（SVG）。
 * 添付画像を参考に、光沢グラデーションを使わず、面で塗り分けた
 * 手描きイラスト調のヒスイ原石を描く。配色は tone で切り替える。
 */
import { cn } from "@/lib/utils";

export type JadeTone = "great" | "good" | "fair" | "poor" | "bad";

/** tone ごとの面の色（濃い面・淡い面・アクセントのラベンダー・輪郭）。 */
const PALETTE: Record<
  JadeTone,
  { deep: string; mid: string; light: string; accent: string; line: string }
> = {
  great: { deep: "#3f7d55", mid: "#6aa77e", light: "#bfe0c6", accent: "#c9b8e4", line: "#2f5f41" },
  good: { deep: "#4f8560", mid: "#77ab84", light: "#c6e3ca", accent: "#cabde3", line: "#3a6449" },
  fair: { deep: "#8a8f52", mid: "#adb072", light: "#e2e0b8", accent: "#d8cf9e", line: "#6b6d3f" },
  poor: { deep: "#9c7a4e", mid: "#c19f6e", light: "#e8d6b6", accent: "#d8c19e", line: "#755a39" },
  bad: { deep: "#9c6a5e", mid: "#c08f80", light: "#e6cabf", accent: "#d8b3a6", line: "#734b41" },
};

interface JadeStoneProps {
  tone?: JadeTone;
  className?: string;
  /** 石の中央に重ねる要素（点数など） */
  children?: React.ReactNode;
}

/**
 * ひとつの原石。中央に children（点数）を重ねられる。
 * 面を塗り分けた磨りガラス風のヒスイ原石。
 */
export function JadeStone({ tone = "good", className, children }: JadeStoneProps) {
  const c = PALETTE[tone];

  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-hidden="true">
        {/* 原石の外形（角の取れた多面体） */}
        <path
          d="M40 14 L82 20 Q102 30 104 54 Q106 82 86 98 Q64 112 40 104 Q18 96 14 70 Q11 42 26 26 Q32 18 40 14 Z"
          fill={c.mid}
          stroke={c.line}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* 淡い面（左上の光が当たる面） */}
        <path
          d="M40 14 L82 20 Q70 40 52 44 Q34 48 26 26 Q32 18 40 14 Z"
          fill={c.light}
          stroke={c.line}
          strokeWidth="1.6"
          strokeLinejoin="round"
          opacity="0.95"
        />
        {/* 濃い面（右下の影の面） */}
        <path
          d="M86 98 Q64 112 40 104 Q52 88 74 86 Q92 84 104 54 Q106 82 86 98 Z"
          fill={c.deep}
          stroke={c.line}
          strokeWidth="1.6"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* ラベンダーのまだら（ヒスイ特有の紫の差し色） */}
        <path
          d="M20 74 Q30 66 44 72 Q50 86 40 100 Q24 96 18 82 Q17 78 20 74 Z"
          fill={c.accent}
          opacity="0.8"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * 添付画像のような「丸い原石＋多面体の原石」の2個組。
 * ヘッダーの飾りに使う、非インタラクティブな装飾。
 */
export function JadePair({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 96"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="ヒスイのイラスト"
    >
      {/* 左: 丸い磨き石（カボション） */}
      <ellipse cx="42" cy="58" rx="34" ry="30" fill="#2f6b3d" stroke="#244f2e" strokeWidth="2.5" />
      <ellipse cx="34" cy="48" rx="13" ry="9" fill="#5f9b6d" opacity="0.75" />
      <ellipse cx="30" cy="44" rx="5" ry="3.5" fill="#bfe0c6" opacity="0.9" />

      {/* 右: 多面体の原石 */}
      <path
        d="M78 30 L112 26 Q132 36 130 60 Q128 84 104 88 Q84 90 76 72 Q70 50 78 30 Z"
        fill="#6aa77e"
        stroke="#2f5f41"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M78 30 L112 26 Q104 44 88 48 Q76 50 76 40 Q76 34 78 30 Z"
        fill="#bfe0c6"
        stroke="#2f5f41"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M104 88 Q84 90 76 72 Q92 70 104 62 Q118 56 130 60 Q128 84 104 88 Z"
        fill="#3f7d55"
        stroke="#2f5f41"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d="M92 62 Q100 58 112 62 Q112 76 100 80 Q90 76 92 62 Z" fill="#c9b8e4" opacity="0.85" />
    </svg>
  );
}
