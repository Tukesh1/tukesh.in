"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Pin, PinOff, Shield, Trash2 } from "lucide-react";
import {
  deleteMessageAction,
  togglePinAction,
} from "@/app/guestbook/actions";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  message: string;
  createdAt: number;
  pinned: boolean;
  canDelete: boolean;
  canPin: boolean;
  isOwn?: boolean;
  /** If the deletion would be a moderator action (admin deleting someone else's message). */
  isModAction?: boolean;
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MessageItem({
  id,
  name,
  username,
  avatar,
  message,
  createdAt,
  pinned,
  canDelete,
  canPin,
  isOwn = false,
  isModAction = false,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    const msg = isModAction
      ? `Delete this message from @${username}? This cannot be undone.`
      : "Delete your message?";
    if (!confirm(msg)) return;
    startTransition(async () => {
      const res = await deleteMessageAction(id);
      if (!res.ok) alert(res.error);
    });
  };

  const onPin = () => {
    startTransition(async () => {
      const res = await togglePinAction(id);
      if (!res.ok) alert(res.error);
    });
  };

  return (
    <li
      className={cn(
        "group relative px-4 py-4 transition-opacity",
        pinned && "bg-amber-50/40 dark:bg-amber-500/5",
        isOwn && !pinned && "bg-teal-500/[0.03]",
        isOwn && "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-teal-500/60",
        isPending && "opacity-50"
      )}
    >
      <div className="flex items-start gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full border border-gray-200 dark:border-gray-800"
          />
        ) : (
          <div className="size-9 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate"
            >
              {name}
            </a>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
              @{username}
            </span>
            {pinned && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Pin className="size-2.5" />
                pinned
              </span>
            )}
            {isOwn && !pinned && (
              <span className="inline-flex shrink-0 items-center rounded border border-teal-500/30 bg-teal-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-teal-600 dark:text-teal-400">
                you
              </span>
            )}
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {message}
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <time
              dateTime={new Date(createdAt).toISOString()}
              title={new Date(createdAt).toISOString()}
              suppressHydrationWarning
              className="font-mono text-[10px] text-neutral-400"
            >
              {relativeTime(createdAt)}
            </time>

            {(canDelete || canPin) && (
              <div className="flex items-center gap-2">
                {canPin && (
                  <button
                    type="button"
                    onClick={onPin}
                    disabled={isPending}
                    aria-label={pinned ? "Unpin" : "Pin"}
                    title={pinned ? "Unpin this message" : "Pin this message to the top"}
                    className="inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-800 px-1.5 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-40 transition-colors"
                  >
                    {pinned ? (
                      <PinOff className="size-3" />
                    ) : (
                      <Pin className="size-3" />
                    )}
                    {pinned ? "Unpin" : "Pin"}
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    disabled={isPending}
                    aria-label={isModAction ? `Delete message from @${username} (moderator)` : "Delete your message"}
                    title={isModAction ? `Moderator: delete this message from @${username}` : "Delete your message"}
                    className={cn(
                      "inline-flex items-center gap-1 rounded border px-1.5 py-1 font-mono text-[10px] uppercase tracking-wider disabled:opacity-40 transition-colors",
                      isModAction
                        ? "border-rose-500/30 bg-rose-500/5 text-rose-500 hover:border-rose-500/60 hover:bg-rose-500/10"
                        : "border-gray-200 dark:border-gray-800 text-neutral-500 dark:text-neutral-400 hover:border-rose-500/50 hover:text-rose-500"
                    )}
                  >
                    {isModAction ? (
                      <Shield className="size-3" />
                    ) : (
                      <Trash2 className="size-3" />
                    )}
                    {isModAction ? "Remove" : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
