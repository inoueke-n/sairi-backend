import * as fs from "fs";
import * as path from "path";

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.promises.stat(path);
    return true;
  } catch (error) {
    return false;
  }
}

export async function createDir(path: string): Promise<string> {
  const existing = await exists(path);
  if (!existing) {
    // recursiveをつけておくと、mkdir -p のように
    // 再帰的にディレクトリを作ってくれる
    await fs.promises.mkdir(path, { recursive: true });
  }
  return path;
}

export async function createFile(
  filePath: string,
  content = ""
): Promise<void> {
  // ディレクトリを先に用意しておく必要がある
  const dir = path.dirname(filePath);
  await createDir(dir);
  await fs.promises.writeFile(filePath, content);
}

export async function readFile(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, "utf-8");
}
