import catchAsync from "../lib/catch-async";
import { sendError, sendSuccess } from "../lib/response-helper";
import { type RefreshToken } from "../lib/types";
import validate from "../lib/validator";
import { loginUserSchema } from "../schemas/user-schema";
import * as UserService from "../services/user-service";
import * as AuthService from "../services/auth-service";
import { verifyToken } from "../lib/jwt";

export const loginHandler = catchAsync(async (req, res) => {
  const result = await validate(loginUserSchema, req.body);

  if (!result.success) {
    return sendError(400, result.message, result.errors);
  }

  const message = "Invalid username/password";

  const data = result.data;
  const user = await UserService.findByUsername(data.username);

  if (!user) {
    return sendError(404, message);
  }

  const passwordMatch = await Bun.password.verify(
    data.password,
    user.hashedPassword
  );

  if (!passwordMatch) {
    return sendError(401, message);
  }

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
});

export const refreshHandler = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.["refreshToken"];

  const decodedRefreshToken = verifyToken<RefreshToken>(
    refreshToken,
    "refreshToken"
  );

  if (decodedRefreshToken) {
    const session = await AuthService.getSession(decodedRefreshToken.sessionId);

    if (!session || !session.valid) {
      return sendError(403, "Invalid Token! login again");
    }

    const newAccessToken = AuthService.signAccessToken(
      decodedRefreshToken.user
    );

    return sendSuccess(
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        // 15 secs
        maxAge: 15 * 60 * 1000,
        secure: Bun.env.NODE_ENV === "production",
        sameSite: "none",
      }),
      200,
      "Token refreshed successfully",
      {
        accessToken: newAccessToken,
      }
    );
  } else {
    return sendError(403, "Invalid Token! login again");
  }
});

export const logoutHandler = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.["refreshToken"];

  const decodedRefreshToken = verifyToken<RefreshToken>(
    refreshToken,
    "refreshToken"
  );

  if (decodedRefreshToken) {
    await AuthService.invalidateSession(decodedRefreshToken.sessionId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      // 15 secs
      maxAge: 15 * 60 * 1000,
      secure: Bun.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      // 15 days
      maxAge: 60 * 60 * 24 * 15 * 1000,
      secure: Bun.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return sendSuccess(res, 200, "Logged out successfully");
  } else {
    return sendError(403, "Invalid Token!");
  }
});

export const validateTokenHandler = catchAsync(async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1]; // Get Bearer token
  const refreshToken = req.headers["x-refresh-token"]; // Get refresh token

  if (!accessToken || !refreshToken) {
    return sendError(400, "Invalid Request");
  }

  const { error, type, decoded, newAccessToken } =
    await AuthService.validateToken(accessToken, refreshToken as string);

  if (error) {
    return sendError(403, type);
  }

  return sendSuccess(res, 200, type, {
    accessToken: newAccessToken,
    ...decoded,
  });
});
