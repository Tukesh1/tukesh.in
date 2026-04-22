import { MessageSquareText } from "lucide-react";
import { Panel, PanelContent, PanelHeader } from "@/components/panel";

/**
 * Streamed while /guestbook is fetching session + messages on the server.
 * Matches the final layout so there's no visual snap on hydration.
 */
export default function Loading() {
  return (
    <Panel className="mt-6">
      <PanelHeader>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg">
            <MessageSquareText className="size-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-72 max-w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </PanelHeader>

      <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3 border-r border-dashed border-gray-200 dark:border-gray-800 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="px-4 py-3 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      <PanelContent className="p-0">
        <ul className="divide-y divide-dashed divide-gray-200 dark:divide-gray-800">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-4">
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}
