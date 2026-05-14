import { describe, it, expect } from "vitest";
import { compress, decompress, toBase64Url, fromBase64Url } from "./codec";

describe("base64url", () => {
  it("空バイト列をエンコード・デコードできる", () => {
    const empty = new Uint8Array(0);
    expect(fromBase64Url(toBase64Url(empty))).toEqual(empty);
  });

  it("任意のバイト列を可逆変換できる", () => {
    const data = new Uint8Array([0, 1, 127, 128, 255]);
    expect(fromBase64Url(toBase64Url(data))).toEqual(data);
  });

  it("URL安全な文字だけを使う", () => {
    const data = new Uint8Array(256);
    for (let i = 0; i < 256; i++) data[i] = i;
    const encoded = toBase64Url(data);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("大きなデータ（64KB）でもスタックオーバーフローしない", () => {
    const big = new Uint8Array(65536);
    crypto.getRandomValues(big);
    const roundtrip = fromBase64Url(toBase64Url(big));
    expect(roundtrip).toEqual(big);
  });

  it("空文字列は空のUint8Arrayを返す", () => {
    expect(fromBase64Url("")).toEqual(new Uint8Array(0));
  });

  it("不正なbase64文字列でエラーになる", () => {
    expect(() => fromBase64Url("!!!invalid!!!")).toThrow();
  });
});

describe("compress / decompress", () => {
  it("短いテキストを可逆圧縮できる", () => {
    const text = "Hello, world!";
    expect(decompress(compress(text))).toBe(text);
  });

  it("日本語テキストを可逆圧縮できる", () => {
    const text = "吾輩は猫である。名前はまだ無い。";
    expect(decompress(compress(text))).toBe(text);
  });

  it("空文字列を処理できる", () => {
    expect(decompress(compress(""))).toBe("");
  });

  it("繰り返しの多いテキストは圧縮率が高い", () => {
    const repeated = "a".repeat(10000);
    const compressed = compress(repeated);
    expect(compressed.length).toBeLessThan(repeated.length / 10);
  });

  it("絵文字・サロゲートペアを壊さない", () => {
    const text = "🔐🗝️ セキュリティ 👁️‍🗨️";
    expect(decompress(compress(text))).toBe(text);
  });

  it("壊れたデータでdecompressするとエラーになる", () => {
    expect(() => decompress(new Uint8Array([0, 1, 2, 3]))).toThrow();
  });
});
