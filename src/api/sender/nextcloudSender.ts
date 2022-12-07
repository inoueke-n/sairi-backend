import { Result, result } from "folktale";
import { Sender, SendToStorageResult } from "./sender";
import { testClient } from "src/lib/filestorage/nextcloud/client";
import {
  createFolder,
  uploadContentToFolder,
} from "src/lib/filestorage/nextcloud/save";

export interface NCloudSenderOptions {
  whereToUpload?: string;
}

export class NCloudSender implements Sender {
  private _whereToUpload: string;
  private _initialized: boolean;

  constructor(options?: NCloudSenderOptions) {
    const defaultFolder = "sairi";
    this._whereToUpload =
      options && options.whereToUpload ? options.whereToUpload : defaultFolder;
    this._initialized = true;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * フォルダの準備
   * @param folderName アップロード先フォルダ名
   */
  public async setWhereToUpload(folderName: string): Promise<boolean> {
    await createFolder(testClient, folderName);
    this._whereToUpload = folderName;
    this._initialized = true;

    console.log("setWhereToUpload()");
    return true;
  }

  /**
   * storageへの保存
   */
  async sendToStorage(
    filename: string,
    content: string | Buffer
  ): Promise<Result<string, SendToStorageResult>> {
    if (!this._initialized) {
      return result.Error("Sender is not initialized");
    }

    return uploadContentToFolder(testClient)(
      filename,
      content,
      this._whereToUpload
    );
  }
}
