interface Props {
  usePassword: boolean;
  onTogglePassword: () => void;
  password: string;
  onPasswordChange: (pw: string) => void;
}

export function EditorToolbar({
  usePassword,
  onTogglePassword,
  password,
  onPasswordChange,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={onTogglePassword}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors border ${
          usePassword
            ? "border-accent text-accent bg-accent/10"
            : "border-border text-fg-muted hover:border-fg-muted/50"
        }`}
      >
        <span>{usePassword ? "🔒" : "🔓"}</span>
        パスワード
      </button>

      {usePassword && (
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="パスワードを入力"
          maxLength={256}
          aria-label="暗号化パスワード"
          className="px-3 py-1.5 bg-bg-input text-fg text-xs rounded-md border border-border focus:border-border-focus focus:outline-none font-mono w-48"
        />
      )}
    </div>
  );
}
