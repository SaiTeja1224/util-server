import { Redis } from "ioredis";

let redisInstance: Redis | null = null;

// Singleton
export const getRedisInstance = () => {
  if (!redisInstance) {
    redisInstance = new Redis(Bun.env.REDIS_URI as string);
  }
  return redisInstance;
};

export const setKeyValuePair = async (
  key: string,
  value: string | Buffer | number
) => {
  try {
    const redis = getRedisInstance();
    const response = await redis.set(key, value);
    return response === "OK";
  } catch (e) {
    return false;
  }
};

export const getValue = async (key: string) => {
  try {
    const redis = getRedisInstance();
    const response = await redis.get(key);
    return response;
  } catch (e) {
    return null;
  }
};
