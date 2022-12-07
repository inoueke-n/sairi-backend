import { sairiCompress } from "@inoueke-n/sairi-common";
import { SaveDataCreator } from ".";

export class SairiDataCreator implements SaveDataCreator {
  extension = "br";

  makeContent(buf: Buffer): Promise<Buffer> {
    return sairiCompress.compress(buf);
  }
}
