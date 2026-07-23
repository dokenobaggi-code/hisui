import Link from "next/link";
import { Gem } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/", label: "今日のおすすめ度" },
  { href: "/packing", label: "服装・持ち物" },
  { href: "/nearby", label: "周辺情報" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Gem className="h-4 w-4 text-primary" />
          <span className="font-round text-base font-bold tracking-wide sm:text-lg">
            ヒスイ拾いナビ
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2 py-1.5 text-[11px] font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
