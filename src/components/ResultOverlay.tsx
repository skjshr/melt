"use client";

import { useState, useCallback } from "react";

interface Props {
  url: string;
  urlLength: number;
  onClose: () => void;
}

function lengthLevel(len: number): { label: string; color: string } {
  if (len < 2000) return { label: "どこでも使える", color: "text-success" };
  if (len < 8000)
    return { label: "主要ブラウザで使える", color: "text-warning" };
  return { label: "一部環境で切れる可能性あり", color: "text-accent" };
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="bg-bg-surface border border-border rounded-xl max-w-xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="result-title" className="text-fg text-sm font-bold">共有リンク</h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-fg-muted hover:text-fg text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div
          className="bg-bg-input p-3 rounded-lg border border-border text-xs text-fg-muted font-mono break-all max-h-32 overflow-y-auto cursor-pointer select-all"
          onClick={copy}
        >
          {url}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs space-y-1">
            <span className={`${level.color}`}>{level.label}</span>
            <span className="text-fg-muted ml-2">({urlLength} 文字)</span>
          </div>

          <button
            onClick={copy}
            className="px-5 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent-hover transition-colors"
          >
            {copied ? "コピーした ✓" : "コピー"}
          </button>
        </div>

        <p className="text-fg-muted/60 text-xs">
          このURLにアクセスした人は内容を読める。
          サーバーには何も送信されていない。
        </p>
      </div>
    </div>
  );
}
