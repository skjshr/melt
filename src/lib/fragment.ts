import { seal, open, sealWithPassword, openWithPassword } from "./crypto";

const PREFIX_OPEN = "0";
const PREFIX_LOCKED = "1";

export async function pack(text: string, password?: string): Promise<string> {
  if (password != null) {
    const payload = await sealWithPassword(text, password);
    return PREFIX_LOCKED + payload;
  }
  const { payload, key } = await seal(text);
  return PREFIX_OPEN + key + "." + payload;
}

export async function unpack(
  fragment: string,
  password?: string,
): Promise<string> {
  const prefix = fragment[0];
  const body = fragment.slice(1);

  if (prefix === PREFIX_LOCKED) {
    if (password == null) {
      throw new Error("このリンクにはパスワードが必要です");
    }
    return openWithPassword(body, password);
  }

  if (prefix === PREFIX_OPEN) {
    const dotIndex = body.indexOf(".");
    if (dotIndex === -1) throw new Error("不正なフラグメント形式");
    const key = body.slice(0, dotIndex);
    const payload = body.slice(dotIndex + 1);
    return open(payload, key);
  }

  throw new Error("未対応のフラグメントバージョン");
}
