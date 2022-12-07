import NextcloudClient from "nextcloud-link";
import { WritableStreamBuffer } from "stream-buffers";

export async function downloadFile(
  drive: NextcloudClient,
  filename: string,
  folder: string
) {
  try {
    const path = "/" + folder + "/" + filename + ".br";
    const streamBuffer = new WritableStreamBuffer();
    await drive.downloadToStream(path, streamBuffer);
    const contents = streamBuffer.getContents();
    if (contents) {
      return contents;
    } else {
      return "";
    }
  } catch (err: any) {
    console.error(err);
    return "";
  }
}
