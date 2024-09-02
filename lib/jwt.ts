import jwt from "jsonwebtoken";

export const signToken = <T extends Object>(
  data: T,
  key: "accessToken" | "refreshToken",
  options?: jwt.SignOptions
) => {
  const signingKeyBuffer =
    key === "accessToken"
      ? (Bun.env.ACCESS_TOKEN_PRIVATE_KEY as string)
      : (Bun.env.REFRESH_TOKEN_PRIVATE_KEY as string);

  const signingKey = Buffer.from(signingKeyBuffer, "base64").toString("utf-8");

  return jwt.sign(data, signingKey, {
    ...(options && options),
    algorithm: "RS512",
  });
};

export const verifyToken = <T>(
  token: string,
  key: "accessToken" | "refreshToken",
  options?: jwt.VerifyOptions
): T | null => {
  const verifyingKeyBuffer =
    key === "accessToken"
      ? (Bun.env.ACCESS_TOKEN_PUBLIC_KEY as string)
      : (Bun.env.REFRESH_TOKEN_PUBLIC_KEY as string);

  const verifyingKey = Buffer.from(verifyingKeyBuffer, "base64").toString(
    "ascii"
  );
  try {
    const decoded = jwt.verify(token, verifyingKey, options) as T;
    return decoded;
  } catch (e) {
    return null;
  }
};
