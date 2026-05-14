import { compress, decompress, toBase64Url, fromBase64Url } from "./codec";

const IV_BYTES = 12;
const SALT_BYTES = 16;
const PBKDF2_ITERATIONS = 600_000;

async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

function buf(arr: Uint8Array): ArrayBuffer {
  return new Uint8Array(arr).buffer as ArrayBuffer;
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(password);
  const base = await crypto.subtle.importKey("raw", buf(raw), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: buf(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encrypt(
  key: CryptoKey,
  data: Uint8Array,
): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: buf(iv) },
    key,
    buf(data),
  );
  return { iv, ciphertext: new Uint8Array(encrypted) };
}

async function decrypt(
  key: CryptoKey,
  iv: Uint8Array,
  ciphertext: Uint8Array,
): Promise<Uint8Array> {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: buf(iv) },
    key,
    buf(ciphertext),
  );
  return new Uint8Array(decrypted);
}

export async function seal(
  text: string,
): Promise<{ payload: string; key: string }> {
  const compressed = compress(text);
  const cryptoKey = await generateKey();
  const { iv, ciphertext } = await encrypt(cryptoKey, compressed);

  const rawKey = new Uint8Array(
    await crypto.subtle.exportKey("raw", cryptoKey),
  );

  const blob = new Uint8Array(iv.length + ciphertext.length);
  blob.set(iv, 0);
  blob.set(ciphertext, iv.length);

  return {
    payload: toBase64Url(blob),
    key: toBase64Url(rawKey),
  };
}

export async function open(payload: string, key: string): Promise<string> {
  const blob = fromBase64Url(payload);
  const rawKey = fromBase64Url(key);

  if (blob.length <= IV_BYTES) throw new Error("ペイロードが短すぎます");
  if (rawKey.length !== 32) throw new Error("鍵の長さが不正です");

  const iv = blob.slice(0, IV_BYTES);
  const ciphertext = blob.slice(IV_BYTES);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    buf(rawKey),
    "AES-GCM",
    false,
    ["decrypt"],
  );

  const compressed = await decrypt(cryptoKey, iv, ciphertext);
  return decompress(compressed);
}

export async function sealWithPassword(
  text: string,
  password: string,
): Promise<string> {
  const compressed = compress(text);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await deriveKey(password, salt);
  const { iv, ciphertext } = await encrypt(key, compressed);

  const blob = new Uint8Array(salt.length + iv.length + ciphertext.length);
  blob.set(salt, 0);
  blob.set(iv, salt.length);
  blob.set(ciphertext, salt.length + iv.length);

  return toBase64Url(blob);
}

export async function openWithPassword(
  payload: string,
  password: string,
): Promise<string> {
  const blob = fromBase64Url(payload);

  const minLength = SALT_BYTES + IV_BYTES + 1;
  if (blob.length < minLength) throw new Error("ペイロードが短すぎます");

  const salt = blob.slice(0, SALT_BYTES);
  const iv = blob.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
  const ciphertext = blob.slice(SALT_BYTES + IV_BYTES);

  const key = await deriveKey(password, salt);
  const compressed = await decrypt(key, iv, ciphertext);
  return decompress(compressed);
}
