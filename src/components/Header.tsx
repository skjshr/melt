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
            {showInfo ? "閉じる" : "?"}
          </button>
          <button
            onClick={toggle}
            className="text-fg-muted hover:text-fg transition-colors text-[11px] px-2 py-1 rounded hover:bg-border/20"
            aria-label="テーマ切り替え"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {showInfo && (
        <div className="border-b border-border/40 px-5 py-5 max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-4 text-[12px] leading-[1.7]">
            <div className="flex gap-3">
              <span className="text-fg-muted/40 font-mono text-[10px] mt-0.5 shrink-0">01</span>
              <p className="text-fg-muted">
                テキストはブラウザ内で
                <strong className="text-fg font-medium"> AES-256-GCM </strong>
                で暗号化・圧縮され、URLの
                <code className="text-fg font-mono text-[11px]"> # </code>
                以降に埋め込まれます。
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-fg-muted/40 font-mono text-[10px] mt-0.5 shrink-0">02</span>
              <p className="text-fg-muted">
                フラグメント（#以降）はHTTP仕様上サーバーに送信されません。
                サーバーにデータは一切残りません。
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-fg-muted/40 font-mono text-[10px] mt-0.5 shrink-0">03</span>
              <p className="text-fg-muted">
                パスワードを設定すると鍵は
                <strong className="text-fg font-medium"> PBKDF2 </strong>
                で導出されます。URLだけでは復号できません。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
