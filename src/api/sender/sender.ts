import { Result } from "folktale";

export interface SendToStorageResult {
  /**
   * 保存先のURL
   */
  uploadUrl: string;
}

export interface Sender {
  sendToStorage(
    filename: string,
    body: string
  ): Promise<Result<string, SendToStorageResult>>;
}
