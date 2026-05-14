import { describe, it, expect } from "vitest";
import { seal, open, sealWithPassword, openWithPassword } from "./crypto";
import { toBase64Url } from "./codec";

describe("seal / open（鍵埋め込みモード）", () => {
  it("テキストを暗号化・復号できる", async () => {
    const text = "秘密のメッセージ";
    const { payload, key } = await seal(text);
    expect(await open(payload, key)).toBe(text);
  });

  it("鍵が違うと復号に失敗する", async () => {
    const { payload } = await seal("test");
    const { key: wrongKey } = await seal("other");
    await expect(open(payload, wrongKey)).rejects.toThrow();
  });

  it("ペイロードが改竄されると復号に失敗する", async () => {
    const { payload, key } = await seal("test");
    const tampered = "X" + payload.slice(1);
    await expect(open(tampered, key)).rejects.toThrow();
  });

  it("同じテキストでも毎回異なるペイロードを生成する", async () => {
    const text = "deterministic?";
    const a = await seal(text);
    const b = await seal(text);
    expect(a.payload).not.toBe(b.payload);
    expect(a.key).not.toBe(b.key);
  });

  it("空文字列を処理できる", async () => {
    const { payload, key } = await seal("");
    expect(await open(payload, key)).toBe("");
  });

  it("ペイロードが短すぎるとエラーになる", async () => {
    const shortPayload = toBase64Url(new Uint8Array(5));
    const { key } = await seal("x");
    await expect(open(shortPayload, key)).rejects.toThrow();
  });

  it("鍵の長さが不正だとエラーになる", async () => {
    const { payload } = await seal("x");
    const wrongLenKey = toBase64Url(new Uint8Array(16));
    await expect(open(payload, wrongLenKey)).rejects.toThrow();
  });
});

describe("sealWithPassword / openWithPassword（パスワードモード）", () => {
  it("パスワードで暗号化・復号できる", async () => {
    const text = "極秘情報";
    const password = "correct-horse-battery-staple";
    const payload = await sealWithPassword(text, password);
    expect(await openWithPassword(payload, password)).toBe(text);
  });

  it("パスワードが違うと復号に失敗する", async () => {
    const payload = await sealWithPassword("test", "right");
    await expect(openWithPassword(payload, "wrong")).rejects.toThrow();
  });

  it("空パスワードでも動作する", async () => {
    const text = "empty password";
    const payload = await sealWithPassword(text, "");
    expect(await openWithPassword(payload, "")).toBe(text);
  });

  it("ペイロードが短すぎるとエラーになる", async () => {
    const shortPayload = toBase64Url(new Uint8Array(10));
    await expect(openWithPassword(shortPayload, "pw")).rejects.toThrow();
  });
});
