import * as R from "ramda";
import { ParsedQs } from "qs";
import { Result, result } from "folktale";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Result2 = require("folktale/result");

/**
 * 指定されたキーを持つか確認し、その型に変換して返す
 * @param query 分析対象データ
 * @param keys 型のキー一覧
 */
export function checkParamsExists<T>(
  query: ParsedQs,
  keys: (keyof T)[]
): Result<string, T> {
  const results = keys.map((key) => checkParam(query, key as string));

  const errors = results.filter((x) => !Result2.Ok.hasInstance(x));
  const allSuccess = R.length(errors) === 0;

  if (allSuccess) {
    return result.Ok(query as unknown as T);
  } else {
    const errMsg = errors.map((x) => x.merge()).join("\n");
    return result.Error(errMsg);
  }
}

function checkParam(query: ParsedQs, key: string): Result<string, unknown> {
  const v = query[key];
  if (!R.isNil(v)) {
    return result.Ok({});
  } else {
    return result.Error(`'${key}' is undefined`);
  }
}
