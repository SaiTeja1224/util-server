import type { NextFunction, Request, Response } from "express";
import catchAsync from "../lib/catch-async";
import { getRedisInstance } from "../lib/redis";
import { sendError } from "../lib/response-helper";

const WINDOW_SIZE_IN_SECONDS = 60; // Window size for rate limiting (e.g., 60 seconds)
const MAX_REQUESTS = 2; // Max number of requests allowed per window per user

export const rateLimiter = catchAsync(
  async (req: Request, _: Response, next: NextFunction) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const ip = req.ip;
    const redisKey = "rateLimiter:" + ip;
    const redisClient = getRedisInstance();

    const requestTimestamps = await redisClient.lrange(redisKey, 0, -1);

    const validTimeStamps = requestTimestamps.filter(
      (timestamp) => Number(timestamp) > currentTime - WINDOW_SIZE_IN_SECONDS
    );

    if (validTimeStamps.length >= MAX_REQUESTS) {
      return sendError(429, "Too Many Requests"); // 429 status code for rate limiting
    }

    await redisClient
      .multi()
      .rpush(redisKey, currentTime) // Add the current timestamp
      .expire(redisKey, WINDOW_SIZE_IN_SECONDS) // Set expiry for the key
      .exec();

    return next();
  }
);
