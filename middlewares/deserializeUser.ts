import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { sendError } from "../lib/response-helper";
import type { RefreshToken } from "../lib/types";
import * as AuthService from "../services/auth-service";
import catchAsync from "../lib/catch-async";

export const deserializeUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next();
    }

    const decoded = verifyToken(accessToken, "accessToken");

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }

    console.log("Access Token Expired");

    const refreshToken = req.cookies?.["refreshToken"];

    const decodedRefreshToken = verifyToken<RefreshToken>(
      refreshToken,
      "refreshToken"
    );

    if (decodedRefreshToken) {
      const session = await AuthService.getSession(
        decodedRefreshToken.sessionId
      );

      if (!session || !session.valid) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          // 15 days
          maxAge: 60 * 60 * 24 * 15 * 1000,
          secure: Bun.env.NODE_ENV === "production",
          sameSite: "none",
        });

        return sendError(403, "Invalid Token!");
      }

      const newAccessToken = AuthService.signAccessToken(
        decodedRefreshToken.user
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        // 15 mins
        maxAge: 15 * 60 * 1000,
        secure: Bun.env.NODE_ENV === "production",
        sameSite: "none",
      });
    } else {
      return sendError(403, "Invalid Token!");
    }

    return next();
  }
);
