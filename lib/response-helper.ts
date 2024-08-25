// responseHelpers.js

import type { Response } from "express";
import ExpressError from "./express-error";

/**
 * Sends a success response
 * @param {object} res - The Express response object
 * @param {number} [statusCode=200] - The HTTP status code
 * @param {object} [data={}] - The data to send in the response
 * @param {string} [message="Success"] - The success message
 */
export const sendSuccess = (
  res: Response,
  statusCode = 200,
  message = "Success",
  data = {}
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

/**
 * Sends an error response
 * @param {object} res - The Express response object
 * @param {number} [statusCode=500] - The HTTP status code
 * @param {string} [message="Internal Server Error"] - The error message
 */
export const sendError = (
  statusCode = 500,
  message = "Internal Server Error"
) => {
  throw new ExpressError(message, statusCode);
};
