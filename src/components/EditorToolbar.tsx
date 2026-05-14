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
    <div className="flex items-center gap-3">
      <button
        onClick={onTogglePassword}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] transition-colors border ${
          usePassword
            ? "border-accent/60 text-accent"
            : "border-border text-fg-muted hover:text-fg hover:border-border-focus"
        }`}
      >
        {usePassword ? "鍵あり" : "鍵なし"}
      </button>

      {usePassword && (
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="パスワード"
          maxLength={256}
          aria-label="暗号化パスワード"
          className="px-2.5 py-1 bg-bg-input text-fg text-[12px] rounded border border-border focus:border-border-focus focus:outline-none font-mono w-44"
        />
      )}
    </div>
  );
}
