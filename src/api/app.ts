import express from "express";
import cors from "cors";

import { checkAPIRouter } from "./router/checkAPI";
import { sendRouter } from "./router/send";
import { historyRouter } from "./router/history";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// application/kamakuraはdataをBufferとして扱う
app.use(
  express.raw({
    type: "application/kamakura",
  })
);
app.use(cors());

// list of apis

app.get("/hello", (req, res) => {
  res.send("Received hello.\n");
});

app.use("/check", checkAPIRouter);
app.use("/healthCheck", checkAPIRouter);
app.use("/send", sendRouter);
app.use("/history", historyRouter);

export default app;
