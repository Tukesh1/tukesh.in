"use client";

import React from "react";
import { ChevronsUpDown, ChevronsDownUp, ExternalLink } from "lucide-react";
import Image from "next/image";
import * as Collapsible from "@radix-ui/react-collapsible";

interface Project {
  id: string;
  title: string;
  period: {
    start: string;
    end?: string;
  };
  link?: string;
  skills: string[];
  description: string | string[];
  thumbnail?: string;
  priority?: boolean;
  isExpanded?: boolean;
}

interface ProjectItemProps {
  project: Project;
  className?: string;
}

export function ProjectItem({ project, className }: ProjectItemProps) {
  const { start, end } = project.period;
  const isOngoing = !end;
  const [open, setOpen] = React.useState(Boolean(project.isExpanded));
  const points: string[] = Array.isArray(project.description)
    ? project.description
    : project.description
    ? [String(project.description)]
    : [];

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} asChild>
      <div className={className}>
        <div className="flex items-center">
          {/* Project Icon */}
          <div className="mx-4 flex size-6 shrink-0 items-center justify-center text-gray-500 select-none" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 256 256"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,120,47.65,76,128,32l80.35,44Zm8,99.64V133.83l80-43.78v85.76Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Project Content */}
          <div className="flex-1 border-l border-dashed border-gray-300 dark:border-gray-600">
            <Collapsible.Trigger className="group/project flex w-full items-center gap-4 p-4 pr-2 text-left select-none">
              <div className="flex-1">
                <h3 className="mb-1 leading-snug font-medium text-balance">
                  {project.title}
                </h3>

                <dl className="text-sm text-gray-600 dark:text-gray-400">
                  <dt className="sr-only">Period</dt>
                  <dd className="flex items-center gap-0.5">
                    <span>{start}</span>
                    <span className="font-mono">—</span>
                    {isOngoing ? (
                      <>
                        <span>Present</span>
                      </>
                    ) : (
                      <span>{end}</span>
                    )}
                  </dd>
                </dl>
              </div>

              {/* External Link */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex size-6 shrink-0 items-center  justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 after:absolute after:-inset-2"
                  onClick={(e) => e.stopPropagation()}
                  title="View Project"
                >
                  <ExternalLink className="pointer-events-none size-4" />
                  <span className="sr-only font-mono">Open Project Link</span>
                </a>
              )}

              <div
                className="shrink-0 text-gray-500 [&_svg]:size-4"
                aria-hidden="true"
              >
                <ChevronsDownUp className="hidden group-data-[state=open]/project:block" />
                <ChevronsUpDown className="hidden group-data-[state=closed]/project:block" />
              </div>
            </Collapsible.Trigger>
          </div>
        </div>

        <Collapsible.Content className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="relative border-t border-b border-dashed border-gray-300 dark:border-gray-600 p-4">
            <div aria-hidden className="hidden md:block absolute left-[33.333%] top-0 bottom-0 border-l border-dashed border-gray-300 dark:border-gray-600" />
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1 flex items-center justify-center">
                {project.thumbnail ? (
                  <div className="w-full max-w-[220px] md:max-w-none">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      {open && (
                        <Image
                          src={project.thumbnail}
                          alt={`Thumbnail of ${project.title}`}
                          fill
                          sizes="(min-width: 768px) 220px, 80vw"
                          loading="lazy"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-md bg-zinc-100 dark:bg-zinc-900" />
                )}
              </div>
              {/* Description and skills column */}
              <div className="md:col-span-2 md:pl-6">
                {points.length > 0 && (
                  <div className="prose prose-sm max-w-none">
                    {points.length === 1 ? (
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{points[0]}</p>
                    ) : (
                      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-1">
                        {points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {project.skills.length > 0 && (
                  <ul className={`flex flex-wrap gap-1.5 mt-4 ${points.length > 1 ? 'ml-5' : ''}`}>
                    {project.skills.map((skill, index) => (
                      <li key={index} className="flex">
                        <span className="inline-flex items-center rounded-lg border border-transparent bg-zinc-50 px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-zinc-900 dark:text-gray-400">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
