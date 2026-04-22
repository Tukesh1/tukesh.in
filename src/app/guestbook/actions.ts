"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "@/auth";
import {
  createMessage,
  deleteMessage as deleteMessageInDb,
  togglePin as togglePinInDb,
  MAX_MESSAGE_LEN,
  MIN_ACCOUNT_AGE_DAYS,
} from "@/lib/guestbook";
import { getRateLimiter } from "@/lib/rate-limit";

const ADMIN = process.env.ADMIN_GITHUB_USERNAME ?? "";

export type ActionResult = { ok: true } | { ok: false; error: string };

/* --------------------------- auth actions --------------------------- */

export async function signInWithGitHubAction(): Promise<void> {
  await signIn("github", { redirectTo: "/guestbook" });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/guestbook" });
}

/* --------------------------- message actions --------------------------- */

export async function postMessageAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You need to sign in with GitHub first." };
  }

  const raw = formData.get("message");
  const message = typeof raw === "string" ? raw.trim() : "";
  if (!message) return { ok: false, error: "Write something first." };
  if (message.length > MAX_MESSAGE_LEN) {
    return {
      ok: false,
      error: `Keep it under ${MAX_MESSAGE_LEN} characters.`,
    };
  }

  // Per-user rate limit: 5 post attempts / hour. Prevents delete+repost loops.
  const limiter = getRateLimiter("guestbookPost");
  if (limiter) {
    const { success } = await limiter.limit(`user:${session.user.id}`);
    if (!success) {
      return {
        ok: false,
        error: "You're doing that too often. Try again in a bit.",
      };
    }
  }

  // Basic spam guard: require a GitHub account older than a week.
  const createdAt = session.user.createdAt;
  if (createdAt) {
    const ageDays =
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays < MIN_ACCOUNT_AGE_DAYS) {
      return {
        ok: false,
        error: `GitHub accounts need to be at least ${MIN_ACCOUNT_AGE_DAYS} days old to sign.`,
      };
    }
  }

  const created = await createMessage({
    userId: session.user.id,
    username: session.user.login || "",
    name: session.user.name || session.user.login || "Anonymous",
    avatar: session.user.image || "",
    message,
  });

  // createMessage returns null when the user already has a message — the
  // one-per-user rule is enforced atomically by SETNX inside the data layer.
  if (!created) {
    return {
      ok: false,
      error: "You already signed the wall — delete your entry to post a new one.",
    };
  }

  revalidatePath("/guestbook");
  return { ok: true };
}

export async function deleteMessageAction(
  messageId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };

  // Only the author or the admin may delete a message. We enforce this by
  // checking the message's userId prefix against the current user's id, or by
  // matching the admin username.
  const [authorId] = messageId.split("-");
  const viewerLogin = (session.user.login ?? "").toLowerCase();
  const isOwner = authorId === session.user.id;
  const isAdmin = ADMIN.length > 0 && viewerLogin === ADMIN.toLowerCase();
  if (!isOwner && !isAdmin) {
    return { ok: false, error: "Not allowed." };
  }

  const limiter = getRateLimiter("guestbookDelete");
  if (limiter) {
    const { success } = await limiter.limit(`user:${session.user.id}`);
    if (!success) {
      return { ok: false, error: "Too many delete attempts. Try again later." };
    }
  }

  await deleteMessageInDb(messageId);
  revalidatePath("/guestbook");
  return { ok: true };
}

export async function togglePinAction(
  messageId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in." };
  const viewerLogin = (session.user.login ?? "").toLowerCase();
  const isAdmin = ADMIN.length > 0 && viewerLogin === ADMIN.toLowerCase();
  if (!isAdmin) return { ok: false, error: "Admin only." };

  const limiter = getRateLimiter("guestbookPin");
  if (limiter) {
    const { success } = await limiter.limit(`user:${session.user.id}`);
    if (!success) return { ok: false, error: "Slow down a little." };
  }

  await togglePinInDb(messageId);
  revalidatePath("/guestbook");
  return { ok: true };
}
