"use client";

import { useState, useCallback, useRef } from "react";
import { pack } from "@/lib/fragment";
import { Header } from "@/components/Header";
import { EditorToolbar } from "@/components/EditorToolbar";
import { ResultOverlay } from "@/components/ResultOverlay";

const MAX_INPUT_BYTES = 32_768;

export default function Home() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [urlLength, setUrlLength] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const inputBytes = new TextEncoder().encode(text).length;
  const overLimit = inputBytes > MAX_INPUT_BYTES;

  const generate = useCallback(async () => {
    if (!text.trim() || generating) return;
    setGenerating(true);
    try {
      const fragment = await pack(text, usePassword ? password : undefined);
      const url = `${window.location.origin}/s#${fragment}`;
      setResult(url);
      setUrlLength(url.length);
    } finally {
      setGenerating(false);
    }
  }, [text, password, usePassword, generating]);

  const reset = useCallback(() => {
    setResult(null);
    setText("");
    setPassword("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        generate();
      }
    },
    [generate],
  );

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 pb-8">
        <div className="flex-1 flex flex-col gap-3 mt-4">
          <EditorToolbar
            usePassword={usePassword}
            onTogglePassword={() => setUsePassword((v) => !v)}
            password={password}
            onPasswordChange={setPassword}
          />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="テキストを貼り付ける&#10;&#10;入力内容はブラウザ内で暗号化され、URLに直接埋め込まれる。&#10;サーバーには送信されない。"
              spellCheck={false}
              autoFocus
              className="w-full h-full min-h-[400px] resize-none bg-bg-input text-fg p-4 rounded-lg border border-border focus:border-border-focus focus:outline-none text-sm leading-relaxed font-mono placeholder:text-fg-muted/30"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={generate}
                disabled={!text.trim() || generating || overLimit}
                className="px-6 py-2.5 bg-accent text-white rounded-lg font-mono text-sm hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? "生成中..." : "URLを生成"}
              </button>

              <span className={`text-xs ${overLimit ? "text-accent" : "text-fg-muted"}`}>
                {text.length > 0 && (
                  overLimit
                    ? `${(inputBytes / 1024).toFixed(1)}KB / 32KB 上限超過`
                    : `${text.length} 文字`
                )}
              </span>
            </div>

            <span className="text-fg-muted/40 text-xs hidden sm:inline">
              Ctrl + Enter
            </span>
          </div>
        </div>
      </main>

      {result && (
        <ResultOverlay url={result} urlLength={urlLength} onClose={reset} />
      )}

      <footer className="text-center text-fg-muted/40 text-xs py-4">
        暗号化はブラウザ内で完結する。サーバーには何も送信されない。
      </footer>
    </div>
  );
}
