import Link from "next/link";
import { Gem } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Gem className="h-4 w-4 text-primary" />
          <span className="font-serif text-base tracking-[0.18em] sm:text-lg">
            ヒスイ拾い予報
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/"
            className="px-2.5 py-2 text-sm tracking-widest text-muted-foreground transition-colors hover:text-foreground sm:px-3"
          >
            今日
          </Link>
          <Link
            href="/nearby"
            className="px-2.5 py-2 text-sm tracking-widest text-muted-foreground transition-colors hover:text-foreground sm:px-3"
          >
            宿・ごはん
          </Link>
          <Link
            href="/history"
            className="px-2.5 py-2 text-sm tracking-widest text-muted-foreground transition-colors hover:text-foreground sm:px-3"
          >
            履歴
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
