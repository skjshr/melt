import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "melt — zero-knowledge text sharing",
  description:
    "テキストをURLに暗号化して埋め込む。サーバーには何も保存されない。E2E encrypted, nothing stored.",
  openGraph: {
    title: "melt",
    description: "Zero-knowledge encrypted text sharing. Nothing is stored on the server.",
    type: "website",
    siteName: "melt",
  },
  twitter: {
    card: "summary",
    title: "melt",
    description: "Zero-knowledge encrypted text sharing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${sans.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("melt-theme")==="light")document.documentElement.classList.add("light")}catch{}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
