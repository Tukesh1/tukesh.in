"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Panel, PanelContent, PanelHeader } from "@/components/panel";

/**
 * Graceful fallback if /guestbook throws during render — e.g. Redis is down
 * or OAuth misconfigured in production. We never want the entire route to
 * collapse into a generic Next.js error page.
 */
export default function GuestbookError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the digest in the server logs so we can correlate.
    console.error("[guestbook] render error:", error);
  }, [error]);

  return (
    <Panel className="mt-6">
      <PanelHeader>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Guestbook is taking a breather
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Something went sideways loading the wall. Try again in a moment —
              or reach out if it keeps happening.
            </p>
          </div>
        </div>
      </PanelHeader>
      <PanelContent>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-100 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <RotateCw className="size-3.5" />
          Try again
        </button>
      </PanelContent>
    </Panel>
  );
}
