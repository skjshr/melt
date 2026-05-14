"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const { theme, toggle } = useTheme();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <a href="/" className="flex items-center gap-2">
          <span className="text-accent text-lg font-bold tracking-tight">
            melt
          </span>
          <span className="text-fg-muted text-xs hidden sm:inline">
            テキスト共有
          </span>
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="text-fg-muted text-xs hover:text-fg transition-colors px-2 py-1 rounded-md hover:bg-border/30"
          >
            仕組み
          </button>
          <button
            onClick={toggle}
            className="text-fg-muted hover:text-fg transition-colors text-sm w-8 h-8 flex items-center justify-center rounded-md hover:bg-border/30"
            aria-label="テーマ切り替え"
          >
            {theme === "dark" ? "☀" : "☽"}
          </button>
        </div>
      </header>

      {showInfo && (
        <div className="bg-bg-surface border-b border-border/50 px-4 py-3 text-xs text-fg-muted leading-relaxed max-w-4xl mx-auto w-full">
          <p>
            入力されたテキストはブラウザ内で<strong className="text-fg">AES-256-GCM</strong>で
            暗号化・圧縮され、URLの<code className="text-accent">#</code>
            以降に埋め込まれる。フラグメント（#以降）はサーバーに送信されないため、
            サーバー側にデータは一切残らない。
          </p>
          <p className="mt-1.5">
            パスワードを設定すると、鍵はPBKDF2で導出される。URLだけでは復号できなくなる。
          </p>
          <button
            onClick={() => setShowInfo(false)}
            className="mt-2 text-accent hover:text-accent-hover transition-colors"
          >
            閉じる
          </button>
        </div>
      )}
    </>
  );
}
