"use client";
import React, { useState } from "react";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPERIENCES } from "@/data/experience";

/**
 * Renders a markdown-flavoured detail string.
 * Supports: **bold** and [link text](url).
 */
function renderDetail(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex: matches **bold** or [text](url)
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push plain text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      // **bold**
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2] !== undefined && match[3] !== undefined) {
      // [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          {match[2]}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  // Push any remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function WorkExperience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-dashed divide-gray-200 dark:divide-gray-800">
      {EXPERIENCES.map((exp, idx) => {
        const isOpen = open === idx;
        return (
          <div key={exp.company} className="relative">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={`exp-details-${idx}`}
              className="w-full text-left px-4 py-5 grid grid-cols-[auto_1fr_auto] items-start gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/40"
            >
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-neutral-700 shadow-sm dark:border-gray-800 dark:bg-dark-bg dark:text-neutral-200"
                aria-hidden="true"
              >
                <Briefcase className="size-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-base text-gray-900 dark:text-white">
                    {exp.company}
                  </span>
                  {exp.current && (
                    <span className="inline-flex items-center gap-1 rounded border border-teal-600/30 px-1.5 py-0.5 font-mono text-[10px] text-teal-600 dark:text-teal-400">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-teal-500" />
                      </span>
                      now
                    </span>
                  )}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">
                  {exp.role}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                  <span className="font-mono">{exp.duration}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" /> {exp.location}
                  </span>
                </div>
              </div>

              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-neutral-400 transition-transform mt-1",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <div
              id={`exp-details-${idx}`}
              role="region"
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-5 pl-[3.75rem]">
                  <ul className="list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {exp.details.map((d, i) => (
                      <li key={i}>{renderDetail(d)}</li>
                    ))}
                  </ul>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <li
                        key={skill}
                        className="inline-flex items-center rounded border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
