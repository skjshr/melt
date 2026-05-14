import { describe, it, expect } from "vitest";
import { pack, unpack } from "./fragment";

describe("pack / unpack（URLフラグメント生成・解析）", () => {
  it("鍵埋め込みモードで往復できる", async () => {
    const text = "const x = 42;";
    const fragment = await pack(text);
    expect(fragment).not.toContain(text);
    expect(await unpack(fragment)).toBe(text);
  });

  it("パスワードモードで往復できる", async () => {
    const text = "DB_PASSWORD=hunter2";
    const password = "mypass";
    const fragment = await pack(text, password);
    expect(await unpack(fragment, password)).toBe(text);
  });

  it("パスワードモードのフラグメントはパスワードなしで復号できない", async () => {
    const fragment = await pack("secret", "pass123");
    await expect(unpack(fragment)).rejects.toThrow();
  });

  it("長めのコード（100行相当）を処理できる", async () => {
    const lines = Array.from(
      { length: 100 },
      (_, i) => `console.log("line ${i + 1}");`,
    );
    const text = lines.join("\n");
    const fragment = await pack(text);
    expect(await unpack(fragment)).toBe(text);
  });

  it("フラグメントの先頭でモードを区別できる", async () => {
    const withoutPw = await pack("text");
    const withPw = await pack("text", "pw");
    expect(withoutPw[0]).not.toBe(withPw[0]);
  });
});
