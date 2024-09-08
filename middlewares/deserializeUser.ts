import type { NextFunction, Request, Response } from "express";
import { sendError } from "../lib/response-helper";
import * as AuthService from "../services/auth-service";
import catchAsync from "../lib/catch-async";

export const deserializeUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next();
    }

    const refreshToken = req.cookies?.["refreshToken"];

    const { error, type, decoded, newAccessToken } =
      await AuthService.validateToken(accessToken, refreshToken);

    console.log(type);

    if (!error && type === "ACCESS_TOKEN_VERIFIED" && decoded) {
      res.locals.user = decoded;
      return next();
    }

    if (error && type === "INVALID_REFRESH_TOKEN") {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        // 15 days
        maxAge: 60 * 60 * 24 * 15 * 1000,
        secure: Bun.env.NODE_ENV === "production",
        sameSite: "none",
      });

      return sendError(403, type);
    }

    if (!error && type === "NEW_ACCESS_TOKEN" && decoded) {
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        // 15 secs
        maxAge: 15 * 60 * 1000,
        secure: Bun.env.NODE_ENV === "production",
        sameSite: "none",
      });

      res.locals.user = decoded;
    }

    return next();
  }
);
