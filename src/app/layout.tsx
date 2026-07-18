import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

/** 見出し・数字用の明朝体。旅館サイトの静かな佇まいを出すために使う。 */
const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "ヒスイ拾い予報 | ヒスイ海岸",
    template: "%s | ヒスイ拾い予報",
  },
  description:
    "富山県朝日町・宮崎海岸周辺のヒスイ海岸で、波・天気からAIが今日のヒスイ拾いおすすめ度を毎日判定します。",
  keywords: ["ヒスイ", "翡翠", "ヒスイ海岸", "朝日町", "宮崎海岸", "波情報", "天気"],
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
        className={`${notoSansJp.variable} ${notoSerifJp.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
