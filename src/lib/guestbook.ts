import { getRedis, isRedisConfigured } from "./redis";

/**
 * Guestbook data layer.
 *
 * Data model (Upstash Redis):
 *
 *   gb:ids                       ZSet   score=createdAt(ms), member=messageId
 *   gb:msg:{messageId}           Hash   { userId, username, name, avatar, message, createdAt, pinned }
 *   gb:user:{userId}             String messageId (enforces one-message-per-user)
 *
 * Messages are capped at MAX_MESSAGE_LEN characters, stored verbatim — no HTML,
 * escaped at render time.
 */

export const MAX_MESSAGE_LEN = 280;
export const MIN_ACCOUNT_AGE_DAYS = 7;

export type GuestbookMessage = {
  id: string;
  userId: string;
  username: string;
  name: string;
  avatar: string;
  message: string;
  createdAt: number;
  pinned: boolean;
};

type RawHash = Record<string, string | number | null>;

function hashToMessage(id: string, raw: RawHash | null): GuestbookMessage | null {
  if (!raw || !raw.userId) return null;
  return {
    id,
    userId: String(raw.userId),
    username: String(raw.username ?? ""),
    name: String(raw.name ?? raw.username ?? ""),
    avatar: String(raw.avatar ?? ""),
    message: String(raw.message ?? ""),
    createdAt: Number(raw.createdAt ?? 0),
    pinned: String(raw.pinned ?? "0") === "1",
  };
}

function newMessageId(userId: string, createdAt: number): string {
  return `${userId}-${createdAt}`;
}

/* ----------------------------- reads ----------------------------- */

export async function listMessages(limit = 200): Promise<GuestbookMessage[]> {
  if (!isRedisConfigured) return [];
  const redis = getRedis();

  // Newest first.
  const ids = (await redis.zrange<string[]>("gb:ids", 0, limit - 1, {
    rev: true,
  })) as string[];
  if (!ids || ids.length === 0) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) pipeline.hgetall(`gb:msg:${id}`);
  const hashes = (await pipeline.exec()) as (RawHash | null)[];

  const messages: GuestbookMessage[] = [];
  for (let i = 0; i < ids.length; i++) {
    const msg = hashToMessage(ids[i], hashes[i]);
    if (msg) messages.push(msg);
  }

  // Pinned float to the top, keeping newest-first order within each group.
  messages.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });

  return messages;
}

export async function countMessages(): Promise<number> {
  if (!isRedisConfigured) return 0;
  const redis = getRedis();
  return (await redis.zcard("gb:ids")) ?? 0;
}

export async function getUserMessageId(userId: string): Promise<string | null> {
  if (!isRedisConfigured) return null;
  const redis = getRedis();
  return ((await redis.get<string>(`gb:user:${userId}`)) as string) ?? null;
}

/* ----------------------------- writes ----------------------------- */

export type CreateInput = {
  userId: string;
  username: string;
  name: string;
  avatar: string;
  message: string;
};

/**
 * Atomically create a message, enforcing the one-message-per-user rule at
 * the data layer rather than relying on a prior read-check (which is racy
 * against double-clicks, retries, and parallel requests).
 *
 * Returns `null` when the user already has a message on the wall.
 */
export async function createMessage(
  input: CreateInput
): Promise<GuestbookMessage | null> {
  const redis = getRedis();
  const createdAt = Date.now();
  const id = newMessageId(input.userId, createdAt);
  const userKey = `gb:user:${input.userId}`;

  // Reserve the slot first. SETNX returns "OK" if the key was set, null if
  // it already existed — that's our atomic "already signed" check.
  const reserved = await redis.set(userKey, id, { nx: true });
  if (!reserved) return null;

  try {
    await redis
      .multi()
      .hset(`gb:msg:${id}`, {
        userId: input.userId,
        username: input.username,
        name: input.name,
        avatar: input.avatar,
        message: input.message,
        createdAt,
        pinned: "0",
      })
      .zadd("gb:ids", { score: createdAt, member: id })
      .exec();
  } catch (err) {
    // Best-effort rollback of the reservation so the user can retry.
    await redis.del(userKey).catch(() => {});
    throw err;
  }

  return {
    id,
    userId: input.userId,
    username: input.username,
    name: input.name,
    avatar: input.avatar,
    message: input.message,
    createdAt,
    pinned: false,
  };
}

export async function deleteMessage(messageId: string): Promise<void> {
  const redis = getRedis();
  const raw = (await redis.hgetall(`gb:msg:${messageId}`)) as RawHash | null;
  const userId = raw?.userId ? String(raw.userId) : null;

  const tx = redis.multi().del(`gb:msg:${messageId}`).zrem("gb:ids", messageId);
  if (userId) tx.del(`gb:user:${userId}`);
  await tx.exec();
}

export async function togglePin(messageId: string): Promise<boolean> {
  const redis = getRedis();
  const current = (await redis.hget(`gb:msg:${messageId}`, "pinned")) as
    | string
    | null;
  const next = String(current ?? "0") === "1" ? "0" : "1";
  await redis.hset(`gb:msg:${messageId}`, { pinned: next });
  return next === "1";
}
