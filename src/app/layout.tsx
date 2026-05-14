import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "melt — テキスト共有、サーバー保存なし",
  description:
    "テキストやコードをURLに変換。サーバーには何も保存されない。パスワード保護対応。",
  openGraph: {
    title: "melt",
    description: "テキスト共有、サーバー保存なし",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${mono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("melt-theme")==="light")document.documentElement.classList.add("light")}catch{}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-mono">{children}</body>
    </html>
  );
}
