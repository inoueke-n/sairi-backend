import { db } from "src/lib/indexstorage/db";
import { sairiCompress } from "@inoueke-n/sairi-common";

import { NCloudReader } from "./nextcloudReader";
import { SendData } from "src/lib/indexstorage/db/types";

type Optional<T> = T | undefined;

export async function readData(
  uid: string,
  filename: string
): Promise<Optional<any>> {
  const json = await db.send.get(uid, filename);
  if (json) {
    return await readDataFromNC(json);
  }
  return undefined;
}

export async function readUserSentData(uid: string) {
  const json = await db.send.getUserData(uid);
  return json;
}

export async function readUserData(uid: string) {
  const json = await readUserSentData(uid);
  if (json) {
    return await Promise.all(json.map(readDataFromNC));
  } else {
    return [];
  }
}

async function readDataFromNC(sendData: SendData) {
  const { storage_id, uid, id } = sendData;
  if (storage_id === "ncloud") {
    const reader = new NCloudReader();
    const content = await reader.readFromStorage(uid, id);
    if (typeof content.content !== "string") {
      const result = await sairiCompress.decompress(content.content);
      return JSON.parse(result.toString());
    } else {
      return content.content;
    }
  } else {
    return "";
  }
}
