import { Redis } from "@upstash/redis";

/**
 * Redis client used by the guestbook.
 *
 * Upstash's REST client reads UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * automatically. We construct it lazily so modules that import this file don't
 * crash at build time when the env vars aren't set (e.g. on fresh clones).
 *
 * When env vars are missing, `isRedisConfigured` is false and callers should
 * render a friendly "guestbook unavailable" state rather than blowing up.
 */

export const isRedisConfigured =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!isRedisConfigured) {
    throw new Error(
      "Upstash Redis env vars are missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
    );
  }
  if (!_redis) {
    _redis = Redis.fromEnv();
  }
  return _redis;
}
