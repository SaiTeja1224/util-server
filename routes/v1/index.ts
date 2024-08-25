import express from "express";
import { sendError } from "../../lib/response-helper";

const v1Router = express.Router();

v1Router.get("/test", (req, res) => {
  sendError(401, "Testing error handling");
});

v1Router.get("/", (req, res) => {
  res.send("V1 running!");
});

export default v1Router;
