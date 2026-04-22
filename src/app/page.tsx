import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, FileText, MessageSquareText } from "lucide-react";

import { SOCIALS } from "@/data/socials";
import { FEATURED_PROJECTS, type Project } from "@/data/projects";
import { siteMetadata } from "@/data/siteMetadata";
import { SocialLink } from "@/components/social-link";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/components/panel";
import { VerifiedIcon } from "@/components/icons";
import { Typewriter } from "@/components/typewriter";

function FeaturedCard({ project }: { project: Project }) {
  const href = project.repo ?? project.live ?? "/projects";
  const isExternal = Boolean(project.repo || project.live);
  const tagline =
    project.tagline ??
    (Array.isArray(project.description)
      ? project.description[0]
      : project.description);

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group relative flex h-full flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg p-4 transition-all hover:border-gray-400 dark:hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:underline underline-offset-4 decoration-1">
          {project.title}
        </h3>
        <ArrowUpRight
          className="size-4 shrink-0 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        />
      </div>

      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
        {tagline}
      </p>

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {project.tags.slice(0, 4).map((tag) => (
          <li
            key={tag}
            className="inline-flex items-center rounded border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 font-mono text-[10px] text-gray-600 dark:text-gray-400"
          >
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}

export const metadata: Metadata = {
  title: siteMetadata.pages.home.title,
  description: siteMetadata.pages.home.description,
  openGraph: {
    title: siteMetadata.pages.home.title,
    description: siteMetadata.pages.home.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.pages.home.title,
    description: siteMetadata.pages.home.description,
    images: [siteMetadata.socialBanner],
    creator: "@sarifInsaan",
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
    types: {
      "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
};

export default function Home() {
  return (
    <React.Fragment>
      {/* Hero */}
      <Panel className="mt-6">
        <PanelHeader className="lg:flex lg:items-start lg:gap-10">
          <div className="lg:w-2/3">
            <PanelTitle className="text-2xl font-bold flex items-center gap-2">
              {siteMetadata.author}
              <VerifiedIcon
                className="inline-block size-[0.8em] translate-y-px text-sky-500 select-none"
                aria-hidden="true"
              />
            </PanelTitle>
            <p className="text-sm text-balance text-muted-foreground dark:text-gray-400 select-none">
              <Typewriter
                phrases={[
                  "Open Source Contributor",
                  "Software Engineer",
                  "Always learning, always shipping.",
                ]}
              />
            </p>
          </div>
        </PanelHeader>

        <PanelContent className="lg:flex lg:flex-row lg:items-start gap-10">
          <div className="lg:w-2/3 text-center lg:text-left">
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              I&apos;m a software developer specializing in building scalable web
              applications with clean and intuitive user interfaces using{" "}
              <strong>React, TypeScript, and Node.js</strong>.
            </p>
            <p className="mt-6 text-gray-700 dark:text-gray-300">
              Currently, I&apos;m building{" "}
              <a
                href="https://github.com/Tukesh1/codexp-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                codexp-ai
              </a>
              {" "}— an AI-powered platform that explains, documents, and
              visualizes source code, helping developers understand and onboard
              to codebases faster. If you&apos;d like to collaborate, please{" "}
              <a
                href={`mailto:${siteMetadata.social.email}`}
                className="border-b inline-block"
              >
                send me an email
              </a>{" "}
              or reach out on any of my social handles.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-4 mt-6">
              {SOCIALS.map((social) => (
                <SocialLink
                  key={social.label}
                  aria-label={`Follow on ${social.label}`}
                  href={social.href}
                  icon={social.icon}
                />
              ))}
            </div>

            <div>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold border-b transition-all text-gray-400 dark:text-gray-300 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                <FileText className="size-4" aria-hidden="true" />
                Resume
              </a>
            </div>
          </div>

          <div className="lg:w-1/3 flex justify-center lg:justify-end lg:mt-0 mt-6">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full ring-2 ring-sky-500/20 dark:ring-sky-400/20 shadow-lg overflow-hidden max-w-sm mx-auto p-4">
              <Image
                src="/assets/profile.png"
                alt={`${siteMetadata.author} — avatar`}
                priority
                fill
                sizes="(min-width: 768px) 14rem, 10rem"
                className="object-cover object-top"
              />
            </div>
          </div>
        </PanelContent>
      </Panel>

      {/* Guestbook strip */}
      <Link
        href="/guestbook"
        className="group mt-8 flex items-center justify-between gap-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg px-4 py-3 transition-colors hover:border-teal-500/40 hover:bg-teal-500/[0.03]"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <MessageSquareText
            className="size-4 shrink-0 text-teal-600 dark:text-teal-400"
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Guestbook
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700" aria-hidden="true">
            ·
          </span>
          <span className="truncate text-sm text-gray-700 dark:text-gray-300">
            Leave a note — a hello, a recommendation, or a memory.
          </span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          sign
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>

      {/* Featured work */}
      {FEATURED_PROJECTS.length > 0 && (
        <Panel id="work" className="mt-8">
          <PanelHeader>
            <PanelTitle className="text-xl font-bold flex items-center justify-between">
              <span>Cool Stuff I&apos;m Working On</span>
              <Link
                href="/projects"
                className="text-xs font-mono font-normal text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 inline-flex items-center gap-1 transition-colors"
              >
                all projects <ArrowUpRight className="size-3" />
              </Link>
            </PanelTitle>
          </PanelHeader>
          <PanelContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURED_PROJECTS.map((project) => (
                <FeaturedCard key={project.title} project={project} />
              ))}
            </div>
          </PanelContent>
        </Panel>
      )}
    </React.Fragment>
  );
}
