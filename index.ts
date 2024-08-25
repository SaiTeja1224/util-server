import express from "express";

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { handleErrors } from "./controllers/errorController";
import logger from "./lib/logger";

import router from "./routes";

const app = express();
const PORT = Bun.env.PORT || 5000;

app.use(morgan("combined"));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
