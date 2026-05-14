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

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-5 pb-6">
        <div className="flex-1 flex flex-col gap-3 mt-5">
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
              placeholder={"ここにテキストを入力\n\nブラウザ内で暗号化され、URLに埋め込まれます"}
              spellCheck={false}
              autoFocus
              className="w-full h-full min-h-[420px] resize-none bg-bg-input text-fg p-4 rounded-md border border-border focus:border-border-focus focus:outline-none text-[13px] leading-[1.8] font-mono placeholder:text-fg-muted/30 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={generate}
                disabled={!text.trim() || generating || overLimit}
                className="px-5 py-1.5 bg-fg text-bg rounded-md text-[12px] font-medium hover:opacity-85 disabled:opacity-15 disabled:cursor-not-allowed transition-opacity"
              >
                {generating ? "..." : "Share"}
              </button>

              <span
                className={`text-[11px] ${overLimit ? "text-accent" : "text-fg-muted/50"}`}
              >
                {text.length > 0 &&
                  (overLimit
                    ? `${(inputBytes / 1024).toFixed(1)}KB / 32KB`
                    : `${text.length}`)}
              </span>
            </div>

            <span className="text-fg-muted/30 text-[11px] hidden sm:inline font-mono">
              Ctrl+Enter
            </span>
          </div>
        </div>
      </main>

      {result && (
        <ResultOverlay url={result} urlLength={urlLength} onClose={reset} />
      )}

      <footer className="text-center text-fg-muted/30 text-[11px] py-4">
        E2E encrypted. Nothing is sent to the server.
      </footer>
    </div>
  );
}
