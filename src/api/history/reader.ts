export interface ReadFromStorageResult {
  /**
   * 保存先のURL
   */
  content: string | Buffer;
}

export interface Reader {
  readFromStorage(
    uid: string,
    filename: string
  ): Promise<ReadFromStorageResult>;
}
