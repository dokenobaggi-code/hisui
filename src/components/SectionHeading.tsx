import type { ReactNode } from "react";

/**
 * セクション見出し。
 * 手書き風の波線を下に敷き、小さな欧文ラベルを添える共通の型。
 */
export function SectionHeading({ en, children }: { en?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      {en && <span className="label-en font-hand block">{en}</span>}
      <h2 className="wavy-underline inline-block text-lg font-bold">{children}</h2>
    </div>
  );
}
