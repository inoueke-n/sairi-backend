import { Router } from "express";
import { readData, readUserData, readUserSentData } from "../history";

export const historyRouter = Router({ mergeParams: true });

historyRouter.get("/", (_req, res) => {
  console.log("history GET");
  return res.send(
    "Welcome to send endpoint but you cannot get everything at once."
  );
});

historyRouter.get("/raw/:uid", async (req, res) => {
  const uid: string = req.params["uid"];
  try {
    const json = await readUserSentData(uid);
    // console.log(json);
    return res.status(200).contentType("application/json").send(json);
  } catch (err) {
    return res.status(400).send(err);
  }
});

historyRouter.get("/:uid/:fileId", async (req, res) => {
  const uid: string = req.params["uid"];
  const fileId: string = req.params["fileId"];
  try {
    const json = await readData(uid, fileId);
    // console.log(json);
    return res.status(200).contentType("application/json").send(json);
  } catch (err) {
    return res.status(400).send(err);
  }
});

historyRouter.get("/:uid/", async (req, res) => {
  const uid: string = req.params["uid"];
  try {
    const json = await readUserData(uid);
    // console.log(json);
    return res.status(200).contentType("application/json").send(json);
  } catch (err) {
    return res.status(400).send(err);
  }
});
