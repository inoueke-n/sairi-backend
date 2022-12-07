export type SendDataSaveFormat = "json" | "sairi";

export interface SaveDataCreator {
  extension: string;
  makeContent(buf: Buffer): Promise<Buffer>;
}
