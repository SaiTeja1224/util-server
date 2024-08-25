import express from "express";
import v1Router from "./v1";
import ExpressError from "../lib/express-error";

const router = express.Router();

router.use("/v1", v1Router);

router.get("/", (req, res) => {
  res.send("Server running!");
});

router.use("*", (req, res, next) => {
  next(new ExpressError("404! Not Found", 404));
});

export default router;
