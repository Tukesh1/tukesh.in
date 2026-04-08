import React from "react";
import { Metadata } from "next";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode, SiWakatime } from "react-icons/si";
import {
  GitCommit,
  GitPullRequest,
  GitMerge,
  CircleDot,
  CircleCheck,
  Rocket,
  FolderPlus,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { siteMetadata } from "../../data/siteMetadata";
import {
  getActivityFeed,
  groupByDay,
  humanDuration,
  ActivityItem,
  ActivityKind,
} from "../../data/activity";
import { Panel, PanelContent, PanelHeader } from "../../components/panel";

export const revalidate = 60; // refresh every minute so new pushes show up quickly

export const metadata: Metadata = {
  title: siteMetadata.pages.activity.title,
  description: siteMetadata.pages.activity.description,
  openGraph: {
    title: `${siteMetadata.pages.activity.title} | ${siteMetadata.author}`,
    description: siteMetadata.pages.activity.description,
    url: `${siteMetadata.siteUrl}/activity`,
  },
  alternates: { canonical: `${siteMetadata.siteUrl}/activity` },
};

/* ---------- helpers ---------- */

function kindIcon(kind: ActivityKind) {
  const cls = "size-4";
  switch (kind) {
    case "solve":        return <CheckCircle2 className={cls} />;
    case "commit":       return <GitCommit className={cls} />;
    case "pr-opened":    return <GitPullRequest className={cls} />;
    case "pr-merged":    return <GitMerge className={cls} />;
    case "issue-opened": return <CircleDot className={cls} />;
    case "issue-closed": return <CircleCheck className={cls} />;
    case "release":      return <Rocket className={cls} />;
    case "repo-created": return <FolderPlus className={cls} />;
    case "code-session": return <Code2 className={cls} />;
  }
}

function sourceIcon(source: ActivityItem["source"]) {
  const cls = "size-3 text-neutral-500 dark:text-neutral-400";
  if (source === "leetcode") return <SiLeetcode className={cls} />;
  if (source === "wakatime") return <SiWakatime className={cls} />;
  return <FaGithub className={cls} />;
}

function formatDay(iso: string) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (iso === today) return "Today";
  if (iso === yesterday) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric",
  });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

/* ---------- tiny components ---------- */

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="px-4 py-3 border-r border-dashed border-gray-200 dark:border-gray-800 last:border-r-0 flex-1 min-w-0">
      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
      {hint && <div className="text-[10px] text-neutral-400">{hint}</div>}
    </div>
  );
}

function Row({ item }: { item: ActivityItem }) {
  const commits = item.meta?.commits ?? [];
  const extraCommits = commits.slice(1, 4); // show up to 3 extra
  const languages = item.meta?.languages ?? [];

  return (
    <div className="px-4 py-4">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid grid-cols-[auto_1fr_auto] items-start gap-3"
      >
        {/* kind icon */}
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg text-neutral-600 dark:text-neutral-300 group-hover:border-teal-500/40 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {kindIcon(item.kind)}
        </div>

        {/* content */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
            {item.title}
          </p>
          {item.subtitle && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              {sourceIcon(item.source)}
              <span className="truncate">{item.subtitle}</span>
            </p>
          )}
        </div>

        {/* right meta */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {item.meta?.badge && (
            <span className="inline-flex items-center rounded border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
              {item.meta.badge}
            </span>
          )}
          <span className="font-mono text-[10px] text-neutral-400">{formatTime(item.timestamp)}</span>
        </div>
      </a>

      {/* extra commits (nested) */}
      {extraCommits.length > 0 && (
        <ul className="mt-2 ml-10 space-y-1">
          {extraCommits.map((c) => (
            <li key={c.sha} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <GitCommit className="size-3 shrink-0 opacity-60" />
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-teal-600 dark:hover:text-teal-400">
                {c.message}
              </a>
              {c.sha && <span className="font-mono text-[10px] opacity-60">{c.sha}</span>}
            </li>
          ))}
          {commits.length > 4 && (
            <li className="ml-5 text-[10px] font-mono text-neutral-400">+{commits.length - 4} more</li>
          )}
        </ul>
      )}

      {/* languages (for wakatime) */}
      {languages.length > 0 && (
        <ul className="mt-2 ml-10 flex flex-wrap gap-1.5">
          {languages.map((l) => (
            <li
              key={l.name}
              className="inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:text-neutral-400"
            >
              {l.name}
              {typeof l.percent === "number" && <span className="opacity-60">{l.percent}%</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default async function ActivityPage() {
  const { items, stats, moreUrl } = await getActivityFeed();
  const grouped = groupByDay(items);

  return (
    <React.Fragment>
      {/* Intro */}
      <Panel className="mt-6">
        <PanelHeader>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            A live log of what I&apos;m working on — commits pushed, pull requests, problems
            solved, and quiet coding sessions in VS Code that never made it to GitHub.
            Auto-fetched from GitHub and WakaTime, refreshed every minute. No manual updates.
          </p>
        </PanelHeader>

        {/* Time coded — today & this week */}
        <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800">
          <Stat label="Today"     value={humanDuration(stats.codedToday)}    hint="time coded" />
          <Stat label="This week" value={humanDuration(stats.codedThisWeek)} hint="time coded" />
        </div>

        <PanelContent className="p-0">
          {grouped.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Nothing fetched yet — check back soon.
            </div>
          )}

          {grouped.map(([day, dayItems]) => (
            <section key={day} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
              <div className="sticky top-0 z-[1] flex items-center justify-between bg-white/85 dark:bg-dark-bg/85 backdrop-blur px-4 py-2 border-b border-dashed border-gray-200 dark:border-gray-800">
                <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  {formatDay(day)}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">
                  {dayItems.length} {dayItems.length === 1 ? "event" : "events"}
                </span>
              </div>

              <ul className="divide-y divide-dashed divide-gray-200 dark:divide-gray-800">
                {dayItems.map((it) => (
                  <li key={it.id}>
                    <Row item={it} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* See more */}
          {grouped.length > 0 && (
            <div className="px-4 py-4 text-center border-t border-gray-200 dark:border-gray-800">
              <a
                href={moreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-neutral-500 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                See more on GitHub →
              </a>
            </div>
          )}
        </PanelContent>
      </Panel>
    </React.Fragment>
  );
}
