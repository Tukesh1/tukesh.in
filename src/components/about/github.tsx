"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { siteMetadata } from "@/data/siteMetadata";

interface GitHubCalendarProps {
  username: string;
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
  fontSize?: number;
  colorScheme?: "light" | "dark";
  theme?: {
    light: string[];
    dark: string[];
  };
  labels?: {
    totalCount?: string;
    legend?: { less?: string; more?: string };
  };
  hideColorLegend?: boolean;
  hideTotalCount?: boolean;
  hideMonthLabels?: boolean;
  showWeekdayLabels?: boolean | string[];
  style?: React.CSSProperties;
  year?: number | "last";
}

// Lazy-load the heavy calendar widget after hydration
const Calendar = dynamic(
  () =>
    import("react-github-calendar").then(
      (m) => m.default as React.ComponentType<GitHubCalendarProps>
    ),
  {
    ssr: false,
    loading: () => <div className="github-calendar-skeleton" />,
  }
);

export function Github() {
  const { resolvedTheme } = useTheme();
  const colorScheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div id="github" className="github-graph">
      <div className="github-graph__card">
        <div className="github-graph__calendar">
          <Calendar
            username={siteMetadata.handles.github}
            colorScheme={colorScheme}
            blockSize={12}
            blockMargin={3}
            blockRadius={2}
            fontSize={12}
            theme={{
              light: [
                "#ebedf0",
                "#9be9a8",
                "#40c463",
                "#30a14e",
                "#216e39",
              ],
              dark: [
                "#161b22",
                "#0e4429",
                "#006d32",
                "#26a641",
                "#39d353",
              ],
            }}
            labels={{
              totalCount:
                "{{count}} contributions in the last year",
              legend: {
                less: "Less",
                more: "More",
              },
            }}
            hideTotalCount={false}
            hideColorLegend={false}
            hideMonthLabels={false}
            year="last"
          />
        </div>
      </div>
    </div>
  );
}
