import { siteMetadata } from "./siteMetadata";

export type ActivitySource = "leetcode" | "github" | "wakatime";

export type ActivityKind =
  | "solve"        // LeetCode AC submission
  | "commit"       // GitHub push (one or many commits)
  | "pr-opened"
  | "pr-merged"
  | "issue-opened"
  | "issue-closed"
  | "release"
  | "repo-created"
  | "code-session"; // WakaTime daily coding summary

export interface ActivityItem {
  id: string;
  source: ActivitySource;
  kind: ActivityKind;
  title: string;        // main line
  subtitle?: string;    // second line (repo / detail / problem sub)
  url: string;
  timestamp: number;    // epoch ms
  meta?: {
    commits?: { message: string; sha?: string; url?: string }[];
    repo?: string;
    languages?: { name: string; percent?: number }[];
    duration?: string;          // human-readable, e.g. "2 hrs 45 mins"
    durationSeconds?: number;
    project?: string;
    badge?: string;             // small tag shown on the right
  };
}

export interface ActivityStats {
  codedToday: number;     // seconds of coding today
  codedThisWeek: number;  // seconds of coding over the last 7 days
  // Note: all-time stats are a paid WakaTime feature — not included
}

export interface ActivityFeed {
  items: ActivityItem[];
  stats: ActivityStats;
  moreUrl: string;        // "See more" link at the bottom of the feed
}

function ghHeaders(): HeadersInit {
  const h: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

interface GHSearchCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } };
  repository: { full_name: string };
}

function transformCommit(c: GHSearchCommit): ActivityItem | null {
  const msg = c.commit.message.split("\n")[0];
  const ts = new Date(c.commit.author.date).getTime();

  // (1) drop LeetSync stats commits
  if (
    /^Time:\s*\d+\s*ms\b.*Memory:/i.test(msg) ||
    / - Leet(Sync|Hub)\b/i.test(msg)
  ) {
    return null;
  }

  // (2) rewrite LeetSync README commits into a solve entry
  const readme = msg.match(/^Added README\.md file for (.+)$/i);
  if (readme) {
    return {
      id: `ghc-${c.sha}`,
      source: "leetcode",
      kind: "solve",
      title: readme[1].trim(),
      subtitle: "Solved on LeetCode",
      url: c.html_url,
      timestamp: ts,
      meta: { badge: "Solved" },
    };
  }

  // regular commit
  const repo = c.repository.full_name;
  const short = c.sha.slice(0, 7);
  return {
    id: `ghc-${c.sha}`,
    source: "github",
    kind: "commit",
    title: msg,
    subtitle: repo,
    url: c.html_url,
    timestamp: ts,
    meta: {
      repo,
      commits: [{ message: msg, sha: short, url: c.html_url }],
      badge: short,
    },
  };
}

