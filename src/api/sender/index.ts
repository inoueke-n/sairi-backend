import { maybe, Maybe } from "folktale";
import { createAlphanumericString } from "src/lib/string";
import { db } from "src/lib/indexstorage/db";
import { SaveDataCreator, SendDataSaveFormat } from "./saveDataCreator";
import { JsonDataCreator } from "./saveDataCreator/jsonFormat";
import { SairiDataCreator } from "./saveDataCreator/sairiFormat";
import { NCloudSender } from "./nextcloudSender";

function createSentDataSaveId(): string {
  return createAlphanumericString(3);
}

interface SaveSentDataRet {
  id: string;
  uploadUrl: string;
}

/**
 * データ保存
 * @param content 保存内容
 * @param uid ユーザ名
 * @param options 保存時オプション（フォーマットの指定）
 */
export async function saveSentData(
  content: Buffer,
  uid: string,
  options?: {
    format: SendDataSaveFormat;
  }
): Promise<Maybe<SaveSentDataRet>> {
  // データ準備
  const creator: SaveDataCreator = options
    ? options.format === "json"
      ? new JsonDataCreator()
      : new SairiDataCreator()
    : new SairiDataCreator();
  // IDを作成
  const id = createSentDataSaveId();
  const filename = `${id}.${creator.extension}`;
  const c = await creator.makeContent(content);
  console.log("makeContent()");

  // ファイル保存
  const sender = new NCloudSender();
  console.log("sender()");
  await sender.setWhereToUpload(uid);
  return (await sender.sendToStorage(filename, c)).matchWith<
    Promise<Maybe<SaveSentDataRet>>
  >({
    Ok: async ({ value }) => {
      const { uploadUrl } = value;
      console.log("Storage success");
      // DBにIDを登録
      const success = await db.send.insert(id, uid, "ncloud", uploadUrl);
      if (success) {
        console.log("Db success");
        return maybe.Just({ id, uploadUrl });
      } else {
        return maybe.Nothing();
      }
    },
    Error: ({ value }) => {
      console.error(value);
      return Promise.resolve(maybe.Nothing());
    },
  });
}
