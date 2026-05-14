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
  metadataBase: new URL("https://melt-lac.vercel.app"),
  title: "melt — zero-knowledge text sharing",
  description:
    "テキストをURLに暗号化して埋め込む。サーバーには何も保存されない。AES-256-GCM end-to-end encryption, nothing stored on the server.",
  keywords: [
    "text sharing", "encrypted", "zero-knowledge", "pastebin",
    "E2E encryption", "テキスト共有", "暗号化", "サーバーレス",
  ],
  openGraph: {
    title: "melt — zero-knowledge text sharing",
    description: "Encrypt text into a URL. Nothing is stored on the server. AES-256-GCM, password protection, zero knowledge.",
    type: "website",
    siteName: "melt",
    url: "https://melt-lac.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "melt — zero-knowledge text sharing",
    description: "Encrypt text into a URL. Nothing stored. AES-256-GCM end-to-end encryption.",
  },
  alternates: {
    canonical: "https://melt-lac.vercel.app",
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
