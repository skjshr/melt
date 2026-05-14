import pako from "pako";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function compress(text: string): Uint8Array {
  return pako.deflate(encoder.encode(text));
}

export function decompress(data: Uint8Array): string {
  return decoder.decode(pako.inflate(data));
}

export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function fromBase64Url(str: string): Uint8Array {
  if (str === undefined || str === null) throw new Error("base64url文字列がnull");
  if (str === "") return new Uint8Array(0);
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    throw new Error("不正なbase64url文字列");
  }
}
