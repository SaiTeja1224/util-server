import express from "express";
import v1Router from "./v1";
import { sendError } from "../lib/response-helper";

const router = express.Router();

router.use("/v1", v1Router);

router.get("/", (req, res) => {
  res.send("Server running!");
});

router.use("*", (req, res, next) => {
  sendError(404, "404! Not Found");
});

export default router;
