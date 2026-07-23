import { cn } from "@/lib/utils";

/**
 * コインロッカーの手書き風イラスト（SVG）。
 * 添付写真の「青いコインロッカー」を、フラットで親しみのある絵にしている。
 */
export function LockerIllustration({ className }: { className?: string }) {
  const door = "#5fb4d8";
  const doorDark = "#4a97ba";
  const frame = "#c9c4b8";
  const line = "#3a3f45";

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="コインロッカーのイラスト"
    >
      {/* 本体フレーム */}
      <rect
        x="14"
        y="10"
        width="92"
        height="104"
        rx="6"
        fill={frame}
        stroke={line}
        strokeWidth="3"
      />

      {/* 扉6枚（2列×3段、上段だけ大きめ） */}
      {[
        { x: 20, y: 16, w: 38, h: 44 },
        { x: 62, y: 16, w: 38, h: 44 },
        { x: 20, y: 64, w: 38, h: 20 },
        { x: 62, y: 64, w: 38, h: 20 },
        { x: 20, y: 88, w: 38, h: 20 },
        { x: 62, y: 88, w: 38, h: 20 },
      ].map((d, i) => (
        <g key={i}>
          <rect
            x={d.x}
            y={d.y}
            width={d.w}
            height={d.h}
            rx="4"
            fill={i % 2 === 0 ? door : doorDark}
            stroke={line}
            strokeWidth="2.5"
          />
          {/* 鍵つまみ */}
          <circle cx={d.x + d.w - 9} cy={d.y + d.h / 2} r="3.2" fill="#efeae0" stroke={line} strokeWidth="1.5" />
          {/* 番号タグ */}
          <rect x={d.x + 5} y={d.y + 5} width="9" height="7" rx="1.5" fill="#fff" stroke={line} strokeWidth="1.2" />
        </g>
      ))}

      {/* 100円コインの吹き出し */}
      <g className="sticker-r">
        <circle cx="98" cy="18" r="15" fill="#f2c14e" stroke={line} strokeWidth="2.5" />
        <text
          x="98"
          y="22"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={line}
          fontFamily="var(--font-zen-maru), sans-serif"
        >
          100
        </text>
      </g>
    </svg>
  );
}
