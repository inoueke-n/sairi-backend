import { SaveDataCreator } from ".";

export class JsonDataCreator implements SaveDataCreator {
  extension = "json";

  makeContent(buf: Buffer): Promise<Buffer> {
    return Promise.resolve(buf);
  }
}
