import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Zen_Maru_Gothic, Yusei_Magic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackgroundScene } from "@/components/BackgroundScene";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

/** 見出し用の丸ゴシック。手作り感のある、親しみやすい表情を出す。 */
const zenMaru = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-zen-maru",
  display: "swap",
  preload: false,
});

/** 手書き風の見出しアクセント。ワンポイントで人間味を添える。 */
const yuseiMagic = Yusei_Magic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-yusei",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "ヒスイ拾いナビ | ヒスイ海岸",
    template: "%s | ヒスイ拾いナビ",
  },
  description:
    "富山県朝日町・宮崎海岸周辺のヒスイ海岸で、波・天気からAIが今日のヒスイ拾いおすすめ度を毎日判定。週間予報・持ち物・周辺の宿やごはんもまとめたヒスイ拾いの総合ナビ。",
  keywords: ["ヒスイ", "翡翠", "ヒスイ海岸", "朝日町", "宮崎海岸", "波情報", "天気", "ヒスイ拾い"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1a17" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${notoSansJp.variable} ${zenMaru.variable} ${yuseiMagic.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BackgroundScene />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container flex-1 py-8">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
