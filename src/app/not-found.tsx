import type { Metadata } from "next";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="flex-1 flex items-center justify-center py-20 sm:py-28">
      <div className="text-center max-w-md px-4">
        <div className="relative inline-block">
          <span
            aria-hidden="true"
            className="font-mono text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter text-gray-100 dark:text-neutral-900 select-none"
          >
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-gray-700 to-gray-400 dark:from-gray-100 dark:to-gray-500">
            404
          </span>
        </div>

        <h1 className="mt-6 text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          This page went missing.
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The link you followed may be broken, or the page may have been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg px-3.5 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            <Home className="size-4" aria-hidden="true" />
            Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Browse projects
          </Link>
        </div>
      </div>
    </section>
  );
}