async function fetchGithubCommits(username: string): Promise<ActivityItem[]> {
  try {
    const q = `author:${username} committer:${username}`;
    const url =
      `https://api.github.com/search/commits?q=${encodeURIComponent(q)}` +
      `&sort=author-date&order=desc&per_page=40`;
    const res = await fetch(url, { headers: ghHeaders(), next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const items: GHSearchCommit[] = json?.items ?? [];
    return items.flatMap<ActivityItem>((c) => {
      const item = transformCommit(c);
      return item ? [item] : [];
    });
  } catch {
    return [];
  }
}

interface GHSearchIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  created_at: string;
  state: string;
  pull_request?: { merged_at: string | null };
}

async function fetchGithubPRs(username: string): Promise<ActivityItem[]> {
  try {
    const url =
      `https://api.github.com/search/issues` +
      `?q=author:${encodeURIComponent(username)}+type:pr` +
      `&sort=created&order=desc&per_page=15`;
    const res = await fetch(url, { headers: ghHeaders(), next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const items: GHSearchIssue[] = json?.items ?? [];

    return items.map<ActivityItem>((pr) => {
      const repo = pr.repository_url.split("/").slice(-2).join("/");
      const merged = !!pr.pull_request?.merged_at;
      return {
        id: `ghpr-${pr.id}`,
        source: "github",
        kind: merged ? "pr-merged" : "pr-opened",
        title: pr.title,
        subtitle: repo,
        url: pr.html_url,
        timestamp: new Date(pr.created_at).getTime(),
        meta: { repo, badge: merged ? "PR merged" : "PR opened" },
      };
    });
  } catch {
    return [];
  }
}

async function fetchGithub(username: string): Promise<ActivityItem[]> {
  const [commits, prs] = await Promise.all([
    fetchGithubCommits(username),
    fetchGithubPRs(username),
  ]);
  return [...commits, ...prs];
}

/* ===================================================================== */
/*  WakaTime — tracks ALL VS Code activity, even code never pushed        */
/* ===================================================================== */

interface WTSummary {
  range: { date: string; text: string };
  grand_total: { total_seconds: number; text: string };
  projects: { name: string; total_seconds: number; text: string }[];
  languages: { name: string; total_seconds: number; percent: number }[];
}

function humanDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

interface WakaResult {
  items: ActivityItem[];
  codedToday: number;
  codedThisWeek: number;
}

async function fetchWakaTime(): Promise<WakaResult> {
  const empty: WakaResult = { items: [], codedToday: 0, codedThisWeek: 0 };
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return empty;

  const basicAuth = Buffer.from(`${apiKey}:`).toString("base64");
  const wakaHeaders = { Authorization: `Basic ${basicAuth}` };
  const base = `https://wakatime.com/api/v1/users/current/summaries`;
  const todayUrl = `${base}?range=Today`;
  const weekUrl  = `${base}?range=Last%207%20Days`;

  try {
    const [todayRes, weekRes] = await Promise.all([
      fetch(todayUrl, { headers: wakaHeaders, cache: "no-store" }),
      fetch(weekUrl,  { headers: wakaHeaders, cache: "no-store" }),
    ]);

    // ── Today (cumulative_total.seconds) ──
    const todayJson = todayRes.ok ? await todayRes.json() : null;
    const codedToday: number = todayJson?.cumulative_total?.seconds ?? 0;

    // ── Last 7 Days (cumulative_total.seconds) ──
    const weekJson = weekRes.ok ? await weekRes.json() : null;
    const codedThisWeek: number = weekJson?.cumulative_total?.seconds ?? 0;

    // ── Feed items from the weekly summaries (one entry per day) ──
    const days: WTSummary[] = weekJson?.data ?? [];

    const items = days.flatMap<ActivityItem>((day) => {
      if (day.grand_total.total_seconds < 60) return [];

      const topProject = day.projects?.[0];
      const langs = (day.languages ?? [])
        .filter((l) => l.percent >= 3)
        .slice(0, 4)
        .map((l) => ({ name: l.name, percent: Math.round(l.percent) }));

      const [yr, mo, dy] = day.range.date.split("-").map(Number);
      const sessionTs = Date.UTC(yr, mo - 1, dy, 12, 0, 0, 0);
      return [
        {
          id: `wt-${day.range.date}`,
          source: "wakatime",
          kind: "code-session",
          title: topProject
            ? `${humanDuration(day.grand_total.total_seconds)} on ${topProject.name}`
            : `${humanDuration(day.grand_total.total_seconds)} coded`,
          subtitle: langs.length ? langs.map((l) => l.name).join(" · ") : "VS Code session",
          url: `https://wakatime.com/@${siteMetadata.handles.wakatime || "current"}`,
          timestamp: sessionTs,
          meta: {
            duration: day.grand_total.text,
            durationSeconds: day.grand_total.total_seconds,
            project: topProject?.name,
            languages: langs,
            badge: "VS Code",
          },
        },
      ];
    });

    return { items, codedToday, codedThisWeek };
  } catch {
    return empty;
  }
}


/* ===================================================================== */
/*  Assembly                                                              */
/* ===================================================================== */

export async function getActivityFeed(): Promise<ActivityFeed> {
  const { github } = siteMetadata.handles;
  const [gh, waka] = await Promise.all([fetchGithub(github), fetchWakaTime()]);

  const items = [...gh, ...waka.items]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 60);

  const stats: ActivityStats = {
    codedToday: waka.codedToday,
    codedThisWeek: waka.codedThisWeek,
  };

  return {
    items,
    stats,
    moreUrl: `https://github.com/${github}`,
  };
}

export function groupByDay(items: ActivityItem[]) {
  const groups: Record<string, ActivityItem[]> = {};
  for (const it of items) {
    const key = new Date(it.timestamp).toISOString().split("T")[0];
    (groups[key] ||= []).push(it);
  }
  return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export { humanDuration };
