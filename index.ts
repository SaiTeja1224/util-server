import express from "express";

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import useragent from "express-useragent";
import cookieParser from "cookie-parser";

import { handleErrors } from "./controllers/error-controller";

import logger from "./lib/logger";
import "./lib/db";

import router from "./routes";
import { deserializeUser } from "./middlewares/deserializeUser";

const app = express();
const PORT = Bun.env.PORT || 5000;

app.use(morgan("common"));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

// deserializing user to locals
app.use(deserializeUser);

// App router
app.use(router);

// Error-handling middleware
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Web Server running on ${PORT}!`);
});

process.on("unhandledRejection", (err: Error) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.stack);
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.stack);
  process.exit(1);
});
