"use client";

import { useState, useEffect, useCallback } from "react";
import { unpack } from "@/lib/fragment";
import { Header } from "@/components/Header";

type State =
  | { phase: "loading" }
  | { phase: "password" }
  | { phase: "done"; text: string }
  | { phase: "error"; message: string };

export default function ViewPage() {
  const [state, setState] = useState<State>({ phase: "loading" });
  const [password, setPassword] = useState("");
  const [fragment, setFragment] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setState({ phase: "error", message: "リンクが不完全です" });
      return;
    }
    if (hash.length > 100_000) {
      setState({ phase: "error", message: "URLが長すぎます" });
      return;
    }
    setFragment(hash);

    if (hash.startsWith("1")) {
      setState({ phase: "password" });
      return;
    }

    unpack(hash)
      .then((text) => setState({ phase: "done", text }))
      .catch(() => setState({ phase: "error", message: "復号に失敗しました" }));
  }, []);

  const submitPassword = useCallback(async () => {
    setState({ phase: "loading" });
    try {
      const text = await unpack(fragment, password);
      setState({ phase: "done", text });
    } catch {
      setPassword("");
      setState({ phase: "password" });
      setError("パスワードが違います");
    }
  }, [fragment, password]);

  const copy = useCallback(async () => {
    if (state.phase !== "done") return;
    await navigator.clipboard.writeText(state.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [state]);

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-5 py-6">
        {state.phase === "loading" && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-fg-muted text-[13px]">Decrypting...</span>
          </div>
        )}

        {state.phase === "password" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="border border-border rounded-lg p-5 w-full max-w-xs space-y-4">
              <p className="text-fg text-[13px] font-medium">
                パスワードで保護されています
              </p>
              {error && <p className="text-accent text-[12px]">{error}</p>}
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && submitPassword()}
                placeholder="パスワード"
                maxLength={256}
                autoFocus
                className="w-full px-3 py-1.5 bg-bg-input text-fg text-[13px] rounded border border-border focus:border-border-focus focus:outline-none font-mono"
              />
              <button
                onClick={submitPassword}
                className="w-full px-4 py-1.5 bg-fg text-bg rounded text-[12px] font-medium hover:opacity-80 transition-opacity"
              >
                復号
              </button>
            </div>
          </div>
        )}

        {state.phase === "done" && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted/50 text-[11px] font-mono">
                {state.text.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="px-3 py-1 text-[11px] border border-border rounded text-fg-muted hover:text-fg hover:border-border-focus transition-colors"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
                <a
                  href="/"
                  className="px-3 py-1 text-[11px] border border-border rounded text-fg-muted hover:text-fg hover:border-border-focus transition-colors"
                >
                  New
                </a>
              </div>
            </div>

            <pre className="flex-1 bg-bg-input p-4 rounded border border-border text-[13px] leading-[1.8] font-mono whitespace-pre-wrap break-words overflow-auto">
              {state.text}
            </pre>
          </div>
        )}

        {state.phase === "error" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <p className="text-fg-muted text-[13px]">{state.message}</p>
              <a
                href="/"
                className="inline-block px-3 py-1 text-[11px] border border-border rounded text-fg-muted hover:text-fg transition-colors"
              >
                トップに戻る
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
