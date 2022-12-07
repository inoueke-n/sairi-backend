import { sairiCrypt } from "@inoueke-n/sairi-common";
import { Result, result } from "folktale";
import * as R from "ramda";

/**
 * APIチェック用のトークン文字列を検証する
 * @param token トークン
 * @param privateKey 秘密鍵
 */
export function validateToken(
  token: string,
  privateKey: string
): Result<string, unknown> {
  const err = () => result.Error("Unexpected token");

  const h = R.pipe(
    (s: string) => Buffer.from(s, "base64"),
    (b: Buffer) => sairiCrypt.decrypt(privateKey)(Buffer.from(b))
  );

  try {
    const r = h(token).toString();
    if (r === "sairi") {
      return result.Ok({});
    } else {
      return err();
    }
  } catch (e) {
    console.log(e);
    return err();
  }
}
