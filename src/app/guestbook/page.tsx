import React from "react";
import { Metadata } from "next";
import { MessageSquareText, Shield, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import {
  countMessages,
  getUserMessageId,
  listMessages,
} from "@/lib/guestbook";
import { isRedisConfigured } from "@/lib/redis";
import { siteMetadata } from "@/data/siteMetadata";
import { Panel, PanelContent, PanelHeader } from "@/components/panel";
import { MessageForm } from "@/components/guestbook/message-form";
import { MessageItem } from "@/components/guestbook/message-item";
import {
  SignInWithGitHub,
  SignOutButton,
} from "@/components/guestbook/sign-in-button";

// Route is already request-dependent because auth() reads cookies — declare
// it explicitly so nobody's misled into thinking the list is cached.
export const dynamic = "force-dynamic";

const pageTitle = "Guestbook";
const pageDescription =
  "A public wall of notes from visitors. Sign in with GitHub and leave a hello, a recommendation, or a memory.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: `${pageTitle} | ${siteMetadata.author}`,
    description: pageDescription,
    url: `${siteMetadata.siteUrl}/guestbook`,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${siteMetadata.author}`,
    description: pageDescription,
    images: [siteMetadata.socialBanner],
    creator: "@sarifInsaan",
  },
  alternates: { canonical: `${siteMetadata.siteUrl}/guestbook` },
};

const ADMIN = (process.env.ADMIN_GITHUB_USERNAME ?? "").toLowerCase();

export default async function GuestbookPage() {
  const session = await auth();
  const viewer = session?.user;

  const [messages, total, viewerMessageId] = await Promise.all([
    listMessages(200),
    countMessages(),
    // Check Redis directly rather than probing the truncated message list —
    // a long-tail signature older than the 200-row window would otherwise
    // appear as "not signed" in the UI even though the server will reject
    // the next submission.
    viewer?.id ? getUserMessageId(viewer.id) : Promise.resolve(null),
  ]);

  const viewerLogin = viewer?.login?.toLowerCase() ?? "";
  const isAdmin = Boolean(ADMIN && viewerLogin === ADMIN);
  const hasSigned = Boolean(viewerMessageId);

  // listMessages() sorts pinned-first, so messages[0] isn't necessarily the
  // newest. Compute the true latest by timestamp for the stats strip.
  const latestMessage = messages.reduce<(typeof messages)[number] | null>(
    (latest, m) => (!latest || m.createdAt > latest.createdAt ? m : latest),
    null
  );

  return (
    <React.Fragment>
      <Panel className="mt-6">
        <PanelHeader>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg">
              <MessageSquareText className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Guestbook
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Leave a note — a hello, a recommendation, a memory. Signed with
                your GitHub profile so it&apos;s really you.
              </p>
            </div>
          </div>
        </PanelHeader>

        {/* Stats strip */}
        <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 border-r border-dashed border-gray-200 dark:border-gray-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Signatures
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
              {total.toLocaleString()}
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Latest
            </div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 truncate">
              {latestMessage ? `@${latestMessage.username}` : "—"}
            </div>
          </div>
        </div>

        {/* Form / auth prompt */}
        {!isRedisConfigured ? (
          <PanelContent>
            <div className="rounded-md border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white">
                Guestbook isn&apos;t configured yet.
              </p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed">
                Set <code>UPSTASH_REDIS_REST_URL</code>,{" "}
                <code>UPSTASH_REDIS_REST_TOKEN</code>, <code>AUTH_SECRET</code>,{" "}
                <code>AUTH_GITHUB_ID</code>, and <code>AUTH_GITHUB_SECRET</code>{" "}
                in your environment.
              </p>
            </div>
          </PanelContent>
        ) : !viewer ? (
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Sparkles className="size-4 text-teal-600 dark:text-teal-400" />
                Sign in with GitHub to leave a note. One message per visitor.
              </div>
              <SignInWithGitHub />
            </div>
          </div>
        ) : hasSigned ? (
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span>
                  You&apos;ve already signed the wall — thank you{" "}
                  <span className="font-mono text-[13px] text-teal-600 dark:text-teal-400">
                    @{viewer.login}
                  </span>
                  . Delete your entry below to post a new one.
                </span>
                {isAdmin && <AdminBadge />}
              </div>
              <SignOutButton />
            </div>
            {isAdmin && <AdminModeNotice />}
          </div>
        ) : (
          <div className="border-b border-gray-200 dark:border-gray-800">
            <MessageForm
              user={{
                name: viewer.name || viewer.login || "Anonymous",
                login: viewer.login || "",
                image: viewer.image || "",
              }}
            />
            <div className="flex items-center justify-between gap-3 px-4 pb-3">
              {isAdmin ? <AdminBadge /> : <span />}
              <SignOutButton />
            </div>
            {isAdmin && (
              <div className="px-4 pb-4">
                <AdminModeNotice />
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        <PanelContent className="p-0">
          {messages.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No signatures yet.
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                Be the first to sign the wall ↑
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-dashed divide-gray-200 dark:divide-gray-800">
              {messages.map((m) => {
                const isOwn = Boolean(viewer?.id && viewer.id === m.userId);
                const canDelete = Boolean(viewer?.id && (isOwn || isAdmin));
                const isModAction = Boolean(isAdmin && !isOwn);
                return (
                  <MessageItem
                    key={m.id}
                    id={m.id}
                    name={m.name}
                    username={m.username}
                    avatar={m.avatar}
                    message={m.message}
                    createdAt={m.createdAt}
                    pinned={m.pinned}
                    canDelete={canDelete}
                    canPin={isAdmin}
                    isOwn={isOwn}
                    isModAction={isModAction}
                  />
                );
              })}
            </ul>
          )}
        </PanelContent>
      </Panel>
    </React.Fragment>
  );
}

/* ---------- admin affordances ---------- */

function AdminBadge() {
  return (
    <span
      title="You're signed in as admin — you can pin or remove any message."
      className="inline-flex shrink-0 items-center gap-1 rounded border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-rose-600 dark:text-rose-400"
    >
      <Shield className="size-2.5" />
      admin
    </span>
  );
}

function AdminModeNotice() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
      <Shield className="mt-0.5 size-3.5 shrink-0" />
      <span className="leading-relaxed">
        <span className="font-medium">Admin mode.</span> You can{" "}
        <span className="font-mono text-[11px]">Pin</span> or{" "}
        <span className="font-mono text-[11px]">Remove</span> any message — the
        controls appear on the right of each entry. Removed messages cannot be
        restored.
      </span>
    </div>
  );
}
