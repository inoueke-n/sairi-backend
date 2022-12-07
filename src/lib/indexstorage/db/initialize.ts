import { SairiDatabase } from ".";

export async function initializeStorage(): Promise<void> {
  const sairiDB = new SairiDatabase();
  await sairiDB.initialize();
}
