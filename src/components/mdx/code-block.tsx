"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "../../lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string;
}

/**
 * Visible height before the "Show more" affordance kicks in. Roughly 14 lines
 * at the current 13px / 1.65 line-height. Anything shorter renders fully.
 */
const COLLAPSED_MAX_HEIGHT = "22rem";

/**
 * Wraps rehype-pretty-code output with a Medium-style chrome:
 *  - language badge + copy-to-clipboard
 *  - auto-collapse for long snippets (~10+ lines) with a gradient fade
 */
export function CodeBlock({
  children,
  className,
  ...rest
}: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<string | undefined>(undefined);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setLang(el.getAttribute("data-language") ?? undefined);

    const measure = () => {
      if (!ref.current) return;
      setOverflows(ref.current.scrollHeight > ref.current.clientHeight + 4);
    };
    measure();

    // Shiki content is server-rendered and doesn't change post-mount, but
    // fonts may load later and shift metrics. One rAF catches that.
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onCopy = async () => {
    const el = ref.current;
    if (!el) return;
    const text = el.innerText;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — silently fail */
    }
  };

  const showCollapseUI = overflows;
  const isCollapsed = showCollapseUI && !expanded;

  return (
    <figure className="group relative my-6 sm:my-8">
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {lang ? (
          <span className="pointer-events-none rounded-md border border-gray-200 bg-white/80 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-gray-600 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300">
            {lang}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/80 px-2 py-1 font-mono text-[10px] font-medium text-gray-600 backdrop-blur transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <pre
          ref={ref}
          style={isCollapsed ? { maxHeight: COLLAPSED_MAX_HEIGHT } : undefined}
          className={cn(
            "overflow-x-auto rounded-lg border border-gray-200 bg-[#fafafa] py-4 pr-4 pl-0 text-[13px] leading-relaxed transition-[max-height] duration-300 ease-out dark:border-gray-800 dark:bg-[#0b0b0f]",
            "[&>code]:grid [&>code]:w-full [&>code]:min-w-0",
            isCollapsed && "overflow-y-hidden",
            className,
          )}
          {...rest}
        >
          {children}
        </pre>

        {isCollapsed ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-lg bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent dark:from-[#0b0b0f] dark:via-[#0b0b0f]/80"
          />
        ) : null}
      </div>

      {showCollapseUI ? (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-[11px] font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-3" />
                Show more
              </>
            )}
          </button>
        </div>
      ) : null}
    </figure>
  );
}
