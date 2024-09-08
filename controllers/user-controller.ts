import catchAsync from "../lib/catch-async";
import { sendError, sendSuccess } from "../lib/response-helper";
import type { TPublicUser } from "../lib/types";
import validate from "../lib/validator";
import { createUserSchema } from "../schemas/user-schema";
import * as UserService from "../services/user-service";
import * as AuthService from "../services/auth-service";

export const registerUserHandler = catchAsync(async (req, res) => {
  const result = await validate(createUserSchema, req.body, { async: true });

  if (!result.success) {
    return sendError(400, result.message, result.errors);
  }

  const data = result.data;
  const user = await UserService.createUser(data);
  if (user) {
    const tokenData = {
      username: user.username,
      _id: user._id,
    };

    const accessToken = AuthService.signAccessToken(tokenData);

    const metadata = {
      Browser: req.useragent?.browser as string,
      OS: req.useragent?.os as string,
      Platform: req.useragent?.platform as string,
      valid: true,
    };

    const refreshToken = await AuthService.signRefreshToken({
      user: tokenData,
      meta: metadata,
    });

    return sendSuccess(
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          // 15 days
          maxAge: 60 * 60 * 24 * 15 * 1000,
          secure: Bun.env.NODE_ENV === "production",
          sameSite: "none",
        })
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          // 15 secs
          maxAge: 15 * 60 * 1000,
          secure: Bun.env.NODE_ENV === "production",
          sameSite: "none",
        }),
      200,
      "Logged in successfully",
      { accessToken, refreshToken, ...tokenData }
    );
  }

  return sendSuccess(res, 200, "User created successfully", user);
});

export const loggedInUserHandler = catchAsync(async (req, res) => {
  const user: TPublicUser = res.locals.user;
  return sendSuccess(res, 200, "User fetched successfully", user);
});
