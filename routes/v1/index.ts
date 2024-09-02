import express from "express";
import authRouter from "./auth";
import userRouter from "./user";

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", userRouter);

v1Router.get("/", (req, res) => {
  res.send("V1 running!");
});

export default v1Router;
