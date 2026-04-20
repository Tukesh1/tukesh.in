"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Linear-style chorded shortcuts: press `g` then a second key to navigate.
 *
 *   g h  → /          (home)
 *   g a  → /about
 *   g p  → /projects
 *   g b  → /post      (blog)
 *   g c  → /activity  (current)
 *
 * Disabled while the user is typing in inputs/textareas/contenteditable.
 */

const ROUTES: Record<string, string> = {
  h: "/",
  a: "/about",
  p: "/projects",
  b: "/post",
  c: "/activity",
};

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let awaitingSecondKey = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const reset = () => {
      awaitingSecondKey = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();

      if (awaitingSecondKey) {
        const route = ROUTES[key];
        reset();
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        return;
      }

      if (key === "g") {
        awaitingSecondKey = true;
        timeoutId = setTimeout(reset, 1200);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      reset();
    };
  }, [router]);

  return null;
}
