import { sairiCompress } from "@inoueke-n/sairi-common";

export class SairiFormatExtractor {
  extension = "br";

  extractContent(buf: Buffer): Promise<Buffer> {
    return sairiCompress.decompress(buf);
  }
}
