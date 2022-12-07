import { Request, Router } from "express";
import { Result, result } from "folktale";
import * as R from "ramda";
import multer from "multer";
import * as _ from "lodash";

import { saveSentData } from "../sender";

import {
  sairiCrypt,
  sairiCompress,
  FolktaleExtension,
} from "@inoueke-n/sairi-common";

import { privateKey } from "src/credentials";

const upload = multer({ dest: "uploads/" });

import { checkParamsExists } from "./helper";
import { validateUid } from "../common";

export const sendRouter = Router({ mergeParams: true });

sendRouter.get("/", (_req, res) => {
  console.log("send GET");
  return res.send("Welcome to send endpoint");
});

sendRouter.post("/", upload.any(), async (req, res) => {
  console.log("Request received POST /send");

  return (await validateSendRequest(req)).matchWith({
    Ok: async ({ value }) => {
      const { body, uid, success } = value;
      const r = await saveSentData(body, uid, { format: "sairi" });
      return r.matchWith({
        Just: ({ value }) => {
          return res.status(201).send(value);
        },
        Nothing: () => {
          return res.status(500).send("Invalid data");
        },
      });
    },
    Error: ({ value }) => {
      return Promise.resolve(res.status(500).send(value));
    },
  });
});

/**
 * リクエストの内容を検査し、正常ならば復号化/解凍したデータのBufferとuidを返す
 * @param req
 */
async function validateSendRequest(
  req: Request
): Promise<Result<string, { body: Buffer; uid: string; success: boolean }>> {
  const r = checkParamsExists(req.query, [
    "uid",
    "iv",
    "k",
    "skipEncrypt",
    "success",
  ]);

  return r.matchWith({
    Ok: ({ value }) => {
      const { uid, k, iv, skipEncrypt, success } = value;

      return FolktaleExtension.concatResults([
        validateIv(iv),
        validateKey(k),
        validateUid(uid),
      ]).matchWith({
        Ok: async ({ value }) => {
          // TODO: valueがanyになるので型安全にする
          const { iv, commonKey } = value;
          return (await validateData(req, iv, commonKey, skipEncrypt)).map(
            (x) => {
              return _.assign({}, x, { uid, success });
            }
          );
        },
        Error: ({ value: es }) => Promise.resolve(result.Error(es.join("\n"))),
      });
    },
    Error: ({ value }) => {
      return Promise.resolve(result.Error(value));
    },
  });
}

export function validateIv(iv: string): Result<string, { iv: Buffer }> {
  const buf = Buffer.from(iv, "base64");

  const expectedByteLength = 16;
  if (buf.byteLength === expectedByteLength) {
    return result.Ok({ iv: buf });
  } else {
    return result.Error("IV byte length is invalid");
  }
}

export function validateKey(k: string): Result<string, { commonKey: Buffer }> {
  const buf = Buffer.from(k, "base64");

  try {
    // 共通鍵を秘密鍵でデコード
    const decryptedCommonKey = sairiCrypt.decrypt(privateKey)(buf);

    const expectedBitLength = 256;
    if (decryptedCommonKey.byteLength * 8 === expectedBitLength) {
      return result.Ok({ commonKey: decryptedCommonKey });
    } else {
      return result.Error("Key bit length is invalid");
    }
  } catch (err) {
    return result.Error("Unable to restore key: " + err);
  }
}

/**
 * データを解凍（＆復号化）して返す
 * @param req リクエスト
 * @param iv iv
 * @param commonKey 共通鍵
 * @param skipEncrypt 暗号化の有無
 */
export async function validateData(
  req: Request,
  iv: Buffer,
  commonKey: Buffer,
  skipEncrypt: boolean
): Promise<Result<string, { body: Buffer }>> {
  const data = req.body as Buffer;

  const decrypted = skipEncrypt
    ? await sairiCompress.decompress(data)
    : await decryptDecompressAsync(data, iv, commonKey);

  try {
    console.log(decrypted.toString);
    const obj = JSON.parse(decrypted.toString());
    console.log(obj);
    return result.Ok({ body: decrypted });
  } catch (error) {
    return result.Error("Failed to JSON.parse. Invalid data.");
  }
}

function decryptDecompressAsync(
  buf: Buffer,
  iv: Buffer,
  commonKey: Buffer
): Promise<Buffer> {
  const h = R.pipe(
    sairiCrypt.decryptAES(iv, commonKey),
    sairiCompress.decompress
  );
  return h(buf);
}
