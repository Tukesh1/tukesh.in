"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { postMessageAction, type ActionResult } from "@/app/guestbook/actions";
import { MAX_MESSAGE_LEN } from "@/lib/guestbook";
import { cn } from "@/lib/utils";

type Props = {
  user: {
    name: string;
    login: string;
    image: string;
  };
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 dark:bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white dark:text-gray-900 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Signing…" : "Sign the wall"}
    </button>
  );
}

export function MessageForm({ user }: Props) {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    postMessageAction,
    null
  );
  const [value, setValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const remaining = MAX_MESSAGE_LEN - value.length;
  const tooLong = remaining < 0;
  const empty = value.trim().length === 0;

  useEffect(() => {
    if (state?.ok) {
      setValue("");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="p-4">
      <div className="flex gap-3">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full border border-gray-200 dark:border-gray-800"
            unoptimized
          />
        ) : (
          <div className="size-9 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />
        )}

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </span>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
              @{user.login}
            </span>
          </div>

          <textarea
            name="message"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Leave a note — a hello, a recommendation, or a memory."
            rows={3}
            maxLength={MAX_MESSAGE_LEN + 40} // allow a little overflow so users see the error
            className={cn(
              "w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-colors",
              tooLong
                ? "border-rose-400/60 dark:border-rose-500/50"
                : "border-gray-200 dark:border-gray-800 focus:border-teal-500/50"
            )}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="font-mono text-[10px] uppercase tracking-wider">
              <span
                className={cn(
                  "tabular-nums",
                  tooLong
                    ? "text-rose-500"
                    : remaining < 40
                      ? "text-amber-500"
                      : "text-neutral-500 dark:text-neutral-400"
                )}
              >
                {remaining}
              </span>
              <span className="ml-1 text-neutral-400">left</span>
            </div>

            <SubmitButton disabled={empty || tooLong} />
          </div>

          {state && !state.ok && (
            <p
              role="alert"
              className="mt-2 font-mono text-[11px] text-rose-500"
            >
              {state.error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
