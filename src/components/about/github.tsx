"use client";

import React from "react";
import dynamic from "next/dynamic";
import { siteMetadata } from "@/data/siteMetadata";

interface GitHubCalendarProps {
  username: string;
  blockSize?: number;
  blockMargin?: number;
  color?: string;
  fontSize?: number;
  theme?: {
    light: string[];
    dark: string[];
  };
  showTotalCount?: boolean;
  dateFormat?: string;
  startDate?: Date;
  endDate?: Date;
}

// react-github-calendar is ~30kB and client-only; load it after hydration
const GitHubCalendarTyped = dynamic(
  () =>
    import("react-github-calendar").then(
      (m) => m.default as React.ComponentType<GitHubCalendarProps>
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[140px] w-full animate-pulse rounded bg-neutral-100 dark:bg-neutral-800/60" />
    ),
  }
);

export function Github() {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 12);

  return (
    <div id="github">
      <div className="px-3 py-4 border border-neutral-900/10 dark:border-neutral-50/10 hover:border-neutral-900/30 dark:hover:border-neutral-50/30 rounded bg-white dark:bg-dark-bg shadow-md flex flex-col items-center transition-colors duration-700 hover:duration-100">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white mb-4 tracking-tight text-center">
          Days I <span className="text-green-600 dark:text-green-400">Code</span>
        </h1>
        <div className="overflow-x-auto w-full flex justify-center">
          <GitHubCalendarTyped
            username={siteMetadata.handles.github}
            blockSize={10}
            blockMargin={2}
            color="#239a3b"
            fontSize={16}
            theme={{
              light: [
                "#ebedf0",
                "#c6e48b",
                "#7bc96f",
                "#239a3b",
                "#196127",
              ],
              dark: [
                "#4b5563",
                "#bef264",
                "#84cc16",
                "#52d726",
                "#3f9c1f",
              ],
            }}
            showTotalCount={true}
            dateFormat="yyyy-mm-dd"
            startDate={startDate}
            endDate={today}
          />
        </div>
      </div>
    </div>
  );
}
