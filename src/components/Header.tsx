"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const { theme, toggle } = useTheme();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-5 h-12 border-b border-border/40">
        <a href="/" className="flex items-baseline gap-2.5">
          <span className="text-fg text-[15px] font-semibold tracking-[0.08em] lowercase">
            melt
          </span>
          <span className="text-fg-muted/50 text-[10px] tracking-wide hidden sm:inline">
            zero-knowledge text sharing
          </span>
        </a>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="text-fg-muted text-[11px] hover:text-fg transition-colors px-2 py-1 rounded hover:bg-border/20"
          >
            {showInfo ? "閉じる" : "仕組み"}
          </button>
          <button
            onClick={toggle}
            className="text-fg-muted hover:text-fg transition-colors text-xs w-7 h-7 flex items-center justify-center rounded hover:bg-border/20"
            aria-label="テーマ切り替え"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {showInfo && (
        <div className="border-b border-border/40 px-5 py-4 text-[12px] text-fg-muted leading-[1.7] max-w-3xl mx-auto w-full">
          <p>
            テキストはブラウザ内で
            <strong className="text-fg font-medium">AES-256-GCM</strong>
            で暗号化・圧縮され、URLの
            <code className="text-fg font-mono text-[11px]">#</code>
            以降に埋め込まれます。フラグメントはサーバーに送信されません。
          </p>
          <p className="mt-2">
            パスワードを設定すると鍵は
            <strong className="text-fg font-medium">PBKDF2</strong>
            で導出されます。URLだけでは復号できません。
          </p>
        </div>
      )}
    </>
  );
}
