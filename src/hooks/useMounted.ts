"use client";

import { useEffect, useState } from "react";

/** クライアントでマウント済みかを返す。SSRハイドレーション不一致の回避に使用。 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
