import { Result, result } from "folktale";
import R = require("ramda");
import { allowedUsers } from "../allowedUsers";

/**
 * ユーザチェック
 * @param uid ユーザID
 */
export function validateUid(uid: string): Result<string, unknown> {
  const contain = R.includes(uid, allowedUsers);
  return contain
    ? result.Ok({})
    : result.Error(`User '${uid}' is now allowed.`);
}
