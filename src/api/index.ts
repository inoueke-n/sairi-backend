import app from "./app";
import { initializeStorage } from "src/lib/indexstorage/db/initialize";

/**
 * express.js
 */
bootstrap().then(() =>
  app.listen(80, () => {
    console.log("API server launched.");
  })
);

/**
 * サーバ起動前に済ませておく処理置き場
 */
async function bootstrap(): Promise<void> {
  await initializeStorage();
}
