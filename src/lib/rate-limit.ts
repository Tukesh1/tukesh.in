import { Ratelimit } from "@upstash/ratelimit";
import { getRedis, isRedisConfigured } from "./redis";

/**
 * Centralized rate-limit definitions for all server actions that write state.
 *
 * We keep these numbers deliberately generous for humans and tight for bots.
 * All limiters share the same Redis database via Upstash's REST client.
 *
 * Usage:
 *   const limiter = getRateLimiter("guestbookPost");
 *   if (limiter) {
 *     const { success } = await limiter.limit(`user:${userId}`);
 *     if (!success) return { ok: false, error: "slow down" };
 *   }
 *
 * If Redis is not configured, `getRateLimiter` returns null and callers should
 * no-op — the feature itself is already gated on Redis being available.
 */

export type LimiterKey =
  | "guestbookPost"
  | "guestbookDelete"
  | "guestbookPin";

type LimiterMap = Record<LimiterKey, Ratelimit>;

let _limiters: LimiterMap | null = null;

function buildLimiters(): LimiterMap {
  const redis = getRedis();
  return {
    guestbookPost: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "rl:gb:post",
      analytics: false,
    }),
    guestbookDelete: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 h"),
      prefix: "rl:gb:del",
      analytics: false,
    }),
    guestbookPin: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 h"),
      prefix: "rl:gb:pin",
      analytics: false,
    }),
  };
}

export function getRateLimiter(key: LimiterKey): Ratelimit | null {
  if (!isRedisConfigured) return null;
  if (!_limiters) _limiters = buildLimiters();
  return _limiters[key];
}
