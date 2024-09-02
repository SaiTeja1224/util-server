import type { NextFunction, Request, Response } from "express";
import type ExpressError from "../lib/express-error";
import logger from "../lib/logger";

const isProduction = Bun.env.NODE_ENV === "production";

export const handleErrors = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isProduction) {
    logger.error(`Error occurred: ${err.message}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: err.statusCode,
    });
  }

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: "error",
      data: err.data,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};
