import { Router } from "express";

import { privateKey } from "src/credentials";
import { validateToken } from "../checkAPI";
import { validateUid } from "../common";
import { checkParamsExists } from "./helper";

export const checkAPIRouter = Router({ mergeParams: true });

/**
 * health check API
 */
checkAPIRouter.get("/", (req, res) => {
  console.log("Welcome check");

  const result = checkParamsExists(req.query, ["uid", "token"]);

  result.matchWith({
    Ok: ({ value }) => {
      const { uid, token } = value;

      validateUid(uid).matchWith({
        Ok: () => {
          // tokenチェック
          validateToken(token, privateKey).matchWith({
            Ok: () => {
              res.status(200).send("OK");
            },
            Error: () => {
              res.status(500).send("Token is invalid");
            },
          });
        },
        Error: ({ value }) => {
          res.status(500).send(value);
        },
      });
    },
    Error: ({ value }) => {
      res.status(500).send(value);
    },
  });
});
