import NextcloudClient from "nextcloud-link";
import { Result, result } from "folktale";
import { ReadableStreamBuffer } from "stream-buffers";
import * as Stream from "stream";

interface CreateFileResult {
  id: string;
  uploadUrl: string;
}

/**
 * アップロード処理本体
 * @param drive アップロード先
 */
export const uploadContentToFolder =
  (drive: NextcloudClient) =>
  async (
    file: string,
    body: string | Buffer,
    folder: string
  ): Promise<Result<string, CreateFileResult>> => {
    try {
      // ファイルコンテンツの生成
      if (typeof body === "string") {
        const media = Stream.Readable.from([body]);
        await createFile(drive, file, media, folder);
      } else {
        const streamBuffer = new ReadableStreamBuffer({
          frequency: 1, // in milliseconds.
          chunkSize: 1024, // in bytes.
        });

        streamBuffer.put(body);
        streamBuffer.stop();

        await createFile(drive, file, streamBuffer, folder);
      }
      // 結果確認
      const r = await drive.getFolderFileDetails("/" + folder);
      const url = r.filter((item, index) => {
        return item.name == file;
      })[0].href;
      return result.Ok({ id: file, uploadUrl: drive.url + url });
    } catch (err: any) {
      return result.Error(err);
    }
  };

/**
 * ファイルの生成
 * @param drive NextCloudインスタンス
 * @param filename ファイル名
 * @param content 内容
 * @param folder 保存先フォルダ
 */
export async function createFile(
  drive: NextcloudClient,
  filename: string,
  content: Stream.Readable,
  folder: string
): Promise<Result<string, void>> {
  try {
    const path = "/" + folder + "/" + filename;
    const r = await drive.uploadFromStream(path, content);
    return result.Ok(r);
  } catch (err: any) {
    console.error(err);
    return result.Error(err);
  }
}

/**
 * フォルダの生成
 * @param drive NextCloudインスタンス
 * @param folder フォルダ名
 */
export async function createFolder(
  drive: NextcloudClient,
  folder: string
): Promise<void> {
  return await drive.touchFolder("/" + folder);
}
