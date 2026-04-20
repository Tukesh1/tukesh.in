"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { XIcon, LinkedInIcon } from "./icons";

interface SharePostProps {
  title: string;
  url: string;
  twitterVia?: string;
}

interface ShareTargetProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function ShareTarget({ href, label, children }: ShareTargetProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

export function SharePost({ title, url, twitterVia }: SharePostProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const via = twitterVia ? `&via=${twitterVia}` : "";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
        Share this post
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <ShareTarget
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${via}`}
          label="Twitter"
        >
          <XIcon className="size-3.5 fill-current" />
        </ShareTarget>

        <ShareTarget
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          label="LinkedIn"
        >
          <LinkedInIcon className="size-3.5 fill-current" />
        </ShareTarget>

        <ShareTarget
          href={`https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`}
          label="Hacker News"
        >
          <span className="inline-flex size-3.5 items-center justify-center rounded-[3px] bg-[#ff6600] font-mono text-[9px] font-bold leading-none text-white">
            Y
          </span>
        </ShareTarget>

        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <LinkIcon className="size-3.5" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
