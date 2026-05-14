"use client";

import { useState, useCallback } from "react";

interface Props {
  url: string;
  urlLength: number;
  onClose: () => void;
}

function lengthLevel(len: number): { label: string; color: string } {
  if (len < 2000) return { label: "どの環境でも使える", color: "text-success" };
  if (len < 8000)
    return { label: "主要ブラウザで使える", color: "text-warning" };
  return { label: "一部環境で切れる可能性", color: "text-accent" };
}

export function ResultOverlay({ url, urlLength, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const level = lengthLevel(urlLength);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      <div className="bg-bg-surface border border-border rounded-lg max-w-lg w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="result-title" className="text-fg text-[13px] font-medium">
            共有リンク
          </h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-fg-muted hover:text-fg text-xs leading-none w-6 h-6 flex items-center justify-center rounded hover:bg-border/30"
          >
            &times;
          </button>
        </div>

        <div
          className="bg-bg-input p-3 rounded border border-border text-[11px] text-fg-muted font-mono break-all max-h-28 overflow-y-auto cursor-pointer select-all leading-relaxed"
          onClick={copy}
        >
          {url}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] flex items-center gap-2">
            <span className={level.color}>{level.label}</span>
            <span className="text-fg-muted/60">{urlLength.toLocaleString()} 文字</span>
          </div>

          <button
            onClick={copy}
            className="px-5 py-1.5 bg-fg text-bg rounded-md text-[12px] font-medium hover:opacity-85 transition-opacity"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="text-fg-muted/50 text-[11px]">
          URLを知っている人だけが内容を読めます。サーバーには何も保存されません。
        </p>
      </div>
    </div>
  );
}
