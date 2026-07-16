"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import { ThemeToggler } from "./theme-toggle";
import React from "react";

const navItems = {
  "/": { name: "home" },
  "/about": { name: "about" },
  "/projects": { name: "projects" },
  "/post": { name: "post" },
  "/activity": { name: "activity" },
};

export function Header() {
  const pathname = usePathname() || "/";

  return (
    <header className="mb-10 tracking-tight mt-10">
      <div className="lg:sticky lg:top-20">
        <nav
          className="fade relative scroll-pr-6 px-0 pb-0 md:relative md:overflow-auto"
          id="nav"
          aria-label="Primary"
        >
          <div className="flex w-full flex-row justify-between items-center">
            <div className="flex flex-row justify-between">
              {Object.entries(navItems).map(([path, { name }]) => {
                const isActive = path === pathname;
                return (
                  <Link
                    key={path}
                    href={path}
                    // /activity hits GitHub Search + WakaTime on regen — don't
                    // wake ISR via viewport prefetch from every page.
                    prefetch={path === "/activity" ? false : undefined}
                    className={cn(
                      "flex align-middle transition-colors hover:text-neutral-900 dark:hover:text-neutral-100",
                      isActive
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <span className="relative px-2 py-1">
                      {name}
                      <span
                        className={cn(
                          "absolute inset-x-2 bottom-0 h-px bg-neutral-400 dark:bg-neutral-500 transition-opacity",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div>
              <ThemeToggler />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
