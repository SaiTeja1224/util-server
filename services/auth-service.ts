import { signToken } from "../lib/jwt";
import { getRedisInstance } from "../lib/redis";
import type { TPublicUser } from "../lib/types";

const createSession = async ({
  sessionDetails,
}: {
  sessionDetails: Record<string, string | number>;
}) => {
  const redis = getRedisInstance();

  const sessionId = crypto.randomUUID();

  const response = await redis.set(
    sessionId,
    JSON.stringify(sessionDetails),
    "EX",
    60 * 60 * 24 * 15 * 1000
  );

  return response === "OK" && sessionId;
};

export const getSession = async (sessionId: string) => {
  try {
    const redis = getRedisInstance();
    const value = await redis.get(sessionId);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    console.error("Failed to get session:", e);
    return null;
  }
};
export const invalidateSession = async (sessionId: string) => {
  try {
    const redis = getRedisInstance();

    // Step 1: Fetch the stringified value
    const sessionDataString = await redis.get(sessionId);

    if (!sessionDataString) {
      console.error("Session not found");
      return false;
    }

    let sessionData = JSON.parse(sessionDataString);

    sessionData = { ...sessionData, valid: false };

    const updatedSessionDataString = JSON.stringify(sessionData);

    const result = await redis.set(
      sessionId,
      updatedSessionDataString,
      "EX",
      60 * 60 * 24 * 15 * 1000
    );

    return result === "OK";
  } catch (e) {
    console.error("Failed to invalidate session:", e);
    return false;
  }
};

export const signAccessToken = (user: TPublicUser) => {
  return signToken(user, "accessToken", { expiresIn: "1m" });
};

export const signRefreshToken = async ({
  user,
  meta,
}: {
  user: TPublicUser;
  meta: Record<string, string | number | boolean>;
}) => {
  const sessionId = await createSession({
    sessionDetails: { ...meta, userId: user._id.toString() },
  });
  if (!sessionId) {
    return null;
  }
  return signToken({ user, sessionId }, "refreshToken", {
    expiresIn: "15d",
  });
};
