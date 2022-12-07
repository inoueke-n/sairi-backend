import { Reader, ReadFromStorageResult } from "./reader";

import { testClient } from "src/lib/filestorage/nextcloud/client";
import { downloadFile } from "src/lib/filestorage/nextcloud/load";

export class NCloudReader implements Reader {
  /**
   * storageからの読み込み
   */
  async readFromStorage(
    uid: string,
    filename: string
  ): Promise<ReadFromStorageResult> {
    const content = await downloadFile(testClient, filename, uid);
    return { content: content };
  }
}
